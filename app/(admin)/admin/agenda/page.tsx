import { createServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatInTimeZone } from 'date-fns-tz';
import { DoctorFilterSelect } from './DoctorFilterSelect';

export const dynamic = 'force-dynamic';

const TZ = 'America/Sao_Paulo';
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 08..20

type SearchParams = Promise<{ doctor?: string }>;

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // Make Monday start
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function AgendaPage({ searchParams }: { searchParams: SearchParams }) {
  const { doctor } = await searchParams;
  const supabase = await createServerClient();

  const { data: doctors } = await supabase.from('doctors').select('id,name').order('name');

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  let query = supabase
    .from('appointments')
    .select('id,doctor_id,starts_at,ends_at,status,patient_name')
    .gte('starts_at', weekStart.toISOString())
    .lt('starts_at', weekEnd.toISOString());
  if (doctor) query = query.eq('doctor_id', doctor);

  const { data: apps } = await query;

  const days: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Agenda</h1>
          <p className="text-sm text-muted-foreground">Semana atual.</p>
        </div>
        <DoctorFilterSelect
          doctors={(doctors ?? []).map((d) => ({ id: d.id as string, name: d.name as string }))}
          current={doctor}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {formatInTimeZone(weekStart, TZ, "d 'de' MMM")} —{' '}
            {formatInTimeZone(new Date(weekEnd.getTime() - 1), TZ, "d 'de' MMM")}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <div className="grid min-w-[900px] grid-cols-[60px_repeat(7,1fr)] border-t border-border">
            <div />
            {days.map((d) => (
              <div key={+d} className="border-l border-border px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                {formatInTimeZone(d, TZ, 'EEE d/M').replace('.', '')}
              </div>
            ))}
            {HOURS.flatMap((h) => [
              (
                <div key={`h-${h}`} className="border-t border-border px-2 py-2 text-right text-xs text-muted-foreground">
                  {String(h).padStart(2, '0')}:00
                </div>
              ),
              ...days.map((d) => {
                  const cellStart = new Date(d);
                  cellStart.setHours(h, 0, 0, 0);
                  const cellEnd = new Date(cellStart);
                  cellEnd.setHours(h + 1);
                  const inCell = (apps ?? []).filter((a) => {
                    const s = new Date(a.starts_at as string);
                    return s >= cellStart && s < cellEnd;
                  });
                  return (
                    <div key={`${+d}-${h}`} className="min-h-14 border-l border-t border-border p-1">
                      {inCell.map((a) => (
                        <div
                          key={a.id as string}
                          className="mb-1 rounded-md bg-forest px-2 py-1 text-xs text-cream"
                          title={a.patient_name as string}
                        >
                          {formatInTimeZone(new Date(a.starts_at as string), TZ, 'HH:mm')}{' '}
                          {(a.patient_name as string) ?? '—'}
                        </div>
                      ))}
                    </div>
                  );
                }),
            ])}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
