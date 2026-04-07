-- MEDVi Brasil — scheduling schema
-- doctors, availability_rules, availability_overrides, appointments
-- With an EXCLUDE constraint to prevent double-booking at the DB level.

create extension if not exists "pgcrypto";
create extension if not exists "btree_gist";

-- ── doctors ────────────────────────────────────────────────────────────────
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  crm text,
  specialty text,
  bio text,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists doctors_active_idx on public.doctors (active);

-- ── availability_rules ─────────────────────────────────────────────────────
create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_duration_minutes int not null default 30,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists availability_rules_doctor_idx on public.availability_rules (doctor_id);

-- ── availability_overrides ─────────────────────────────────────────────────
create table if not exists public.availability_overrides (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  type text not null check (type in ('block', 'available')),
  created_at timestamptz not null default now()
);

create index if not exists availability_overrides_doctor_date_idx
  on public.availability_overrides (doctor_id, date);

-- ── appointments ───────────────────────────────────────────────────────────
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  patient_id uuid,
  lead_id uuid references public.leads(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  patient_name text,
  patient_email text,
  patient_phone text,
  notes text,
  video_link text,
  created_at timestamptz not null default now()
);

create index if not exists appointments_doctor_starts_idx
  on public.appointments (doctor_id, starts_at);
create index if not exists appointments_patient_starts_idx
  on public.appointments (patient_id, starts_at);

-- Prevent double-booking: no two active appointments can overlap for the same doctor.
alter table public.appointments
  drop constraint if exists appointments_no_overlap;
alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    doctor_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('scheduled', 'confirmed'));

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.doctors enable row level security;
alter table public.availability_rules enable row level security;
alter table public.availability_overrides enable row level security;
alter table public.appointments enable row level security;

-- doctors: anyone can read active doctors
drop policy if exists "anyone read active doctors" on public.doctors;
create policy "anyone read active doctors"
  on public.doctors for select
  to anon, authenticated
  using (active = true);

-- availability_rules: public read
drop policy if exists "anyone read availability rules" on public.availability_rules;
create policy "anyone read availability rules"
  on public.availability_rules for select
  to anon, authenticated
  using (true);

-- availability_overrides: public read
drop policy if exists "anyone read availability overrides" on public.availability_overrides;
create policy "anyone read availability overrides"
  on public.availability_overrides for select
  to anon, authenticated
  using (true);

-- appointments: anon can INSERT (public booking) only as guest
drop policy if exists "anon can insert guest appointments" on public.appointments;
create policy "anon can insert guest appointments"
  on public.appointments for insert
  to anon
  with check (
    patient_id is null
    and patient_name is not null
    and patient_email is not null
  );

-- authenticated can also insert (for logged-in patients)
drop policy if exists "authenticated can insert own appointments" on public.appointments;
create policy "authenticated can insert own appointments"
  on public.appointments for insert
  to authenticated
  with check (
    patient_id = auth.uid()
    or (patient_id is null and patient_name is not null)
  );

-- authenticated patients can SELECT their own appointments
drop policy if exists "patients read own appointments" on public.appointments;
create policy "patients read own appointments"
  on public.appointments for select
  to authenticated
  using (patient_id = auth.uid());

-- ── Seed doctors + weekly rules ────────────────────────────────────────────
insert into public.doctors (slug, name, crm, specialty, bio, active)
values
  ('ana-mendes',
   'Dra. Ana Carolina Mendes',
   'CRM/SP 000.000',
   'Endocrinologia',
   'Especialista em obesidade e metabolismo, com mais de 10 anos de experiência clínica.',
   true),
  ('pedro-souza',
   'Dr. Pedro Henrique Souza',
   'CRM/RJ 000.000',
   'Clínica Médica',
   'Foco em emagrecimento sustentável e mudança de hábitos, com abordagem humanizada.',
   true)
on conflict (slug) do nothing;

-- Seed Mon-Fri 09:00-18:00 slots of 30 minutes for each doctor.
do $$
declare
  d record;
  dow int;
begin
  for d in select id from public.doctors loop
    for dow in 1..5 loop
      if not exists (
        select 1 from public.availability_rules
         where doctor_id = d.id and day_of_week = dow
      ) then
        insert into public.availability_rules
          (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, active)
        values
          (d.id, dow, '09:00', '18:00', 30, true);
      end if;
    end loop;
  end loop;
end $$;
