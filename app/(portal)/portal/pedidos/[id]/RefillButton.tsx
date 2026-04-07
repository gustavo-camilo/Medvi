'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RefillButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const refill = async () => {
    setLoading(true);
    const res = await fetch('/api/portal/orders/refill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    });
    setLoading(false);
    if (res.ok) {
      const j = await res.json();
      router.push(`/portal/pedidos/${j.id}`);
    }
  };

  return (
    <Button onClick={refill} disabled={loading} variant="secondary">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      Pedir reposição
    </Button>
  );
}
