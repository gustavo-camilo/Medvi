import { Shield, Truck, Stethoscope, Lock, type LucideIcon } from 'lucide-react';
import { trustBadges } from '@/lib/content';

const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  truck: Truck,
  stethoscope: Stethoscope,
  lock: Lock,
};

export function TrustBadges() {
  return (
    <section aria-label="Garantias" className="border-y border-border bg-cream py-10">
      <div className="container">
        <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {trustBadges.map((b) => {
            const Icon = iconMap[b.icon] ?? Shield;
            return (
              <li
                key={b.label}
                className="flex items-center gap-4 text-ink"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-pretty">{b.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
