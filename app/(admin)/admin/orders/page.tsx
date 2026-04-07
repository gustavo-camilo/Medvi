import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { formatBRL } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function OrdersListPage() {
  const supabase = await createServerClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id,status,total_brl,payment_status,created_at,patient_id')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Pedidos</h1>
        <p className="text-sm text-muted-foreground">Todos os pedidos da clínica.</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((o) => (
                <tr key={o.id as string} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-mono text-xs">
                    <Link href={`/admin/orders/${o.id}`} className="text-forest hover:underline">
                      {(o.id as string).slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(o.created_at as string).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-3">{formatBRL(Number(o.total_brl ?? 0))}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-forest-50 px-3 py-1 text-xs text-forest">
                      {o.status as string}
                    </span>
                  </td>
                  <td className="px-6 py-3">{o.payment_status as string}</td>
                </tr>
              ))}
              {(orders ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum pedido ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
