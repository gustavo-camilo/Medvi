import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth-helpers';

const schema = z.object({ order_id: z.string().uuid() });

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { supabase, user } = auth;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });

  const { data: original } = await supabase
    .from('orders')
    .select('*')
    .eq('id', parsed.data.order_id)
    .eq('patient_id', user.id)
    .maybeSingle();

  if (!original) return NextResponse.json({ ok: false, error: 'Pedido não encontrado' }, { status: 404 });

  const { data: created, error: insErr } = await supabase
    .from('orders')
    .insert({
      patient_id: user.id,
      status: 'aguardando_pagamento',
      items: original.items,
      subtotal_brl: original.subtotal_brl,
      shipping_brl: original.shipping_brl,
      total_brl: original.total_brl,
      payment_method: original.payment_method,
      payment_status: 'pendente',
      shipping_address: original.shipping_address,
    })
    .select('id')
    .single();

  if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: created.id });
}
