'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export function Topbar({ name }: { name: string }) {
  const signOut = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = '/entrar';
  };
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-cream px-6">
      <div className="text-sm text-muted-foreground">Olá, <span className="font-medium text-ink">{name}</span></div>
      <Button variant="ghost" size="sm" onClick={signOut}>
        <LogOut className="h-4 w-4" aria-hidden /> Sair
      </Button>
    </header>
  );
}
