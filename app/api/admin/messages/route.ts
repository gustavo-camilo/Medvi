import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';

const postSchema = z.object({
  thread_id: z.string().uuid(),
  body: z.string().min(1).max(4000),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { supabase, user } = auth;

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });

  const { data: msg, error: insErr } = await supabase
    .from('messages')
    .insert({
      thread_id: parsed.data.thread_id,
      sender_role: 'admin',
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
