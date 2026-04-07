import type { Metadata } from 'next';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Redefinir senha',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink">Redefinir senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">Escolha uma nova senha.</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
