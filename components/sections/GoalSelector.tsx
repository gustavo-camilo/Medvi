'use client';

import * as React from 'react';
import { SectionHeading } from '@/components/SectionHeading';
import { goalSelector } from '@/lib/content';
import { cn } from '@/lib/cn';

export function GoalSelector() {
  const handleClick = (value: string) => {
    try {
      sessionStorage.setItem('medvi-goal', value);
    } catch {}
    const el = document.getElementById('qualificacao');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="qualificacao-meta" className="bg-forest-50 section-y">
      <div className="container">
        <SectionHeading
          eyebrow="Seu objetivo"
          title={goalSelector.title}
          subtitle={goalSelector.subtitle}
        />
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {goalSelector.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleClick(opt.value)}
              className={cn(
                'rounded-2xl border-2 border-forest bg-cream px-6 py-6 text-lg font-medium text-forest',
                'transition-all hover:bg-forest hover:text-cream hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
