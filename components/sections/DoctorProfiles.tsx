import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/SectionHeading';
import { doctors } from '@/lib/content';

export function DoctorProfiles() {
  return (
    <section id="medicos" className="bg-cream section-y">
      <div className="container">
        <SectionHeading
          eyebrow="Nossos médicos"
          title="Profissionais brasileiros, licenciados pelo CFM."
          subtitle="Cada prescrição passa por avaliação individual de um médico habilitado."
        />
        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          {doctors.map((d) => (
            <Card key={d.name}>
              <CardContent className="flex flex-col items-center p-8 pt-8 text-center">
                <div
                  className="h-28 w-28 rounded-full bg-gradient-to-br from-forest-200 to-gold-300"
                  role="img"
                  aria-label={`Foto de ${d.name}`}
                />
                <h3 className="mt-6 font-display text-xl text-ink">{d.name}</h3>
                <p className="mt-1 text-sm font-medium text-forest">{d.specialty}</p>
                <p className="text-xs text-muted-foreground">{d.crm}</p>
                <p className="mt-4 text-sm text-muted-foreground text-pretty">{d.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
