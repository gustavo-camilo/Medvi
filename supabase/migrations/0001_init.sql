-- MEDVi Brasil — initial schema
-- Creates the `leads` table with RLS enabled and a single insert policy
-- that only allows anonymous submissions when LGPD consent is given.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  email text not null,
  telefone text not null,
  cpf text,
  peso_kg numeric(5, 2),
  altura_cm numeric(5, 2),
  imc numeric(5, 2),
  meta_perda_kg numeric(5, 2),
  objetivo text,
  historico_medico jsonb,
  consentimento_lgpd boolean not null,
  utm jsonb,
  status text not null default 'novo'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- Anonymous visitors can INSERT a lead, but only if they explicitly consented.
-- No SELECT policy = no public reads. Service role bypasses RLS.
drop policy if exists "anon can insert leads with consent" on public.leads;
create policy "anon can insert leads with consent"
  on public.leads
  for insert
  to anon
  with check (consentimento_lgpd = true);
