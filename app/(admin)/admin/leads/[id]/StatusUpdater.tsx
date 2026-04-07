'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['novo', 'em_contato', 'agendado', 'convertido', 'descartado'];

export function StatusUpdater({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = React.useState(currentStatus);
  const [saving, setSaving] = React.useState(false);

  const save = async (next: string) => {
    setStatus(next);
    setSaving(true);
    await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground" htmlFor="lead-status">
        Status
      </label>
      <select
        id="lead-status"
        value={status}
        onChange={(e) => save(e.target.value)}
        disabled={saving}
        className="rounded-xl border border-border bg-cream px-3 py-2 text-sm text-ink"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
