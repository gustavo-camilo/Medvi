import { NextResponse, type NextRequest } from 'next/server';
import { intakeSchema } from '@/components/intake/schema';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendLeadNotification } from '@/lib/email';
import { calculateBMI } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dados inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const imc = Number(calculateBMI(data.pesoKg, data.alturaCm).toFixed(2));

  try {
    const supabase = supabaseAdmin();
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
      console.error('[api/leads] supabase insert error', error);
      return NextResponse.json(
        { ok: false, error: 'Falha ao salvar lead' },
        { status: 500 }
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
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
