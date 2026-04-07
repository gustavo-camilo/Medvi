import type { Metadata } from 'next';
import { SectionHeading } from '@/components/SectionHeading';
import { supabaseAnonServer } from '@/lib/supabase/server';
import {
  generateSlots,
  DEFAULT_TZ,
  type AvailabilityRule,
  type Override,
} from '@/lib/scheduling';
import { BookingFlow, type DoctorOption, type SerializedSlot } from '@/components/booking/BookingFlow';
import { doctorPhotos } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Agende sua consulta',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ lead_id?: string; doctor?: string }>;

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { lead_id, doctor: doctorSlug } = await searchParams;
  const supabase = supabaseAnonServer();

  const [{ data: doctorsData }, { data: rulesData }, { data: overridesData }] = await Promise.all([
    supabase.from('doctors').select('id,slug,name,crm,specialty,bio').eq('active', true).order('name'),
    supabase.from('availability_rules').select('doctor_id,day_of_week,start_time,end_time,slot_duration_minutes').eq('active', true),
    supabase.from('availability_overrides').select('doctor_id,date,start_time,end_time,type'),
  ]);

  const now = new Date();
  const horizon = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const { data: appointmentsData } = await supabase
    .from('appointments')
    .select('doctor_id,starts_at,ends_at,status')
    .in('status', ['scheduled', 'confirmed'])
    .gte('starts_at', now.toISOString())
    .lt('starts_at', horizon.toISOString());

  const doctors: DoctorOption[] = (doctorsData ?? []).map((d, i) => ({
    id: d.id as string,
    slug: d.slug as string,
    name: d.name as string,
    crm: (d.crm ?? '') as string,
    specialty: (d.specialty ?? '') as string,
    bio: (d.bio ?? '') as string,
    avatarUrl: doctorPhotos[i % doctorPhotos.length],
  }));

  const slotsByDoctor: Record<string, SerializedSlot[]> = {};
  for (const doc of doctors) {
    const rules: AvailabilityRule[] = (rulesData ?? [])
      .filter((r) => r.doctor_id === doc.id)
      .map((r) => ({
        dayOfWeek: r.day_of_week as number,
        startTime: (r.start_time as string).slice(0, 5),
        endTime: (r.end_time as string).slice(0, 5),
        slotDurationMinutes: r.slot_duration_minutes as number,
      }));
    const overrides: Override[] = (overridesData ?? [])
      .filter((o) => o.doctor_id === doc.id)
      .map((o) => ({
        date: o.date as string,
        startTime: (o.start_time as string).slice(0, 5),
        endTime: (o.end_time as string).slice(0, 5),
        type: o.type as 'block' | 'available',
      }));
    const booked = (appointmentsData ?? [])
      .filter((a) => a.doctor_id === doc.id)
      .map((a) => ({
        startsAt: new Date(a.starts_at as string),
        endsAt: new Date(a.ends_at as string),
      }));

    const slots = generateSlots({
      rules,
      overrides,
      bookedRanges: booked,
      fromDate: now,
      toDate: horizon,
      timezone: DEFAULT_TZ,
    });
    slotsByDoctor[doc.id] = slots.map((s) => ({
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
    }));
  }

  const preselectedDoctor = doctorSlug
    ? doctors.find((d) => d.slug === doctorSlug)?.id
    : undefined;

  return (
    <main className="min-h-screen bg-cream py-16">
      <div className="container">
        <SectionHeading
          eyebrow="Próximo passo"
          title="Agende sua consulta"
          subtitle="Escolha o médico, o dia e o horário que melhor se encaixam para você."
        />
        <div className="mt-12">
          <BookingFlow
            doctors={doctors}
            slotsByDoctor={slotsByDoctor}
            leadId={lead_id}
            preselectedDoctorId={preselectedDoctor}
          />
        </div>
      </div>
    </main>
  );
}
