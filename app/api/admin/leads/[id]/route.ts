import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';

const patchSchema = z.object({ status: z.string().min(1).max(40) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { supabase } = auth;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });

  const { error: updErr } = await supabase.from('leads').update({ status: parsed.data.status }).eq('id', id);
  if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
