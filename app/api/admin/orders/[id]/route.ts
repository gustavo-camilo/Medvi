import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';

const patchSchema = z.object({
  status: z
    .enum(['aguardando_pagamento', 'pago', 'em_separacao', 'enviado', 'entregue', 'cancelado'])
    .optional(),
  tracking_code: z.string().max(80).nullable().optional(),
  payment_status: z.enum(['pendente', 'aprovado', 'recusado', 'estornado']).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { supabase } = auth;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });

  const { error: updErr } = await supabase
    .from('orders')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
