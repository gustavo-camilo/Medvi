import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { StatusUpdater } from './StatusUpdater';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: lead } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();
  if (!lead) notFound();

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id,starts_at,status,doctor_id')
    .eq('lead_id', id)
    .order('starts_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/leads" className="text-sm text-forest hover:underline">
            ← Voltar
          </Link>
          <h1 className="mt-1 font-display text-3xl text-ink">{lead.nome as string}</h1>
          <p className="text-sm text-muted-foreground">{lead.email as string}</p>
        </div>
        <StatusUpdater leadId={id} currentStatus={(lead.status as string) ?? 'novo'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados do lead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Field label="Telefone" value={lead.telefone as string} />
            <Field label="CPF" value={(lead.cpf as string) ?? '—'} />
            <Field label="Peso" value={`${lead.peso_kg} kg`} />
            <Field label="Altura" value={`${lead.altura_cm} cm`} />
            <Field label="IMC" value={`${lead.imc ?? '—'}`} />
            <Field label="Meta" value={`${lead.meta_perda_kg} kg`} />
            <Field label="Objetivo" value={(lead.objetivo as string) ?? '—'} />
            <Field label="Criado em" value={new Date(lead.created_at as string).toLocaleString('pt-BR')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico médico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <pre className="whitespace-pre-wrap break-words rounded-xl bg-muted p-4 text-xs">
              {JSON.stringify(lead.historico_medico ?? {}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments && appointments.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {appointments.map((a) => (
                <li key={a.id as string} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span>{new Date(a.starts_at as string).toLocaleString('pt-BR')}</span>
                  <span className="text-muted-foreground">{a.status as string}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma consulta agendada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
