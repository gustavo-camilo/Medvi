-- MEDVi Brasil — profiles + auth helpers
-- User roles, profiles table tied to auth.users, plus RLS helpers.

do $$ begin
  create type public.user_role as enum ('admin', 'patient');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  telefone text,
  cpf text,
  endereco jsonb,
  role public.user_role not null default 'patient',
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- Trigger: on auth.users insert, create a profile with the nome from metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', new.email),
    new.raw_user_meta_data ->> 'telefone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Admin check helper (bypasses RLS via security definer)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
     where id = auth.uid() and role = 'admin'
  );
$$;

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Extend appointments RLS — admin reads all
drop policy if exists "admin read all appointments" on public.appointments;
create policy "admin read all appointments"
  on public.appointments for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin update all appointments" on public.appointments;
create policy "admin update all appointments"
  on public.appointments for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Extend leads RLS — admin reads all
drop policy if exists "admin read all leads" on public.leads;
create policy "admin read all leads"
  on public.leads for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin update all leads" on public.leads;
create policy "admin update all leads"
  on public.leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Doctors admin writes
drop policy if exists "admin manage doctors" on public.doctors;
create policy "admin manage doctors"
  on public.doctors for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin manage availability rules" on public.availability_rules;
create policy "admin manage availability rules"
  on public.availability_rules for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin manage availability overrides" on public.availability_overrides;
create policy "admin manage availability overrides"
  on public.availability_overrides for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
