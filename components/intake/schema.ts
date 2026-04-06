import { z } from 'zod';
import { isValidBrazilianPhone, isValidCPF } from '@/lib/validators';

export const objetivoEnum = z.enum(['1-10', '11-25', '25+', 'incerto']);

export const step1Schema = z.object({
  objetivo: objetivoEnum,
});

export const step2Schema = z.object({
  pesoKg: z
    .number({ invalid_type_error: 'Informe seu peso' })
    .min(30, 'Peso mínimo 30 kg')
    .max(300, 'Peso máximo 300 kg'),
  alturaCm: z
    .number({ invalid_type_error: 'Informe sua altura' })
    .min(120, 'Altura mínima 120 cm')
    .max(230, 'Altura máxima 230 cm'),
  metaPerdaKg: z
    .number({ invalid_type_error: 'Informe sua meta' })
    .min(1, 'Meta mínima 1 kg')
    .max(100, 'Meta máxima 100 kg'),
});

export const step3Schema = z.object({
  historicoMedico: z.object({
    diabetes: z.boolean().default(false),
    hipertensao: z.boolean().default(false),
    gravidez: z.boolean().default(false),
    alergia: z.string().max(500).optional().default(''),
    outros: z.string().max(1000).optional().default(''),
  }),
});

export const step4Schema = z.object({
  nome: z.string().min(2, 'Informe seu nome completo').max(120),
  email: z.string().email('Email inválido'),
  telefone: z
    .string()
    .refine((v) => isValidBrazilianPhone(v), 'Telefone inválido'),
  cpf: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.replace(/\D/g, '').length === 0 || isValidCPF(v),
      'CPF inválido'
    ),
});

export const step5Schema = z.object({
  consentimentoLgpd: z.literal(true, {
    errorMap: () => ({ message: 'É necessário aceitar os termos LGPD' }),
  }),
});

export const intakeSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type IntakeFormValues = z.infer<typeof intakeSchema>;
export type Objetivo = z.infer<typeof objetivoEnum>;
