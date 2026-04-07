import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { formatBRL } from '@/lib/format';
import { OrderEditor } from './OrderEditor';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="text-sm text-forest hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-1 font-display text-3xl text-ink">Pedido</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Total" v={formatBRL(Number(order.total_brl ?? 0))} />
            <Row k="Subtotal" v={formatBRL(Number(order.subtotal_brl ?? 0))} />
            <Row k="Frete" v={formatBRL(Number(order.shipping_brl ?? 0))} />
            <Row k="Método" v={(order.payment_method as string) ?? '—'} />
            <Row k="Pagamento" v={(order.payment_status as string) ?? '—'} />
            <Row k="Criado" v={new Date(order.created_at as string).toLocaleString('pt-BR')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atualizar status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderEditor
              orderId={id}
              initial={{
                status: (order.status as string) ?? 'aguardando_pagamento',
                trackingCode: (order.tracking_code as string) ?? '',
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="rounded-xl bg-muted p-4 text-xs">{JSON.stringify(order.items ?? [], null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-ink">{v}</span>
    </div>
  );
}
