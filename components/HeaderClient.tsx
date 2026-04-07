'use client';

import * as React from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brand, nav } from '@/lib/content';
import { cn } from '@/lib/cn';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export function HeaderClient({ isAuthed, isAdmin }: { isAuthed: boolean; isAdmin: boolean }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const signOut = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const accountHref = isAdmin ? '/admin' : '/portal';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all',
        scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent',
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-forest"
          aria-label={`${brand.name} — Página inicial`}
        >
          {brand.shortName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {nav.primary.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink transition-colors hover:text-forest"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href={accountHref}>
                  <User className="h-4 w-4" aria-hidden /> Minha conta
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={signOut}>
                <LogOut className="h-4 w-4" aria-hidden /> Sair
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <a href={nav.cta.href}>{nav.cta.label}</a>
            </Button>
          )}
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-cream p-6 shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-display text-xl text-forest">{brand.shortName}</Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest-50"
                    aria-label="Fechar menu"
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
              <nav className="mt-8 flex flex-col gap-4" aria-label="Navegação móvel">
                {nav.primary.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-ink hover:text-forest"
                  >
                    {item.label}
                  </a>
                ))}
                {isAuthed ? (
                  <>
                    <Button asChild className="mt-4" variant="secondary">
                      <Link href={accountHref} onClick={() => setOpen(false)}>
                        <User className="h-4 w-4" aria-hidden /> Minha conta
                      </Link>
                    </Button>
                    <Button variant="ghost" onClick={signOut}>
                      <LogOut className="h-4 w-4" aria-hidden /> Sair
                    </Button>
                  </>
                ) : (
                  <Button asChild className="mt-4">
                    <a href={nav.cta.href} onClick={() => setOpen(false)}>
                      {nav.cta.label}
                    </a>
                  </Button>
                )}
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
