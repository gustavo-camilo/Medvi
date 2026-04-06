/**
 * Brazilian-specific validators.
 * Pure functions, no dependencies — usable on server and client.
 */

/** Validates a Brazilian CPF (11 digits) using the official mod-11 algorithm. */
export function isValidCPF(input: string): boolean {
  const cpf = input.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  // Reject sequences like 00000000000, 11111111111, etc.
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcCheck = (slice: string, factor: number) => {
    let sum = 0;
    for (const digit of slice) {
      sum += parseInt(digit, 10) * factor--;
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const d1 = calcCheck(cpf.slice(0, 9), 10);
  if (d1 !== parseInt(cpf[9], 10)) return false;
  const d2 = calcCheck(cpf.slice(0, 10), 11);
  if (d2 !== parseInt(cpf[10], 10)) return false;
  return true;
}

/** Formats a CPF as 000.000.000-00. */
export function formatCPF(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/** Validates a Brazilian mobile phone (10 or 11 digits, including DDD). */
export function isValidBrazilianPhone(input: string): boolean {
  const phone = input.replace(/\D/g, '');
  // 11 digits (mobile w/ leading 9) or 10 digits (landline). DDD 11..99.
  if (phone.length !== 10 && phone.length !== 11) return false;
  const ddd = parseInt(phone.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  if (phone.length === 11 && phone[2] !== '9') return false;
  return true;
}

/** Formats a phone as (11) 99999-9999 or (11) 9999-9999. */
export function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Validates a Brazilian CEP (8 digits). */
export function isValidCEP(input: string): boolean {
  return /^\d{8}$/.test(input.replace(/\D/g, ''));
}

/** Formats a CEP as 00000-000. */
export function formatCEP(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

/** Calculates BMI (IMC) given weight in kg and height in cm. */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/** Returns the IMC category in Portuguese (per OMS). */
export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso saudável';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidade grau I';
  if (bmi < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}

/** Projects ~21% body weight loss potential at 12 months on GLP-1 (clinical avg). */
export function projectWeightLoss(weightKg: number): number {
  return Math.round(weightKg * 0.21 * 10) / 10;
}
