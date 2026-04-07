import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/SectionHeading';
import { doctors, doctorPhotos } from '@/lib/content';

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
          {doctors.map((d, i) => (
            <Card key={d.name}>
              <CardContent className="flex flex-col items-center p-8 pt-8 text-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full bg-forest-100">
                  <Image
                    src={doctorPhotos[i % doctorPhotos.length]}
                    alt={`Foto ilustrativa de ${d.name}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-6 font-display text-xl text-ink">{d.name}</h3>
                <p className="mt-1 text-sm font-medium text-forest">{d.specialty}</p>
                <p className="text-xs text-muted-foreground">{d.crm}</p>
                <p className="mt-4 text-sm text-muted-foreground text-pretty">{d.bio}</p>
                <Button asChild className="mt-6" size="sm">
                  <Link href={`/agendar?doctor=${d.slug}`}>Agendar consulta</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
