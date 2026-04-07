import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAnonServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const isDev = process.env.NODE_ENV !== 'production';

function errorBody(message: string, detail?: unknown) {
  return isDev && detail !== undefined ? { ok: false, error: message, detail } : { ok: false, error: message };
}

// Patient contact fields are always required — the client forwards them
// either from the intake form (via sessionStorage) or from the guest form.
// We do not read the `leads` row server-side because its RLS blocks anon SELECT.
const bodySchema = z.object({
  doctor_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  lead_id: z.string().uuid().optional(),
  patient_name: z.string().min(2).max(120),
  patient_email: z.string().email(),
  patient_phone: z.string().min(8).max(40),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(errorBody('JSON inválido'), { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dados inválidos', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const supabase = supabaseAnonServer();

    // Fetch slot duration from the first active rule for this doctor
    const { data: rule } = await supabase
      .from('availability_rules')
      .select('slot_duration_minutes')
      .eq('doctor_id', data.doctor_id)
      .eq('active', true)
      .limit(1)
      .maybeSingle();
    const slotMin = (rule?.slot_duration_minutes as number | undefined) ?? 30;

    const startsAt = new Date(data.starts_at);
    const endsAt = new Date(startsAt.getTime() + slotMin * 60_000);

    const { data: inserted, error } = await supabase
      .from('appointments')
      .insert({
        doctor_id: data.doctor_id,
        lead_id: data.lead_id ?? null,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: 'scheduled',
        patient_name: data.patient_name,
        patient_email: data.patient_email,
        patient_phone: data.patient_phone,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[api/appointments] insert error', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      if (error.code === '23P01') {
        return NextResponse.json(errorBody('Horário já reservado'), { status: 409 });
      }
      return NextResponse.json(
        errorBody(`Falha ao agendar: ${error.message}`, { code: error.code, hint: error.hint }),
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, id: inserted.id });
  } catch (e) {
    console.error('[api/appointments] unexpected', e);
    const message = e instanceof Error ? e.message : 'Erro desconhecido';
    return NextResponse.json(errorBody(`Erro interno: ${message}`), { status: 500 });
  }
}
