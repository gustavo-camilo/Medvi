import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/SectionHeading';
import { reviews } from '@/lib/content';

const extras = [
  {
    name: 'Patrícia L.',
    city: 'Porto Alegre, RS',
    rating: 5,
    text: 'Depois de anos em dietas malucas, finalmente entendi o que era tratar a obesidade como doença. A consulta foi séria, a médica explicou tudo e o acompanhamento é excelente. Já perdi 9 kg no segundo mês.',
  },
  {
    name: 'Lucas F.',
    city: 'Salvador, BA',
    rating: 5,
    text: 'O atendimento pelo WhatsApp é o que mais me impressionou. Sempre que tive alguma dúvida sobre efeito colateral, respondiam em minutos. Recomendo para quem está cansado de ser tratado como número.',
  },
];

export function ExtendedTestimonials() {
  const all = [...reviews, ...extras];
  return (
    <section id="depoimentos" className="bg-forest-50 section-y">
      <div className="container">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Eles começaram. Agora vivem diferente."
        />
        <div className="mt-14 columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {all.map((r, i) => (
            <Card key={i} className="bg-cream">
              <CardContent className="p-8 pt-8">
                <div className="mb-4 flex gap-1" aria-label={`${r.rating} de 5 estrelas`}>
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-ink text-pretty">{`"${r.text}"`}</p>
                <p className="mt-6 font-medium text-forest">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.city}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
