import { Resend } from 'resend';

let cached: Resend | null = null;
function client() {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  cached = new Resend(key);
  return cached;
}

interface LeadEmailPayload {
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  pesoKg?: number;
  alturaCm?: number;
  imc?: number;
  metaPerdaKg?: number;
  objetivo?: string;
}

export async function sendLeadNotification(lead: LeadEmailPayload) {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!to || !from) {
    console.warn('[email] LEAD_NOTIFICATION_EMAIL or LEAD_FROM_EMAIL not set; skipping');
    return;
  }

  const rows = [
    ['Nome', lead.nome],
    ['Email', lead.email],
    ['Telefone', lead.telefone],
    ['CPF', lead.cpf ?? '—'],
    ['Peso', lead.pesoKg ? `${lead.pesoKg} kg` : '—'],
    ['Altura', lead.alturaCm ? `${lead.alturaCm} cm` : '—'],
    ['IMC', lead.imc ? lead.imc.toFixed(1) : '—'],
    ['Meta de perda', lead.metaPerdaKg ? `${lead.metaPerdaKg} kg` : '—'],
    ['Objetivo', lead.objetivo ?? '—'],
  ]
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`)
    .join('');

  await client().emails.send({
    from,
    to,
    subject: `Novo lead MEDVi: ${lead.nome}`,
    html: `<h2>Novo lead recebido</h2><table>${rows}</table>`,
  });
}
