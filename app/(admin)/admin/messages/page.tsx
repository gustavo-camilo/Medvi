import { Card, CardContent } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const supabase = await createServerClient();
  const { data: threads } = await supabase
    .from('message_threads')
    .select('id,subject,last_message_at,unread_count_admin,patient_id')
    .order('last_message_at', { ascending: false, nullsFirst: false });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Mensagens</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {(threads ?? []).map((t) => (
                <li key={t.id as string} className="p-4 hover:bg-forest-50">
                  <p className="font-medium text-ink">{(t.subject as string) ?? 'Sem assunto'}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.last_message_at
                      ? new Date(t.last_message_at as string).toLocaleString('pt-BR')
                      : '—'}
                  </p>
                </li>
              ))}
              {(threads ?? []).length === 0 && (
                <li className="p-6 text-center text-muted-foreground">Nenhuma conversa.</li>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Selecione uma conversa para ver as mensagens.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
