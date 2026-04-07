import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { Users, CalendarDays, ShoppingBag, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();
  const now = new Date();
  const today = startOfDay(now);
  const weekStart = addDays(today, -6);
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const [leadsToday, leadsWeek, appsToday, ordersPending, recentLeads, upcomingApps] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString()),
    supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .gte('starts_at', today.toISOString())
      .lt('starts_at', tomorrow.toISOString()),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'aguardando_pagamento'),
    supabase
      .from('leads')
      .select('id,nome,email,telefone,objetivo,imc,status,created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('appointments')
      .select('id,patient_name,starts_at,status,doctor_id')
      .gte('starts_at', today.toISOString())
      .lt('starts_at', nextWeek.toISOString())
      .order('starts_at')
      .limit(10),
  ]);

  const kpis = [
    { label: 'Leads hoje', value: leadsToday.count ?? 0, icon: Users },
    { label: 'Leads na semana', value: leadsWeek.count ?? 0, icon: TrendingUp },
    { label: 'Consultas hoje', value: appsToday.count ?? 0, icon: CalendarDays },
    { label: 'Pedidos pendentes', value: ordersPending.count ?? 0, icon: ShoppingBag },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da clínica.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
                  <p className="mt-2 font-display text-3xl text-ink">{k.value}</p>
                </div>
                <Icon className="h-8 w-8 text-forest" aria-hidden />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Objetivo</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(recentLeads.data ?? []).map((l) => (
                  <tr key={l.id as string} className="border-b border-border last:border-0">
                    <td className="px-6 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="text-forest hover:underline">
                        {l.nome as string}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{(l.objetivo as string) ?? '—'}</td>
                    <td className="px-6 py-3">{(l.status as string) ?? 'novo'}</td>
                  </tr>
                ))}
                {(recentLeads.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-muted-foreground">
                      Nenhum lead ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultas nos próximos 7 dias</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Paciente</th>
                  <th className="px-6 py-3">Quando</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(upcomingApps.data ?? []).map((a) => (
                  <tr key={a.id as string} className="border-b border-border last:border-0">
                    <td className="px-6 py-3">{(a.patient_name as string) ?? '—'}</td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(a.starts_at as string).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                    </td>
                    <td className="px-6 py-3">{a.status as string}</td>
                  </tr>
                ))}
                {(upcomingApps.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-muted-foreground">
                      Sem consultas agendadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
