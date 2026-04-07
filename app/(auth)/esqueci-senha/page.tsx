import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Esqueci a senha',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink">Esqueci a senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enviaremos um link de redefinição para o seu email.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm">
        <Link href="/entrar" className="text-forest hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
