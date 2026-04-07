'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type Control, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SectionHeading } from '@/components/SectionHeading';
import { goalSelector } from '@/lib/content';
import {
  calculateBMI,
  bmiCategory,
  formatPhone,
  formatCPF,
} from '@/lib/validators';
import { intakeSchema, type IntakeFormValues, type Objetivo } from './schema';
import { cn } from '@/lib/cn';

const STEPS = [
  'Objetivo',
  'Dados físicos',
  'Histórico médico',
  'Contato',
  'Confirmação',
] as const;

type StepFields = (keyof IntakeFormValues)[];

const STEP_FIELDS: StepFields[] = [
  ['objetivo'],
  ['pesoKg', 'alturaCm', 'metaPerdaKg'],
  ['historicoMedico'],
  ['nome', 'email', 'telefone', 'cpf'],
  ['consentimentoLgpd'],
];

export function IntakeWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeSchema),
    mode: 'onTouched',
    defaultValues: {
      objetivo: undefined as unknown as Objetivo,
      pesoKg: 90,
      alturaCm: 170,
      metaPerdaKg: 15,
      historicoMedico: {
        diabetes: false,
        hipertensao: false,
        gravidez: false,
        alergia: '',
        outros: '',
      },
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      consentimentoLgpd: false as unknown as true,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // prefill goal from sessionStorage
  React.useEffect(() => {
    try {
      const g = sessionStorage.getItem('medvi-goal');
      if (g && ['1-10', '11-25', '25+', 'incerto'].includes(g)) {
        setValue('objetivo', g as Objetivo);
      }
    } catch {}
  }, [setValue]);

  const pesoKg = watch('pesoKg');
  const alturaCm = watch('alturaCm');
  const imc = calculateBMI(pesoKg || 0, alturaCm || 0);

  const next = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async (values: IntakeFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? 'Falha ao enviar');
      }
      const json = (await res.json().catch(() => ({}))) as { id?: string };
      try {
        sessionStorage.removeItem('medvi-goal');
        // Bridge patient contact info to /agendar — the RLS on `leads` blocks
        // anon SELECT, so the booking API cannot re-read them server-side.
        sessionStorage.setItem(
          'medvi-patient',
          JSON.stringify({
            nome: values.nome,
            email: values.email,
            telefone: values.telefone,
          }),
        );
      } catch {}
      if (json?.id) {
        router.push(`/agendar?lead_id=${json.id}`);
      } else {
        router.push('/obrigado');
      }
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : 'Erro inesperado. Tente novamente.'
      );
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading
        eyebrow="Avaliação gratuita"
        title="Vamos descobrir se o tratamento é para você."
        subtitle="Leva menos de 5 minutos. Seus dados são protegidos pela LGPD."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-12 rounded-3xl border border-border bg-cream p-6 shadow-sm md:p-10"
        noValidate
      >
        {/* progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Passo {step + 1} de {STEPS.length}
            </span>
            <span>{STEPS[step]}</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-forest-100"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label="Progresso do formulário"
          >
            <div
              className="h-full bg-forest transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          aria-live="polite"
          className="min-h-[280px]"
        >
          {step === 0 && (
            <fieldset className="space-y-4">
              <legend className="mb-4 font-display text-2xl text-ink">
                Qual é sua meta de perda de peso?
              </legend>
              <Controller
                control={control}
                name="objetivo"
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    {goalSelector.options.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border p-4 transition-all',
                          field.value === opt.value && 'border-forest bg-forest-50'
                        )}
                      >
                        <RadioGroupItem value={opt.value} id={`objetivo-${opt.value}`} />
                        <span className="text-base text-ink">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.objetivo && (
                <p className="text-sm text-red-600">{errors.objetivo.message}</p>
              )}
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="space-y-5">
              <legend className="mb-4 font-display text-2xl text-ink">Dados físicos</legend>
              <Field label="Peso atual (kg)" error={errors.pesoKg?.message}>
                <Input
                  type="number"
                  step="0.1"
                  min={30}
                  max={300}
                  {...register('pesoKg', { valueAsNumber: true })}
                  aria-invalid={!!errors.pesoKg}
                />
              </Field>
              <Field label="Altura (cm)" error={errors.alturaCm?.message}>
                <Input
                  type="number"
                  min={120}
                  max={230}
                  {...register('alturaCm', { valueAsNumber: true })}
                  aria-invalid={!!errors.alturaCm}
                />
              </Field>
              <Field label="Quantos kg você quer perder?" error={errors.metaPerdaKg?.message}>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  {...register('metaPerdaKg', { valueAsNumber: true })}
                  aria-invalid={!!errors.metaPerdaKg}
                />
              </Field>
              {pesoKg > 0 && alturaCm > 0 && (
                <div className="rounded-xl bg-forest-50 p-4">
                  <p className="text-sm text-muted-foreground">Seu IMC atual</p>
                  <p className="mt-1 font-display text-2xl text-forest">
                    {imc.toFixed(1)}{' '}
                    <span className="text-base text-muted-foreground">
                      — {bmiCategory(imc)}
                    </span>
                  </p>
                </div>
              )}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-5">
              <legend className="mb-4 font-display text-2xl text-ink">Histórico médico</legend>
              <p className="text-sm text-muted-foreground">
                Marque as condições que se aplicam a você.
              </p>
              <div className="space-y-3">
                <CheckboxField
                  control={control}
                  name="historicoMedico.diabetes"
                  label="Tenho diabetes tipo 1 ou tipo 2"
                />
                <CheckboxField
                  control={control}
                  name="historicoMedico.hipertensao"
                  label="Tenho hipertensão (pressão alta)"
                />
                <CheckboxField
                  control={control}
                  name="historicoMedico.gravidez"
                  label="Estou grávida, amamentando ou planejando engravidar"
                />
              </div>
              <Field label="Alergias a medicamentos">
                <textarea
                  {...register('historicoMedico.alergia')}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-base text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:border-forest"
                  placeholder="Liste medicamentos ou substâncias, se houver"
                />
              </Field>
              <Field label="Outras condições ou medicamentos em uso">
                <textarea
                  {...register('historicoMedico.outros')}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-base text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:border-forest"
                  placeholder="Informe qualquer outra condição relevante"
                />
              </Field>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-5">
              <legend className="mb-4 font-display text-2xl text-ink">Seus dados de contato</legend>
              <Field label="Nome completo" error={errors.nome?.message}>
                <Input
                  autoComplete="name"
                  {...register('nome')}
                  aria-invalid={!!errors.nome}
                />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <Input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
              </Field>
              <Field label="WhatsApp" error={errors.telefone?.message}>
                <Controller
                  control={control}
                  name="telefone"
                  render={({ field }) => (
                    <Input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(11) 99999-9999"
                      value={field.value}
                      onChange={(e) => field.onChange(formatPhone(e.target.value))}
                      aria-invalid={!!errors.telefone}
                    />
                  )}
                />
              </Field>
              <Field label="CPF (opcional)" error={errors.cpf?.message}>
                <Controller
                  control={control}
                  name="cpf"
                  render={({ field }) => (
                    <Input
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(formatCPF(e.target.value))}
                      aria-invalid={!!errors.cpf}
                    />
                  )}
                />
              </Field>
            </fieldset>
          )}

          {step === 4 && (
            <fieldset className="space-y-5">
              <legend className="mb-4 font-display text-2xl text-ink">Confirmação</legend>
              <p className="text-muted-foreground text-pretty">
                Ao enviar, você declara que as informações são verdadeiras e autoriza a
                MEDVi a entrar em contato. Seus dados serão usados apenas para avaliação
                médica, conforme nossa Política de Privacidade.
              </p>

              <Controller
                control={control}
                name="consentimentoLgpd"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-forest-50 p-4">
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true)}
                      aria-invalid={!!errors.consentimentoLgpd}
                    />
                    <span className="text-sm text-ink">
                      Li e concordo com a Política de Privacidade e autorizo o tratamento
                      dos meus dados de saúde para fins de avaliação médica (LGPD, Art. 11).
                    </span>
                  </label>
                )}
              />
              {errors.consentimentoLgpd && (
                <p className="text-sm text-red-600">{errors.consentimentoLgpd.message}</p>
              )}

              {submitError && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {submitError}
                </p>
              )}
            </fieldset>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={back}
            disabled={step === 0 || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next}>
              Continuar
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Enviando...
                </>
              ) : (
                'Enviar avaliação'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function CheckboxField({
  control,
  name,
  label,
}: {
  control: Control<IntakeFormValues>;
  name: FieldPath<IntakeFormValues>;
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 hover:bg-forest-50">
          <Checkbox
            checked={!!field.value}
            onCheckedChange={(v) => field.onChange(v === true)}
          />
          <span className="text-sm text-ink">{label}</span>
        </label>
      )}
    />
  );
}
