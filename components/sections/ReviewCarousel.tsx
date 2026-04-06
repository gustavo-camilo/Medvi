'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { reviews } from '@/lib/content';
import { cn } from '@/lib/cn';

export function ReviewCarousel() {
  const ref = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section aria-label="Depoimentos" className="bg-forest-50 section-y">
      <div className="container">
        <SectionHeading
          eyebrow="O que dizem nossos pacientes"
          title="Histórias reais de quem começou."
        />

        <div className="relative mt-12">
          <div
            ref={ref}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((r, i) => (
              <Card
                key={i}
                className="min-w-[85%] snap-start sm:min-w-[60%] lg:min-w-[32%]"
              >
                <CardContent className="p-8 pt-8">
                  <div className="mb-4 flex gap-1" aria-label={`${r.rating} de 5 estrelas`}>
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-gold text-gold" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-lg text-ink text-pretty">{`"${r.text}"`}</p>
                  <p className="mt-6 font-medium text-forest">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.city}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest text-forest',
                'hover:bg-forest hover:text-cream transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest'
              )}
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest text-forest',
                'hover:bg-forest hover:text-cream transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest'
              )}
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
