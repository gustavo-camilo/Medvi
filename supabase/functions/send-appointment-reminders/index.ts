// Supabase Edge Function: send-appointment-reminders
//
// Runs on Deno. Triggered by pg_cron every 15 minutes (see 0005 migration).
// Scans for upcoming appointments that need a 24h-before or 1h-before reminder
// and sends one email per appointment via Resend. Marks the appropriate flag
// on success so we never double-send.
//
// A WhatsApp reminder stub is included: the function builds the message body
// and logs it, but does NOT send — real automated WhatsApp requires a
// Business Solution Provider (Twilio / Zenvia / Gupshup / Meta Cloud API).
// Drop the BSP call into `sendWhatsApp()` when you pick a provider.
//
// Env vars expected (set via Supabase → Edge Functions → Secrets):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   (bypasses RLS, needed to read all appointments)
//   RESEND_API_KEY              (optional — if missing, emails are skipped and logged)
//   LEAD_FROM_EMAIL             (e.g. "MEDVi <no-reply@medvi.com.br>")
//   WHATSAPP_BSP_URL            (optional — your chosen BSP endpoint)
//   WHATSAPP_BSP_TOKEN          (optional)
//
// Deploy:
//   supabase functions deploy send-appointment-reminders --no-verify-jwt

// @ts-expect-error — Deno import, not resolvable by Node TypeScript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

// Deno globals used at runtime — not typed in Node tsconfig.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

interface AppointmentRow {
  id: string;
  doctor_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  patient_name: string | null;
  patient_email: string | null;
  patient_phone: string | null;
  reminder_sent_24h: boolean;
  reminder_sent_1h: boolean;
  doctors: { name: string; specialty: string | null } | null;
}

type ReminderOffset = '24h' | '1h';

const TZ = 'America/Sao_Paulo';

function fmtBrDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: TZ,
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

function fmtBrTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: TZ,
    timeStyle: 'short',
  });
}

