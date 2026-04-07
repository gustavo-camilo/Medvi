import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { ImcChart, type HealthPoint } from '@/components/portal/ImcChart';
import { WeightLogForm } from '@/components/portal/WeightLogForm';
import { calculateBMI, bmiCategory } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export default async function PortalHealthPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: log }, { data: lead }] = await Promise.all([
    supabase.from('profiles').select('lead_id').eq('id', user.id).maybeSingle(),
    supabase
      .from('health_log')
      .select('date,weight_kg')
      .eq('patient_id', user.id)
      .order('date', { ascending: true }),
    supabase.from('profiles').select('lead_id').eq('id', user.id).maybeSingle(),
  ]);

  const points: HealthPoint[] = (log ?? []).map((p) => ({
    date: (p.date as string).slice(5),
    weight: Number(p.weight_kg),
  }));

  let alturaCm = 170;
  if (profile?.lead_id) {
    const { data: leadRow } = await supabase
      .from('leads')
      .select('altura_cm,meta_perda_kg')
      .eq('id', profile.lead_id as string)
      .maybeSingle();
    if (leadRow?.altura_cm) alturaCm = Number(leadRow.altura_cm);
  }

  const currentWeight = points.length > 0 ? points[points.length - 1].weight : null;
  const imc = currentWeight ? calculateBMI(currentWeight, alturaCm) : null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Minha saúde</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Peso atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl text-ink">
              {currentWeight ? `${currentWeight.toFixed(1)} kg` : '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl text-ink">{imc ? imc.toFixed(1) : '—'}</p>
            {imc && <p className="text-xs text-muted-foreground">{bmiCategory(imc)}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl text-ink">{points.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <ImcChart data={points} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registrar peso</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightLogForm />
        </CardContent>
      </Card>
    </div>
  );
}
