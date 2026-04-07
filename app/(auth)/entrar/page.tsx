import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Entrar',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink">Entrar</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesse sua conta MEDVi
        </p>
      </div>
      <LoginForm />
      <div className="flex items-center justify-between text-sm">
        <Link href="/esqueci-senha" className="text-forest hover:underline">
          Esqueci a senha
        </Link>
        <Link href="/cadastrar" className="text-forest hover:underline">
          Criar conta
        </Link>
      </div>
    </div>
  );
}
