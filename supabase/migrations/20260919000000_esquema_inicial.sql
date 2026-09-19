-- Esquema inicial de Niki — Sesión de Servicios Externos (2026-09-19).
-- Patrón de RLS: (select auth.uid()) = user_id, con índice en esa columna,
-- por rendimiento en tablas grandes (docs/sistema/25-BASE-DE-DATOS.md).

-- ─────────────────────────────────────────────────────────────────────────
-- profiles: 1:1 con auth.users. Guarda las respuestas del onboarding, el
-- estado del plan (lo actualiza el webhook de Hotmart más adelante), y el
-- progreso del hábito (gemas, racha) que hoy se ve en la app.
-- ─────────────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  objetivo text,
  dolor text,
  ocasion_preferida text,
  habito_ritmo text check (habito_ritmo in ('express', 'eventos')),
  gemas integer not null default 0,
  racha_dias integer not null default 0,
  racha_ultima_fecha date,
  plan text not null default 'ninguno' check (plan in ('ninguno', 'trial', 'anual', 'mensual', 'cancelado')),
  plan_activo_hasta timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles(email);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id);

-- ─────────────────────────────────────────────────────────────────────────
-- checks: cada "Check de Presencia" (scan) que hace un usuario. `resultado`
-- queda null hasta que el análisis por IA se conecte — nunca se inventa.
-- ─────────────────────────────────────────────────────────────────────────
create table public.checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ocasion text not null,
  foto_url text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'listo')),
  resultado jsonb,
  created_at timestamptz not null default now()
);

create index checks_user_id_idx on public.checks(user_id);
create index checks_user_created_idx on public.checks(user_id, created_at desc);

alter table public.checks enable row level security;

create policy "checks_select_own" on public.checks
  for select using ((select auth.uid()) = user_id);

create policy "checks_insert_own" on public.checks
  for insert with check ((select auth.uid()) = user_id);

create policy "checks_update_own" on public.checks
  for update using ((select auth.uid()) = user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- habito_registros: marca de "hoy cumplí mi hábito" — un registro por día.
-- ─────────────────────────────────────────────────────────────────────────
create table public.habito_registros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fecha date not null,
  cumplido boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, fecha)
);

create index habito_registros_user_id_idx on public.habito_registros(user_id);

alter table public.habito_registros enable row level security;

create policy "habito_registros_select_own" on public.habito_registros
  for select using ((select auth.uid()) = user_id);

create policy "habito_registros_insert_own" on public.habito_registros
  for insert with check ((select auth.uid()) = user_id);

create policy "habito_registros_update_own" on public.habito_registros
  for update using ((select auth.uid()) = user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Trigger: crea el profile automáticamente cuando el webhook de Hotmart (o
-- el login) da de alta un usuario en auth.users.
-- ─────────────────────────────────────────────────────────────────────────
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- Trigger: mantiene updated_at al día en profiles.
-- ─────────────────────────────────────────────────────────────────────────
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
