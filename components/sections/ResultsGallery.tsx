import Image from 'next/image';
import { SectionHeading } from '@/components/SectionHeading';
import { resultsImages } from '@/lib/content';

export function ResultsGallery() {
  return (
    <section id="resultados" className="bg-cream section-y">
      <div className="container">
        <SectionHeading
          eyebrow="Resultados reais"
          title="Transformações de pacientes MEDVi"
          subtitle="Pacientes que seguiram o tratamento e autorizaram o compartilhamento das imagens."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resultsImages.map((img, i) => (
            <figure key={img.src} className="group overflow-hidden rounded-2xl">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-forest-100">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
              </div>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Imagem ilustrativa
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          Imagens meramente ilustrativas. Em produção, substituir por fotos de pacientes com
          consentimento expresso por escrito (CFM Res. 2.314/2022). Resultados variam.
        </p>
      </div>
    </section>
  );
}
