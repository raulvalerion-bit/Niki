-- Reconciliación semanal de suscripciones (18-VENTA-HOTMART §"RECONCILIACIÓN
-- SEMANAL", gate 2 de 61) — 2026-10-03. Cada corrida compara las
-- suscripciones de Hotmart contra el acceso en Niki y guarda las diferencias
-- en AMBAS direcciones. Solo REPORTA (decisión 2026-10-03): el dueño corrige
-- a mano desde el panel. Tabla 100% admin; escribe solo el servidor.

create table public.reconciliacion_hotmart (
  id bigserial primary key,
  ran_at timestamptz not null default now(),
  origen text not null check (origen in ('cron', 'manual')),
  ok boolean not null,
  error text,
  total_hotmart int not null default 0,
  total_con_acceso int not null default 0,
  manuales int not null default 0,
  -- [{tipo, email, nombre, codigo, estado_hotmart, estado_niki, detalle}]
  diferencias jsonb not null default '[]'::jsonb
);

create index reconciliacion_hotmart_ran_idx on public.reconciliacion_hotmart(ran_at desc);

alter table public.reconciliacion_hotmart enable row level security;

create policy "reconciliacion_hotmart_admin_select" on public.reconciliacion_hotmart
  for select using ((select private.es_admin()));
