-- MEDVi Brasil — customer portal tables
-- orders, payments, message_threads, messages, health_log

do $$ begin
  create type public.order_status as enum (
    'aguardando_pagamento','pago','em_separacao','enviado','entregue','cancelado'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_method as enum ('pix','cartao','boleto');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pendente','aprovado','recusado','estornado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.message_sender_role as enum ('patient','admin','doctor');
exception when duplicate_object then null; end $$;

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  status public.order_status not null default 'aguardando_pagamento',
  items jsonb not null default '[]'::jsonb,
  subtotal_brl numeric(10, 2) not null default 0,
  shipping_brl numeric(10, 2) not null default 0,
  total_brl numeric(10, 2) not null default 0,
  payment_method public.payment_method,
  payment_status public.payment_status not null default 'pendente',
  tracking_code text,
  shipping_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_patient_idx on public.orders (patient_id, created_at desc);

-- payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount_brl numeric(10, 2) not null,
  method public.payment_method not null,
  status public.payment_status not null default 'pendente',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists payments_order_idx on public.payments (order_id);

-- message_threads
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  subject text,
  last_message_at timestamptz,
  unread_count_patient int not null default 0,
  unread_count_admin int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists threads_patient_idx on public.message_threads (patient_id);

-- messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_role public.message_sender_role not null,
  sender_id uuid,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_thread_idx on public.messages (thread_id, created_at);

-- health_log
create table if not exists public.health_log (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  weight_kg numeric(5, 2),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists health_log_patient_date_idx on public.health_log (patient_id, date desc);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.health_log enable row level security;

-- orders
drop policy if exists "patient rw own orders" on public.orders;
create policy "patient rw own orders"
  on public.orders for all
  to authenticated
  using (patient_id = auth.uid() or public.is_admin())
  with check (patient_id = auth.uid() or public.is_admin());

-- payments
drop policy if exists "patient read own payments" on public.payments;
create policy "patient read own payments"
  on public.payments for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
       where o.id = payments.order_id
         and (o.patient_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "admin write payments" on public.payments;
create policy "admin write payments"
  on public.payments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- message_threads
drop policy if exists "patient rw own threads" on public.message_threads;
create policy "patient rw own threads"
  on public.message_threads for all
  to authenticated
  using (patient_id = auth.uid() or public.is_admin())
  with check (patient_id = auth.uid() or public.is_admin());

-- messages
drop policy if exists "thread members rw messages" on public.messages;
create policy "thread members rw messages"
  on public.messages for all
  to authenticated
  using (
    exists (
      select 1 from public.message_threads t
       where t.id = messages.thread_id
         and (t.patient_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.message_threads t
       where t.id = messages.thread_id
         and (t.patient_id = auth.uid() or public.is_admin())
    )
  );

-- health_log
drop policy if exists "patient rw own health log" on public.health_log;
create policy "patient rw own health log"
  on public.health_log for all
  to authenticated
  using (patient_id = auth.uid() or public.is_admin())
  with check (patient_id = auth.uid() or public.is_admin());
