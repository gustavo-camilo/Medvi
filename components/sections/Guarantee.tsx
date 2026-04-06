import { ShieldCheck } from 'lucide-react';
import { guarantee } from '@/lib/content';

export function Guarantee() {
  return (
    <section aria-label="Garantia" className="bg-cream section-y">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-gold bg-cream p-10 text-center shadow-sm md:p-14">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink">
            <ShieldCheck className="h-9 w-9" aria-hidden="true" />
          </div>
          <h2 className="font-display text-4xl text-ink md:text-5xl text-balance">
            {guarantee.title}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">{guarantee.body}</p>
        </div>
      </div>
    </section>
  );
}
