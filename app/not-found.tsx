import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-20">
      <div className="max-w-xl text-center">
        <p className="font-display text-7xl text-forest md:text-9xl">404</p>
        <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl text-balance">
          Página não encontrada
        </h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          A página que você procura não existe ou foi movida. Talvez você queira voltar ao
          início.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </main>
  );
}
