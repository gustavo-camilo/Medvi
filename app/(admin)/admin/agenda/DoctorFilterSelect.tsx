'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function DoctorFilterSelect({
  doctors,
  current,
}: {
  doctors: Array<{ id: string; name: string }>;
  current?: string;
}) {
  const router = useRouter();
  const search = useSearchParams();
  return (
    <select
      defaultValue={current ?? ''}
      onChange={(e) => {
        const sp = new URLSearchParams(search.toString());
        if (e.target.value) sp.set('doctor', e.target.value);
        else sp.delete('doctor');
        router.push(`/admin/agenda?${sp.toString()}`);
      }}
      className="rounded-xl border border-border bg-cream px-3 py-2 text-sm"
    >
      <option value="">Todos os médicos</option>
      {doctors.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>
  );
}
