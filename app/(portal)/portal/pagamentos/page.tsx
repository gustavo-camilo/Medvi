import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { formatBRL } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalPaymentsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // payments via orders RLS (join)
  const { data: orders } = await supabase
    .from('orders')
    .select('id')
    .eq('patient_id', user.id);
  const orderIds = (orders ?? []).map((o) => o.id as string);
  let payments: Array<Record<string, unknown>> = [];
  if (orderIds.length > 0) {
    const { data } = await supabase
      .from('payments')
      .select('id,amount_brl,method,status,paid_at,created_at,order_id')
      .in('order_id', orderIds)
      .order('created_at', { ascending: false });
    payments = (data ?? []) as Array<Record<string, unknown>>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Meus pagamentos</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Método</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id as string} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(p.created_at as string).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-3">{formatBRL(Number(p.amount_brl ?? 0))}</td>
                  <td className="px-6 py-3">{p.method as string}</td>
                  <td className="px-6 py-3">{p.status as string}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum pagamento registrado.
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
