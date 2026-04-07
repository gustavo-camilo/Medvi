'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  date: z.string().min(1),
  weight_kg: z.number({ invalid_type_error: 'Informe o peso' }).min(30).max(300),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export function WeightLogForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { date: today } });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const res = await fetch('/api/portal/health-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? 'Erro ao registrar');
      return;
    }
    reset({ date: today });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Data</Label>
          <Input type="date" {...register('date')} />
        </div>
        <div className="space-y-2">
          <Label>Peso (kg)</Label>
          <Input type="number" step="0.1" {...register('weight_kg', { valueAsNumber: true })} />
          {errors.weight_kg && <p className="text-xs text-red-600">{errors.weight_kg.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Notas</Label>
          <Input {...register('notes')} placeholder="Opcional" />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Registrar peso'}
      </Button>
    </form>
  );
}
