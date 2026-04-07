import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';

const patchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  crm: z.string().max(40).nullable().optional(),
  specialty: z.string().max(80).nullable().optional(),
  bio: z.string().max(2000).nullable().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { supabase } = auth;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });

  const { error: updErr } = await supabase.from('doctors').update(parsed.data).eq('id', id);
  if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { supabase } = auth;
  // Soft-delete: mark inactive
  const { error: updErr } = await supabase.from('doctors').update({ active: false }).eq('id', id);
  if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
