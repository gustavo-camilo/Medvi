'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const KEY = 'medvi-lgpd-consent';

export function LgpdBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const handle = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de privacidade e cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-cream/95 backdrop-blur-md shadow-lg"
    >
      <div className="container flex flex-col items-start gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ink md:max-w-3xl">
          Usamos cookies e dados pessoais para oferecer uma experiência médica segura, em
          conformidade com a LGPD. Saiba mais na nossa{' '}
          <Link href="/politica-de-privacidade" className="underline text-forest font-medium">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={() => handle('rejected')}>
            Recusar
          </Button>
          <Button variant="primary" size="sm" onClick={() => handle('accepted')}>
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
