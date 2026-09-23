-- Esquema del backoffice (panel de administración del dueño) — 21-BACKOFFICE.md,
-- 31-EVALS-OBSERVABILIDAD-OPERACION.md y 09-SEGURIDAD.md.

-- ─────────────────────────────────────────────────────────────────────────
-- profiles: columnas nuevas para el backoffice. PRIMERO las columnas: la
-- función de abajo (private.es_admin) las referencia y, en `language sql`,
-- Postgres valida las columnas al CREAR la función, no solo al llamarla.
-- role         → quién puede entrar a /admin.
-- nombre       → para cuentas creadas manualmente por el dueño (o futuro perfil).
-- source       → canal de origen del cliente (36-ANALITICA, para CAC/LTV por canal).
-- creado_via   → 'login' (se registró solo) | 'manual' (el dueño la creó a mano).
-- ─────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column role text not null default 'user' check (role in ('user', 'admin')),
  add column nombre text,
  add column source text,
  add column creado_via text not null default 'login' check (creado_via in ('login', 'manual'));

-- El dueño actual (única cuenta que existe hoy) queda como admin.
update public.profiles set role = 'admin' where email = 'raulvalerion@gmail.com';

-- ─────────────────────────────────────────────────────────────────────────
-- Helper de autorización: private.es_admin(). SECURITY DEFINER en un schema
-- privado (patrón de 09-SEGURIDAD para políticas multi-tabla) — se usa en
-- TODAS las políticas "solo admin" de abajo, en vez de repetir el subquery.
-- ─────────────────────────────────────────────────────────────────────────
create schema if not exists private;

create or replace function private.es_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke execute on function private.es_admin() from public, anon;
grant execute on function private.es_admin() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- CIERRE DE UN HUECO DE SEGURIDAD encontrado al agregar `role`: la política
-- "profiles_update_own" original tenía `using` SIN `with check` (09-SEGURIDAD,
-- "forma ingenua" prohibida) — cualquier usuario logueado podía, desde la
-- consola del navegador, hacer `update({ plan: 'anual', role: 'admin', ... })`
-- sobre su propia fila: nada se lo impedía. Se corrige en dos capas:
-- (a) with check en la política (buena práctica, aunque aquí id no cambia).
-- (b) GRANT por COLUMNA: el rol `authenticated` (el navegador) SOLO puede
--     escribir las 4 columnas de respuestas del onboarding — igual que hoy
--     hace app/login/page.tsx. `role`, `plan`, `nombre`, `gemas`, etc. quedan
--     fuera del alcance del cliente: solo se tocan desde el servidor con la
--     clave de servicio (rutas /api/admin/*), que no respeta estos GRANT.
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke update on public.profiles from authenticated;
grant update (objetivo, dolor, ocasion_preferida, habito_ritmo) on public.profiles to authenticated;

-- El dueño lee TODAS las filas (lista de usuarios del panel) además de la suya.
create policy "profiles_admin_select_all" on public.profiles
  for select using (private.es_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- event_log: la fuente de verdad de activación/retención/uso (21 + 36).
-- Solo el propio usuario inserta SUS eventos; solo el admin los lee.
-- ─────────────────────────────────────────────────────────────────────────
create table public.event_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tipo text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index event_log_user_created_idx on public.event_log(user_id, created_at desc);
create index event_log_tipo_idx on public.event_log(tipo, created_at desc);

alter table public.event_log enable row level security;

create policy "event_log_insert_own" on public.event_log
  for insert with check ((select auth.uid()) = user_id);

create policy "event_log_admin_select" on public.event_log
  for select using (private.es_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- error_log: SOLO el servidor escribe (endpoint /api/log-error con la clave
-- de servicio, que ignora RLS) — sin política de insert para anon/authenticated,
-- así ni el propio cliente puede insertar directo (patrón "más robusto" del 21).
-- Solo el admin lee.
-- ─────────────────────────────────────────────────────────────────────────
create table public.error_log (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  context text not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index error_log_created_idx on public.error_log(created_at desc);
create index error_log_context_idx on public.error_log(context, created_at desc);

alter table public.error_log enable row level security;

create policy "error_log_admin_select" on public.error_log
  for select using (private.es_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- ai_calls (31-EVALS-OBSERVABILIDAD-OPERACION, esquema canónico): registra
-- cada llamada a la IA cuando se conecte. Hoy queda vacía (a propósito: el
-- backoffice la lee y muestra "Sin datos" hasta la Sesión de IA real).
-- Solo el servidor inserta (BFF con clave de servicio); solo el admin lee.
-- ─────────────────────────────────────────────────────────────────────────
create table public.ai_calls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  feature text not null,
  model text not null,
  tokens_in integer,
  tokens_out integer,
  cost_usd numeric(10, 5),
  latency_ms integer,
  status text not null,
  error text,
  prompt_hash text,
  created_at timestamptz not null default now()
);

create index ai_calls_user_created_idx on public.ai_calls(user_id, created_at desc);
create index ai_calls_feature_idx on public.ai_calls(feature, created_at desc);

alter table public.ai_calls enable row level security;

create policy "ai_calls_admin_select" on public.ai_calls
  for select using (private.es_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- acquisition_spend (21-BACKOFFICE): el dueño anota a mano el gasto de ads/
-- afiliados/UGC por canal y período, para calcular CAC. Tabla 100% admin.
-- ─────────────────────────────────────────────────────────────────────────
create table public.acquisition_spend (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'USD',
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now()
);

create index acquisition_spend_period_idx on public.acquisition_spend(period_start desc);

alter table public.acquisition_spend enable row level security;

create policy "acquisition_spend_admin_all" on public.acquisition_spend
  for all using (private.es_admin()) with check (private.es_admin());
