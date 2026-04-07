import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Confirme seu email',
  robots: { index: false, follow: false },
};

export default function ConfirmEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-forest text-cream">
        <Mail className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="font-display text-3xl text-ink">Verifique seu email</h1>
      <p className="text-sm text-muted-foreground">
        Enviamos um link de confirmação para o seu endereço. Clique nele para ativar sua conta.
      </p>
      <Link href="/entrar" className="inline-block text-sm text-forest hover:underline">
        Voltar ao login
      </Link>
    </div>
  );
}