function emailBody(appt: AppointmentRow, offset: ReminderOffset): { subject: string; html: string; text: string } {
  const when = fmtBrDateTime(appt.starts_at);
  const time = fmtBrTime(appt.starts_at);
  const doctorName = appt.doctors?.name ?? 'seu médico MEDVi';
  const specialty = appt.doctors?.specialty ?? '';
  const name = appt.patient_name ?? 'paciente';
  const heads = offset === '24h' ? 'amanhã' : 'em uma hora';
  const portalUrl = `${Deno.env.get('SITE_URL') ?? 'https://medvi.com.br'}/portal/agendamentos`;

  const subject =
    offset === '24h'
      ? `Lembrete: sua consulta MEDVi é amanhã às ${time}`
      : `Sua consulta MEDVi começa em 1 hora (${time})`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<body style="font-family: -apple-system, system-ui, sans-serif; color: #1A1A1A; background: #FAF8F5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; border: 1px solid #E5E1D8;">
    <h1 style="font-size: 22px; color: #1F4D3A; margin: 0 0 12px;">Olá, ${name}!</h1>
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Este é um lembrete automático: sua consulta MEDVi é <b>${heads}</b>.</p>
    <div style="background: #F1EEE8; border-radius: 12px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0 0 4px; font-size: 14px; color: #5A5A57;">Médico</p>
      <p style="margin: 0 0 12px; font-size: 16px; font-weight: 600;">${doctorName}${specialty ? ` — ${specialty}` : ''}</p>
      <p style="margin: 0 0 4px; font-size: 14px; color: #5A5A57;">Data e horário</p>
      <p style="margin: 0; font-size: 16px; font-weight: 600;">${when}</p>
    </div>
    <p style="font-size: 15px; line-height: 1.6;">Prepare-se:</p>
    <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px;">
      <li>Tenha um documento com foto em mãos</li>
      <li>Escolha um ambiente silencioso com boa conexão</li>
      <li>Liste as suas dúvidas antes da consulta</li>
    </ul>
    <p style="margin: 24px 0 0;">
      <a href="${portalUrl}" style="display: inline-block; background: #1F4D3A; color: #FAF8F5; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600;">Ver no meu portal</a>
    </p>
    <p style="font-size: 13px; color: #5A5A57; margin-top: 32px; border-top: 1px solid #E5E1D8; padding-top: 16px;">
      Se precisar remarcar, responda este email ou acesse o portal. Para cancelar, entre em contato pelo WhatsApp.
    </p>
  </div>
</body>
</html>`.trim();

  const text = `Olá, ${name}!

Este é um lembrete automático: sua consulta MEDVi é ${heads}.

Médico: ${doctorName}${specialty ? ` — ${specialty}` : ''}
Data e horário: ${when}

Acesse seu portal: ${portalUrl}

Se precisar remarcar ou cancelar, responda este email ou entre em contato pelo WhatsApp.`;

  return { subject, html, text };
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const key = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('LEAD_FROM_EMAIL') ?? 'MEDVi <no-reply@medvi.com.br>';
  if (!key) {
    console.warn('[reminders] RESEND_API_KEY not set — skipping email to', to);
    return false;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[reminders] Resend error', res.status, body);
    return false;
  }
  return true;
}

async function sendWhatsApp(phone: string, body: string): Promise<boolean> {
  // TODO: integrate with a WhatsApp Business Solution Provider.
  // Candidates: Meta WhatsApp Cloud API, Twilio, Zenvia, Gupshup, 360dialog.
  // `wa.me` links do NOT support programmatic sending — the user has to click
  // them manually. You need a BSP + an approved message template for this to
  // fire automatically. Set WHATSAPP_BSP_URL and WHATSAPP_BSP_TOKEN once you
  // have a provider and replace the early return below.
  const url = Deno.env.get('WHATSAPP_BSP_URL');
  const token = Deno.env.get('WHATSAPP_BSP_TOKEN');
  if (!url || !token) {
    console.log('[reminders] WhatsApp BSP not configured — would send to', phone, '\n', body);
    return false;
  }

  // Example shape — adjust to match your BSP's API.
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: phone.replace(/\D/g, ''),
      type: 'text',
      text: { body },
    }),
  });
  if (!res.ok) {
    console.error('[reminders] WhatsApp BSP error', res.status, await res.text());
    return false;
  }
  return true;
}

async function processOffset(
  supabase: ReturnType<typeof createClient>,
  offset: ReminderOffset,
): Promise<{ processed: number; sent: number }> {
  const now = new Date();
  const flag = offset === '24h' ? 'reminder_sent_24h' : 'reminder_sent_1h';

  // Define the window of appointments that should fire now.
  // 24h reminder: appointments starting between 23h and 25h from now.
  // 1h reminder:  appointments starting between 45m and 75m from now.
  // (Window width > cron interval so we never miss any.)
  const [minOffsetMs, maxOffsetMs] =
    offset === '24h'
      ? [23 * 3600_000, 25 * 3600_000]
      : [45 * 60_000, 75 * 60_000];

  const from = new Date(now.getTime() + minOffsetMs).toISOString();
  const to = new Date(now.getTime() + maxOffsetMs).toISOString();

  const { data, error } = await supabase
    .from('appointments')
    .select('id, doctor_id, starts_at, ends_at, status, patient_name, patient_email, patient_phone, reminder_sent_24h, reminder_sent_1h, doctors ( name, specialty )')
    .in('status', ['scheduled', 'confirmed'])
    .gte('starts_at', from)
    .lte('starts_at', to)
    .eq(flag, false);

  if (error) {
    console.error(`[reminders] query error for ${offset}`, error);
    return { processed: 0, sent: 0 };
  }

  const rows = (data ?? []) as unknown as AppointmentRow[];
  let sent = 0;

  for (const appt of rows) {
    const { subject, html, text } = emailBody(appt, offset);

    let okEmail = false;
    let okWa = false;

    if (appt.patient_email) {
      okEmail = await sendEmail(appt.patient_email, subject, html, text);
    }

    if (appt.patient_phone) {
      okWa = await sendWhatsApp(appt.patient_phone, `${subject}\n\n${text}`);
    }

    // Mark as sent if at least one channel succeeded (or if neither was
    // configured — prevents spamming logs each tick for unconfigurable rows).
    const markSent = okEmail || okWa || (!appt.patient_email && !appt.patient_phone);
    if (markSent) {
      const { error: updErr } = await supabase
        .from('appointments')
        .update({
          [flag]: true,
          reminder_error: okEmail || okWa ? null : 'no contact channels',
        })
        .eq('id', appt.id);
      if (updErr) {
        console.error('[reminders] failed to mark reminder sent', updErr);
      } else if (okEmail || okWa) {
        sent += 1;
      }
    } else {
      // Record the last error but keep the flag false so we retry next tick.
      await supabase
        .from('appointments')
        .update({ reminder_error: 'send failed' })
        .eq('id', appt.id);
    }
  }

  return { processed: rows.length, sent };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
Deno.serve(async (_req: any) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) {
    return new Response(
      JSON.stringify({ ok: false, error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const r24 = await processOffset(supabase, '24h');
  const r1 = await processOffset(supabase, '1h');

  return new Response(
    JSON.stringify({
      ok: true,
      at: new Date().toISOString(),
      '24h': r24,
      '1h': r1,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
