import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { DoctorEditor } from './DoctorEditor';

export const dynamic = 'force-dynamic';

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: doctor } = await supabase.from('doctors').select('*').eq('id', id).maybeSingle();
  if (!doctor) notFound();
  const { data: rules } = await supabase
    .from('availability_rules')
    .select('id,day_of_week,start_time,end_time,slot_duration_minutes,active')
    .eq('doctor_id', id)
    .order('day_of_week');

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/doctors" className="text-sm text-forest hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-1 font-display text-3xl text-ink">{doctor.name as string}</h1>
      </div>
      <DoctorEditor
        doctorId={id}
        initial={{
          name: (doctor.name as string) ?? '',
          crm: (doctor.crm as string) ?? '',
          specialty: (doctor.specialty as string) ?? '',
          bio: (doctor.bio as string) ?? '',
          active: (doctor.active as boolean) ?? true,
        }}
        initialRules={(rules ?? []).map((r) => ({
          dayOfWeek: r.day_of_week as number,
          startTime: (r.start_time as string).slice(0, 5),
          endTime: (r.end_time as string).slice(0, 5),
          slotDurationMinutes: r.slot_duration_minutes as number,
        }))}
      />
    </div>
  );
}
