'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export type LeadRow = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  objetivo: string | null;
  imc: number | null;
  status: string;
  created_at: string;
};

const STATUSES = ['todos', 'novo', 'em_contato', 'agendado', 'convertido', 'descartado'] as const;

export function LeadsFilter({ leads }: { leads: LeadRow[] }) {
  const [status, setStatus] = React.useState<string>('todos');

  const filtered = status === 'todos' ? leads : leads.filter((l) => l.status === status);

  return (
    <>
      <div className="flex flex-wrap gap-2 p-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              status === s
                ? 'border-forest bg-forest text-cream'
                : 'border-border bg-cream text-ink hover:border-forest',
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Telefone</th>
              <th className="px-6 py-3">Objetivo</th>
              <th className="px-6 py-3">IMC</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">
                  {new Date(l.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-3">
                  <Link href={`/admin/leads/${l.id}`} className="text-forest hover:underline">
                    {l.nome}
                  </Link>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{l.email}</td>
                <td className="px-6 py-3 text-muted-foreground">{l.telefone}</td>
                <td className="px-6 py-3">{l.objetivo ?? '—'}</td>
                <td className="px-6 py-3">{l.imc ?? '—'}</td>
                <td className="px-6 py-3">{l.status}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum lead encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
