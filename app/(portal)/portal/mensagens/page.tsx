import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { MessageComposer } from '@/components/portal/MessageComposer';

export const dynamic = 'force-dynamic';

export default async function PortalMessagesPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let { data: threads } = await supabase
    .from('message_threads')
    .select('id,subject,last_message_at')
    .eq('patient_id', user.id)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  // Ensure there's at least one thread so the patient can message the clinic.
  if (!threads || threads.length === 0) {
    const { data: created } = await supabase
      .from('message_threads')
      .insert({ patient_id: user.id, subject: 'Atendimento MEDVi' })
      .select('id,subject,last_message_at')
      .single();
    threads = created ? [created] : [];
  }

  const currentThread = threads[0];
  let messages: Array<Record<string, unknown>> = [];
  if (currentThread) {
    const { data } = await supabase
      .from('messages')
      .select('id,sender_role,body,created_at')
      .eq('thread_id', currentThread.id as string)
      .order('created_at');
    messages = (data ?? []) as Array<Record<string, unknown>>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Mensagens</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {(currentThread?.subject as string) ?? 'Atendimento MEDVi'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-96 space-y-2 overflow-y-auto rounded-xl bg-muted p-4">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Envie uma mensagem para começar a conversa.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id as string}
                  className={
                    (m.sender_role as string) === 'patient'
                      ? 'ml-auto max-w-xs rounded-2xl bg-forest px-4 py-2 text-sm text-cream'
                      : 'mr-auto max-w-xs rounded-2xl bg-cream px-4 py-2 text-sm text-ink'
                  }
                >
                  {m.body as string}
                </div>
              ))
            )}
          </div>
          {currentThread && <MessageComposer threadId={currentThread.id as string} />}
        </CardContent>
      </Card>
    </div>
  );
}
