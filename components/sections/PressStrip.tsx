import { press } from '@/lib/content';

export function PressStrip() {
  return (
    <section aria-label="Imprensa" className="border-y border-border bg-cream py-8">
      <div className="container">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Citados por
        </p>
        <div className="hidden flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70 md:flex">
          {press.map((name) => (
            <span
              key={name}
              className="font-display text-2xl text-ink/70"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="overflow-hidden md:hidden">
          <div className="flex w-max animate-marquee gap-10">
            {[...press, ...press].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display text-2xl text-ink/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
