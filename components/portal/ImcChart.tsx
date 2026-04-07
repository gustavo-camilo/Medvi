'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export type HealthPoint = { date: string; weight: number };

export function ImcChart({ data }: { data: HealthPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        Registre seu peso para começar a acompanhar.
      </div>
    );
  }
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
          <XAxis dataKey="date" stroke="#5A5A57" fontSize={12} />
          <YAxis stroke="#5A5A57" fontSize={12} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ background: '#FAF8F5', border: '1px solid #E5E1D8', borderRadius: 12 }} />
          <Line type="monotone" dataKey="weight" stroke="#1F4D3A" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
