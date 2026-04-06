import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeading } from '@/components/SectionHeading';
import { products, type Product } from '@/lib/content';
import { formatBRL } from '@/lib/format';
import { cn } from '@/lib/cn';

export function ProductShowcase() {
  return (
    <section id="produtos" className="bg-cream section-y">
      <div className="container">
        <SectionHeading
          eyebrow="Tratamentos"
          title="Para cada meta, um plano."
          subtitle="Todos os planos incluem consulta médica, acompanhamento por WhatsApp e entrega discreta."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isPopular = product.badge === 'Mais popular';
  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden transition-all hover:shadow-md',
        isPopular ? 'border-2 border-forest shadow-md' : 'border-border'
      )}
    >
      <div
        className="aspect-[4/3] w-full bg-gradient-to-br from-forest-100 via-cream to-gold-100"
        role="img"
        aria-label={product.imageAlt}
      />
      <CardHeader>
        {product.badge && (
          <Badge variant={isPopular ? 'default' : 'gold'} className="w-fit">
            {product.badge}
          </Badge>
        )}
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="mb-4">
          <span className="text-xs text-muted-foreground">a partir de</span>
          <br />
          <span className="font-display text-3xl text-forest">
            {formatBRL(product.startingPriceBRL)}
          </span>
          <span className="text-sm text-muted-foreground"> /mês</span>
        </p>
        <ul className="space-y-2">
          {product.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={isPopular ? 'primary' : 'secondary'}>
          <a href="#qualificacao" aria-label={`Quero o plano ${product.name}`}>
            Quero esse
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
