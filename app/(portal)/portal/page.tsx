import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@/lib/supabase/server';
import { AppointmentCard } from '@/components/portal/AppointmentCard';
import { OrderCard } from '@/components/portal/OrderCard';
import { ImcChart, type HealthPoint } from '@/components/portal/ImcChart';
import { CalendarPlus, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PortalHomePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('nome').eq('id', user.id).maybeSingle();

  const [apps, orders, threads, log] = await Promise.all([
    supabase
      .from('appointments')
      .select('id,starts_at,status,video_link,doctor_id')
      .eq('patient_id', user.id)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')
      .limit(1),
    supabase
      .from('orders')
      .select('id,status,total_brl,created_at')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('message_threads')
      .select('unread_count_patient')
      .eq('patient_id', user.id),
    supabase
      .from('health_log')
      .select('date,weight_kg')
      .eq('patient_id', user.id)
      .order('date', { ascending: false })
      .limit(5),
  ]);

  const nextApp = apps.data?.[0];
  const lastOrder = orders.data?.[0];
  const unread = (threads.data ?? []).reduce((acc, t) => acc + (Number(t.unread_count_patient) || 0), 0);
  const points: HealthPoint[] = (log.data ?? [])
    .slice()
    .reverse()
    .map((p) => ({ date: (p.date as string).slice(5), weight: Number(p.weight_kg) }));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Olá,</p>
        <h1 className="font-display text-3xl text-ink">{(profile?.nome as string) ?? 'Paciente'}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próxima consulta</CardTitle>
          </CardHeader>
          <CardContent>
            {nextApp ? (
              <AppointmentCard
                startsAt={nextApp.starts_at as string}
                status={nextApp.status as string}
                videoLink={nextApp.video_link as string | null}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma consulta agendada.</p>
            )}
            <Button asChild size="sm" className="mt-4">
              <Link href="/agendar">
                <CalendarPlus className="h-4 w-4" aria-hidden /> Agendar nova consulta
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pedido atual</CardTitle>
          </CardHeader>
          <CardContent>
            {lastOrder ? (
              <OrderCard
                id={lastOrder.id as string}
                status={lastOrder.status as string}
                total={Number(lastOrder.total_brl ?? 0)}
                createdAt={lastOrder.created_at as string}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução do peso</CardTitle>
          </CardHeader>
          <CardContent>
            <ImcChart data={points} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mensagens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {unread > 0 ? `Você tem ${unread} mensagens não lidas.` : 'Sem mensagens novas.'}
            </p>
            <Button asChild size="sm" variant="secondary" className="mt-4">
              <Link href="/portal/mensagens">
                <MessageSquare className="h-4 w-4" aria-hidden /> Abrir chat
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
