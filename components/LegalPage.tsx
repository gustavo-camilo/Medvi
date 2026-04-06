import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <main className="bg-cream py-16 md:py-24">
      <div className="container max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar ao início
        </Link>
        <div
          role="note"
          className="mb-10 flex items-start gap-3 rounded-2xl border border-gold bg-gold-50 p-4 text-sm text-ink"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
          <p>
            <strong>Documento modelo.</strong> Este texto é um placeholder e deve ser revisado
            por um advogado brasileiro especializado em direito digital e saúde antes de ser
            publicado comercialmente. ANVISA, CFM e LGPD possuem regras específicas para
            telemedicina e publicidade médica.
          </p>
        </div>
        <h1 className="font-display text-4xl text-ink md:text-5xl text-balance">{title}</h1>
        <div className="prose prose-neutral mt-8 max-w-none text-ink [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-muted-foreground [&_li]:my-1">
          {children}
        </div>
      </div>
    </main>
  );
}
