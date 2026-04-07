import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';

const hmRegex = /^\d{2}:\d{2}$/;

const putSchema = z.object({
  rules: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z.string().regex(hmRegex),
      endTime: z.string().regex(hmRegex),
      slotDurationMinutes: z.number().int().min(10).max(240),
    }),
  ),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { supabase } = auth;

  const body = await req.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ ok: false, error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 });

  // Replace all rules for this doctor
  const { error: delErr } = await supabase.from('availability_rules').delete().eq('doctor_id', id);
  if (delErr) return NextResponse.json({ ok: false, error: delErr.message }, { status: 500 });

  if (parsed.data.rules.length > 0) {
    const rows = parsed.data.rules.map((r) => ({
      doctor_id: id,
      day_of_week: r.dayOfWeek,
      start_time: r.startTime,
      end_time: r.endTime,
      slot_duration_minutes: r.slotDurationMinutes,
      active: true,
    }));
    const { error: insErr } = await supabase.from('availability_rules').insert(rows);
    if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
