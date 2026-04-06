import Image from 'next/image';
import { explainer, explainerImage } from '@/lib/content';

export function HowItWorksExplainer() {
  return (
    <section aria-label="Como o GLP-1 funciona" className="bg-cream section-y">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-forest">
            Ciência
          </p>
          <h2 className="font-display text-4xl text-ink md:text-5xl text-balance">
            {explainer.title}
          </h2>
          <div className="mt-8 space-y-5 text-lg text-muted-foreground text-pretty">
            {explainer.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative aspect-square w-full max-w-md justify-self-center overflow-hidden rounded-3xl bg-forest-100">
          <Image
            src={explainerImage.src}
            alt={explainerImage.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
