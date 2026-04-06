import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { support, brand } from '@/lib/content';

export function SupportCallout() {
  const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    'Olá! Gostaria de falar com a equipe MEDVi.'
  )}`;

  return (
    <section aria-label="Suporte" className="bg-cream section-y">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-cream p-8 shadow-sm md:p-14">
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-100"
            aria-hidden="true"
          />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-3xl text-ink md:text-4xl text-balance">
                {support.title}
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
                {support.body}
              </p>
            </div>
            <Button asChild size="lg" variant="gold">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
