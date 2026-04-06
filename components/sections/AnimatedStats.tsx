import { AnimatedNumber } from '@/components/AnimatedNumber';
import { stats } from '@/lib/content';

export function AnimatedStats() {
  return (
    <section aria-label="Estatísticas" className="bg-forest section-y text-cream">
      <div className="container">
        <div className="grid gap-12 text-center md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-6xl text-gold-200 md:text-7xl">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-lg text-cream/80 text-balance">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
