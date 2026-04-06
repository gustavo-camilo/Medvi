import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brand } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Recebemos sua avaliação',
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    'Olá! Acabei de enviar minha avaliação pelo site.'
  )}`;
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-20">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-forest text-cream">
          <CheckCircle2 className="h-12 w-12" aria-hidden="true" />
        </div>
        <h1 className="font-display text-4xl text-ink md:text-5xl text-balance">
          Recebemos sua avaliação!
        </h1>
        <p className="mt-6 text-lg text-muted-foreground text-pretty">
          Em até 24 horas, um médico brasileiro vai analisar o seu caso e entrar em contato
          pelo WhatsApp informado. Fique de olho no seu telefone.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" variant="gold">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Abrir WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
