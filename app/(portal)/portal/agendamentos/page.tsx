import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@/lib/supabase/server';
import { AppointmentCard } from '@/components/portal/AppointmentCard';
import { CalendarPlus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PortalAppointmentsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date().toISOString();
  const [upcoming, past] = await Promise.all([
    supabase
      .from('appointments')
      .select('id,starts_at,status,video_link')
      .eq('patient_id', user.id)
      .gte('starts_at', now)
      .order('starts_at'),
    supabase
      .from('appointments')
      .select('id,starts_at,status,video_link')
      .eq('patient_id', user.id)
      .lt('starts_at', now)
      .order('starts_at', { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Minhas consultas</h1>
        <Button asChild>
          <Link href="/agendar">
            <CalendarPlus className="h-4 w-4" aria-hidden /> Nova consulta
          </Link>
        </Button>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl text-ink">Próximas</h2>
        {(upcoming.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma consulta agendada.</p>
        ) : (
          <div className="grid gap-3">
            {(upcoming.data ?? []).map((a) => (
              <AppointmentCard
                key={a.id as string}
                startsAt={a.starts_at as string}
                status={a.status as string}
                videoLink={a.video_link as string | null}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-ink">Passadas</h2>
        {(past.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem histórico.</p>
        ) : (
          <div className="grid gap-3">
            {(past.data ?? []).map((a) => (
              <AppointmentCard
                key={a.id as string}
                startsAt={a.starts_at as string}
                status={a.status as string}
                videoLink={a.video_link as string | null}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
