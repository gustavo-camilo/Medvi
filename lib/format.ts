/** Brazilian Portuguese number/currency formatting helpers. */

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const NUM = new Intl.NumberFormat('pt-BR');

export function formatBRL(value: number): string {
  return BRL.format(value);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export const fmt = NUM;
