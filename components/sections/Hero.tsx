import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hero } from '@/lib/content';

export function Hero() {
  return (
    <section id="conteudo" className="relative overflow-hidden bg-cream section-y">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-forest">
            {hero.eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink md:text-6xl text-balance">
            {hero.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl text-pretty">
            {hero.subtitle}
          </p>
          <ul className="mt-8 space-y-3">
            {hero.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-ink">
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-cream">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href={hero.cta.href}>{hero.cta.label}</a>
            </Button>
            <p className="text-sm text-muted-foreground">{hero.socialProof}</p>
          </div>
        </div>

        <div
          className="grid grid-cols-2 gap-4 lg:gap-6"
          aria-hidden="true"
        >
          <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-forest-200 to-forest-500" />
          <div className="mt-8 aspect-[3/4] rounded-2xl bg-gradient-to-br from-gold-100 to-gold-400" />
          <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-forest-100 to-forest-300" />
          <div className="mt-8 aspect-[3/4] rounded-2xl bg-gradient-to-br from-cream to-gold-200" />
        </div>
      </div>
    </section>
  );
}
