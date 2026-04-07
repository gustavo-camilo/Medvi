import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Video } from 'lucide-react';

export function AppointmentCard({
  startsAt,
  status,
  doctorName,
  videoLink,
}: {
  startsAt: string;
  status: string;
  doctorName?: string;
  videoLink?: string | null;
}) {
  const date = new Date(startsAt);
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-forest">
            <CalendarDays className="h-4 w-4" aria-hidden />
            {date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
          </div>
          {doctorName && <p className="mt-2 font-display text-lg text-ink">{doctorName}</p>}
          <p className="text-xs text-muted-foreground">{status}</p>
        </div>
        {videoLink && (
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-forest px-3 py-1 text-xs text-cream"
          >
            <Video className="h-3 w-3" /> Entrar
          </a>
        )}
      </CardContent>
    </Card>
  );
}
