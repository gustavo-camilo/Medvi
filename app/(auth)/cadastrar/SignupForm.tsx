'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { formatPhone, formatCPF, isValidBrazilianPhone, isValidCPF } from '@/lib/validators';

const schema = z
  .object({
    nome: z.string().min(2, 'Informe seu nome completo'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
    confirmPassword: z.string(),
    telefone: z.string().refine(isValidBrazilianPhone, 'Telefone inválido'),
    cpf: z
      .string()
      .optional()
      .refine(
        (v) => !v || v.replace(/\D/g, '').length === 0 || isValidCPF(v),
        'CPF inválido',
      ),
    lgpd: z.literal(true, {
      errorMap: () => ({ message: 'É necessário aceitar os termos LGPD' }),
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createBrowserSupabase();
    const { data, error: err } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { nome: values.nome, telefone: values.telefone, cpf: values.cpf ?? null },
      },
    });
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.push('/portal');
      router.refresh();
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-border bg-forest-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest" aria-hidden />
        <h2 className="mt-4 font-display text-xl text-ink">Verifique seu email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enviamos um link de confirmação para o seu endereço. Clique nele para ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input id="nome" autoComplete="name" {...register('nome')} aria-invalid={!!errors.nome} />
        {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefone">WhatsApp</Label>
        <Controller
          control={control}
          name="telefone"
          render={({ field }) => (
            <Input
              id="telefone"
              placeholder="(11) 99999-9999"
              inputMode="tel"
              autoComplete="tel"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(formatPhone(e.target.value))}
              aria-invalid={!!errors.telefone}
            />
          )}
        />
        {errors.telefone && <p className="text-sm text-red-600">{errors.telefone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF (opcional)</Label>
        <Controller
          control={control}
          name="cpf"
          render={({ field }) => (
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              inputMode="numeric"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(formatCPF(e.target.value))}
              aria-invalid={!!errors.cpf}
            />
          )}
        />
        {errors.cpf && <p className="text-sm text-red-600">{errors.cpf.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <Controller
        control={control}
        name="lgpd"
        render={({ field }) => (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-forest-50 p-3">
            <Checkbox
              checked={field.value === true}
              onCheckedChange={(v) => field.onChange(v === true)}
              aria-invalid={!!errors.lgpd}
            />
            <span className="text-sm text-ink">
              Aceito os termos de uso e a política de privacidade (LGPD).
            </span>
          </label>
        )}
      />
      {errors.lgpd && <p className="text-sm text-red-600">{errors.lgpd.message}</p>}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Criando conta...
          </>
        ) : (
          'Criar conta'
        )}
      </Button>
    </form>
  );
}
