'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STATUSES = [
  'aguardando_pagamento',
  'pago',
  'em_separacao',
  'enviado',
  'entregue',
  'cancelado',
] as const;

export function OrderEditor({
  orderId,
  initial,
}: {
  orderId: string;
  initial: { status: string; trackingCode: string };
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState(initial.status);
  const [trackingCode, setTrackingCode] = React.useState(initial.trackingCode);
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, tracking_code: trackingCode }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Status</Label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Código de rastreamento</Label>
        <Input value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} />
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
      </Button>
    </div>
  );
}
