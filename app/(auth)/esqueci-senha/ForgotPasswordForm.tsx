'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserSupabase } from '@/lib/supabase/browser';

const schema = z.object({ email: z.string().email('Email inválido') });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createBrowserSupabase();
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/redefinir-senha` : undefined;
    const { error: err } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo });
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-forest-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest" aria-hidden />
        <p className="mt-4 text-sm text-ink">
          Se existir uma conta com esse email, um link de redefinição foi enviado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Enviando...
          </>
        ) : (
          'Enviar link'
        )}
      </Button>
    </form>
  );
}
