'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function MessageComposer({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    await fetch('/api/portal/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, body }),
    });
    setBody('');
    setSending(false);
    router.refresh();
  };

  return (
    <form onSubmit={send} className="flex items-end gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Digite sua mensagem..."
        className="flex-1 rounded-xl border border-border bg-cream px-4 py-2 text-sm"
      />
      <Button type="submit" disabled={sending || !body.trim()}>
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar'}
      </Button>
    </form>
  );
}
