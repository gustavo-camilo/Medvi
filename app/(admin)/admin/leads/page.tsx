import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { LeadsFilter, type LeadRow } from './LeadsFilter';

export const dynamic = 'force-dynamic';

export default async function LeadsListPage() {
  const supabase = await createServerClient();
  const { data: leads } = await supabase
    .from('leads')
    .select('id,nome,email,telefone,objetivo,imc,status,created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Leads</h1>
        <p className="text-sm text-muted-foreground">Todas as avaliações recebidas.</p>
      </div>
      <Card>
        <LeadsFilter leads={(leads ?? []) as LeadRow[]} />
      </Card>
    </div>
  );
}

