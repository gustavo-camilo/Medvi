import { createServerClient } from '@/lib/supabase/server';
import { OrderCard } from '@/components/portal/OrderCard';

export const dynamic = 'force-dynamic';

export default async function PortalOrdersPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: orders } = await supabase
    .from('orders')
    .select('id,status,total_brl,created_at')
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Meus pedidos</h1>
      {(orders ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">Você ainda não fez pedidos.</p>
      ) : (
        <div className="grid gap-3">
          {(orders ?? []).map((o) => (
            <OrderCard
              key={o.id as string}
              id={o.id as string}
              status={o.status as string}
              total={Number(o.total_brl ?? 0)}
              createdAt={o.created_at as string}
            />
          ))}
        </div>
      )}
    </div>
  );
}
