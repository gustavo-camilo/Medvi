import { SectionHeading } from '@/components/SectionHeading';

const items = Array.from({ length: 8 });

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
          {items.map((_, i) => (
            <figure key={i} className="group overflow-hidden rounded-2xl">
              <div
                className="aspect-[3/4] w-full bg-gradient-to-br from-forest-200 via-forest-100 to-gold-200 transition-transform group-hover:scale-105"
                role="img"
                aria-label={`Resultado real de paciente ${i + 1}`}
              />
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Resultado real de paciente
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          Imagens meramente ilustrativas. Em produção, substituir por fotos de pacientes com
          consentimento expresso por escrito. Resultados variam.
        </p>
      </div>
    </section>
  );
}
