'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { brand } from '@/lib/content';
import { cn } from '@/lib/cn';

export function WhatsAppFab() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? brand.whatsapp;
  const message = encodeURIComponent(
    'Olá! Gostaria de saber mais sobre o tratamento de emagrecimento da MEDVi.'
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a MEDVi no WhatsApp"
      className={cn(
        'fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-forest text-cream shadow-lg',
        'px-5 py-4 font-medium transition-all hover:bg-forest-600 hover:scale-105',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
