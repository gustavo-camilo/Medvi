import { NextResponse, type NextRequest } from 'next/server';
import { intakeSchema } from '@/components/intake/schema';
import { supabaseAnonServer } from '@/lib/supabase/server';
import { sendLeadNotification } from '@/lib/email';
import { calculateBMI } from '@/lib/validators';

export const runtime = 'nodejs';

const isDev = process.env.NODE_ENV !== 'production';

/** Include raw error detail in responses only outside production. */
function errorBody(message: string, detail?: unknown) {
  return isDev && detail !== undefined ? { ok: false, error: message, detail } : { ok: false, error: message };
}

export async function POST(req: NextRequest) {
  // Fail fast if env vars are missing — gives a precise error instead of a generic 500.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    console.error('[api/leads] missing Supabase env vars');
    return NextResponse.json(
      errorBody(
        'Configuração do servidor incompleta. Faltam variáveis de ambiente do Supabase.',
      ),
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(errorBody('JSON inválido'), { status: 400 });
  }

  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('[api/leads] validation failed', parsed.error.flatten());
    return NextResponse.json(
      { ok: false, error: 'Dados inválidos', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const imc = Number(calculateBMI(data.pesoKg, data.alturaCm).toFixed(2));

  try {
    // Use the anon/publishable key. RLS in 0001_init.sql allows anon INSERT
    // when consentimento_lgpd = true, which we validated above.
    const supabase = supabaseAnonServer();
    const { data: inserted, error } = await supabase
      .from('leads')
      .insert({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf ?? null,
        peso_kg: data.pesoKg,
        altura_cm: data.alturaCm,
        imc,
        meta_perda_kg: data.metaPerdaKg,
        objetivo: data.objetivo,
        historico_medico: data.historicoMedico,
        consentimento_lgpd: data.consentimentoLgpd,
        status: 'novo',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[api/leads] supabase insert error', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      // Return real Supabase error in dev so the user can diagnose.
      return NextResponse.json(
        errorBody(`Falha ao salvar: ${error.message}`, {
          code: error.code,
          hint: error.hint,
        }),
        { status: 500 },
      );
    }

    // Fire-and-forget email (don't block on failures)
    sendLeadNotification({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      cpf: data.cpf,
      pesoKg: data.pesoKg,
      alturaCm: data.alturaCm,
      imc,
      metaPerdaKg: data.metaPerdaKg,
      objetivo: data.objetivo,
    }).catch((e) => console.error('[api/leads] email error', e));

    return NextResponse.json({ ok: true, id: inserted.id });
  } catch (e) {
    console.error('[api/leads] unexpected error', e);
    const message = e instanceof Error ? e.message : 'Erro desconhecido';
    return NextResponse.json(
      errorBody(`Erro interno do servidor: ${message}`),
      { status: 500 },
    );
  }
}
