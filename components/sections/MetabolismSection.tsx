import Image from 'next/image';
import { metabolismImage } from '@/lib/content';

export function MetabolismSection() {
  return (
    <section aria-label="Metabolismo" className="bg-cream section-y">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative order-2 aspect-[4/5] w-full max-w-md justify-self-center overflow-hidden rounded-3xl bg-forest-100 lg:order-1">
          <Image
            src={metabolismImage.src}
            alt={metabolismImage.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-forest">
            Metabolismo
          </p>
          <h2 className="font-display text-4xl text-ink md:text-5xl text-balance">
            Vamos consertar seu metabolismo.
          </h2>
          <div className="mt-6 space-y-5 text-lg text-muted-foreground text-pretty">
            <p>
              O problema nunca foi falta de força de vontade. Dietas restritivas e exercício
              isolado não resolvem um metabolismo desregulado — e é por isso que você emagrece
              e engorda de novo, ano após ano.
            </p>
            <p>
              Nosso protocolo trata a causa: ajusta hormônios da fome, estabiliza a glicemia
              e ensina seu corpo a reconhecer a saciedade de novo. Com acompanhamento médico
              contínuo, você perde peso de forma sustentável.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
