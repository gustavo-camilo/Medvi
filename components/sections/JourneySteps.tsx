'use client';

import * as React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/SectionHeading';
import { journey } from '@/lib/content';

export function JourneySteps() {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="como-funciona" className="bg-cream section-y">
      <div className="container">
        <SectionHeading
          eyebrow="Sua jornada"
          title="Três passos até começar."
          subtitle="Do questionário à entrega, em menos de uma semana."
        />

        <div ref={ref} className="relative mx-auto mt-16 max-w-4xl">
          {/* vertical progress rail (mobile only) */}
          <div className="absolute left-[19px] top-0 hidden h-full w-0.5 bg-forest-100 md:hidden" />
          <motion.div
            className="absolute left-[19px] top-0 w-0.5 bg-forest md:hidden"
            style={reduced ? { height: '100%' } : { height }}
            aria-hidden="true"
          />

          {/* horizontal rail (desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-forest-100 md:block" />
          <motion.div
            className="absolute left-0 top-8 hidden h-0.5 bg-forest md:block"
            style={reduced ? { width: '100%' } : { width }}
            aria-hidden="true"
          />

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {journey.map((step) => (
              <li key={step.n} className="flex gap-6 md:flex-col md:items-start md:gap-4">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-display text-lg font-semibold text-ink shadow-md">
                  {step.n}
                </div>
                <div className="flex-1 md:pt-2">
                  <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground text-pretty">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
