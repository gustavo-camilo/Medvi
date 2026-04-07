import type { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Criar conta',
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink">Criar conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seu portal MEDVi para acompanhar o tratamento
        </p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/entrar" className="text-forest hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
