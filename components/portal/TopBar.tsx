'use client';

import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { brand } from '@/lib/content';

export function TopBar({ name }: { name: string }) {
  const signOut = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = '/entrar';
  };
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-cream/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/portal" className="font-display text-2xl font-semibold text-forest">
          {brand.shortName}
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/portal/perfil" className="hidden items-center gap-2 text-sm text-ink hover:text-forest sm:flex">
            <User className="h-4 w-4" aria-hidden />
            {name}
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" aria-hidden /> Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
