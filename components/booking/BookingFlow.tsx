'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';
import { formatPhone } from '@/lib/validators';
import { formatInTimeZone } from 'date-fns-tz';
import { DEFAULT_TZ } from '@/lib/scheduling';

export type DoctorOption = {
  id: string;
  slug: string;
  name: string;
  crm: string;
  specialty: string;
  bio: string;
  avatarUrl: string;
};

export type SerializedSlot = { startsAt: string; endsAt: string };

interface Props {
  doctors: DoctorOption[];
  slotsByDoctor: Record<string, SerializedSlot[]>;
  leadId?: string;
  preselectedDoctorId?: string;
}

function dateKey(iso: string): string {
  return formatInTimeZone(new Date(iso), DEFAULT_TZ, 'yyyy-MM-dd');
}

function dateLabel(key: string): string {
  // key = YYYY-MM-DD (São Paulo local). Parse safely.
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return formatInTimeZone(date, DEFAULT_TZ, "EEE, d 'de' MMM").replace('.', '');
}

function timeLabel(iso: string): string {
  return formatInTimeZone(new Date(iso), DEFAULT_TZ, 'HH:mm');
}

export function BookingFlow({ doctors, slotsByDoctor, leadId, preselectedDoctorId }: Props) {
  const router = useRouter();
  const [selectedDoctorId, setSelectedDoctorId] = React.useState<string | undefined>(
    preselectedDoctorId ?? doctors[0]?.id,
  );
  const [selectedDate, setSelectedDate] = React.useState<string | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = React.useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Patient contact fields. When coming from /qualificacao, they arrive via
  // sessionStorage because `leads` RLS blocks anon SELECT on the server.
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [prefilledFromStorage, setPrefilledFromStorage] = React.useState(false);

  React.useEffect(() => {
    if (!leadId) return;
    try {
      const raw = sessionStorage.getItem('medvi-patient');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { nome?: string; email?: string; telefone?: string };
      if (parsed.nome) setName(parsed.nome);
      if (parsed.email) setEmail(parsed.email);
      if (parsed.telefone) setPhone(parsed.telefone);
      setPrefilledFromStorage(true);
    } catch {
      /* ignore */
    }
  }, [leadId]);

  const slots = selectedDoctorId ? slotsByDoctor[selectedDoctorId] ?? [] : [];

  // Group slots by date
  const slotsByDate = React.useMemo(() => {
    const map = new Map<string, SerializedSlot[]>();
    for (const s of slots) {
      const k = dateKey(s.startsAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(s);
    }
    return map;
  }, [slots]);

  const availableDates = Array.from(slotsByDate.keys()).sort();

  // Auto-select first date
  React.useEffect(() => {
    if (selectedDoctorId && (!selectedDate || !slotsByDate.has(selectedDate))) {
      setSelectedDate(availableDates[0]);
      setSelectedSlot(undefined);
    }
  }, [selectedDoctorId, selectedDate, slotsByDate, availableDates]);

  const daySlots = selectedDate ? slotsByDate.get(selectedDate) ?? [] : [];
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Patient fields are always required — they come either from the intake form
  // (via sessionStorage) or from the guest form shown below.
  const canSubmit =
    !!selectedDoctorId && !!selectedSlot && !!name && !!email && !!phone;

  const onConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: selectedDoctorId,
          starts_at: selectedSlot,
          lead_id: leadId,
          patient_name: name,
          patient_email: email,
          patient_phone: phone,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? 'Falha ao agendar');
      }
      router.push('/obrigado?appointment=1');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
      setSubmitting(false);
    }
  };

  if (doctors.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-cream p-8 text-center">
        <p className="text-muted-foreground">
          Nenhum médico disponível no momento. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Doctor picker */}
      <section>
        <h2 className="mb-4 font-display text-xl text-ink">1. Escolha o médico</h2>
        <div
          role="radiogroup"
          aria-label="Selecionar médico"
          className="grid gap-4 sm:grid-cols-2"
        >
          {doctors.map((d) => {
            const active = d.id === selectedDoctorId;
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setSelectedDoctorId(d.id);
                  setSelectedSlot(undefined);
                }}
                className={cn(
                  'flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all',
                  active ? 'border-forest bg-forest-50' : 'border-border bg-cream hover:bg-forest-50',
                )}
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-forest-100">
                  <Image src={d.avatarUrl} alt={d.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-base text-ink">{d.name}</p>
                  <p className="text-xs text-forest">{d.specialty}</p>
                  <p className="text-xs text-muted-foreground">{d.crm}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Date picker */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-ink">
          <CalendarDays className="h-5 w-5 text-forest" aria-hidden /> 2. Escolha o dia
        </h2>
        {availableDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum horário disponível nos próximos 14 dias para este médico.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableDates.map((key) => {
              const active = key === selectedDate;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedDate(key);
                    setSelectedSlot(undefined);
                  }}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-all',
                    active
                      ? 'border-forest bg-forest text-cream'
                      : 'border-border bg-cream text-ink hover:border-forest hover:text-forest',
                  )}
                >
                  {dateLabel(key)}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Slot picker */}
      {daySlots.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-ink">
            <Clock className="h-5 w-5 text-forest" aria-hidden /> 3. Escolha o horário
          </h2>
          <div role="radiogroup" aria-label="Horários disponíveis" className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {daySlots.map((s) => {
              const active = s.startsAt === selectedSlot;
              return (
                <button
                  key={s.startsAt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedSlot(s.startsAt)}
                  className={cn(
                    'rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all',
                    active
                      ? 'border-forest bg-forest text-cream'
                      : 'border-border bg-cream text-ink hover:border-forest',
                  )}
                >
                  {timeLabel(s.startsAt)}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Patient info — hidden when prefilled from the intake form */}
      {!prefilledFromStorage && selectedSlot && (
        <section>
          <h2 className="mb-4 font-display text-xl text-ink">4. Seus dados</h2>
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="g-name">Nome completo</Label>
                <Input id="g-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-email">Email</Label>
                <Input id="g-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-phone">WhatsApp</Label>
                <Input
                  id="g-phone"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Summary + confirm */}
      {selectedSlot && selectedDoctor && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resumo</p>
              <p className="font-display text-lg text-ink">
                {selectedDoctor.name} — {dateLabel(dateKey(selectedSlot))} às {timeLabel(selectedSlot)}
              </p>
            </div>
            <Button onClick={onConfirm} disabled={!canSubmit || submitting} size="lg">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Agendando...
                </>
              ) : (
                'Confirmar agendamento'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
