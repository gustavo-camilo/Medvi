-- MEDVi Brasil — appointment reminder tracking
-- Adds flags so the scheduled edge function knows which reminders were already sent.

alter table public.appointments
  add column if not exists reminder_sent_24h boolean not null default false,
  add column if not exists reminder_sent_1h boolean not null default false,
  add column if not exists reminder_error text;

-- Index used by the reminder edge function to scan upcoming appointments efficiently.
create index if not exists appointments_reminder_scan_idx
  on public.appointments (starts_at)
  where status in ('scheduled', 'confirmed');

-- ─── pg_cron schedule (OPTIONAL / REQUIRES MANUAL EDIT) ────────────────────
-- The cron schedule below is commented out because it contains a
-- project-specific URL. After running this migration, open the SQL editor
-- and run the snippet below with your own values:
--
--   select cron.schedule(
--     'send-appointment-reminders',
--     '*/15 * * * *',
--     $$
--     select net.http_post(
--       url := 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/send-appointment-reminders',
--       headers := jsonb_build_object(
--         'Content-Type', 'application/json',
--         'Authorization', 'Bearer YOUR-ANON-OR-SERVICE-ROLE-KEY'
--       ),
--       body := '{}'::jsonb
--     );
--     $$
--   );
--
-- Make sure the extensions `pg_cron` and `pg_net` are enabled first:
--   Supabase dashboard → Database → Extensions → enable `pg_cron` and `pg_net`.
--
-- To unschedule later:
--   select cron.unschedule('send-appointment-reminders');
