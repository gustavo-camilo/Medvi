import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth-helpers';

const schema = z.object({
  thread_id: z.string().uuid(),
  body: z.string().min(1).max(4000),
});

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { supabase, user } = auth;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });

  // Verify the thread belongs to this user
  const { data: thread } = await supabase
    .from('message_threads')
    .select('id,patient_id')
    .eq('id', parsed.data.thread_id)
    .maybeSingle();
  if (!thread || thread.patient_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'Acesso negado' }, { status: 403 });
  }

  const { data: msg, error: insErr } = await supabase
    .from('messages')
    .insert({
      thread_id: parsed.data.thread_id,
      sender_role: 'patient',
      sender_id: user.id,
      body: parsed.data.body,
    })
    .select('id')
    .single();
  if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });

  await supabase
    .from('message_threads')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', parsed.data.thread_id);

  return NextResponse.json({ ok: true, id: msg.id });
}
