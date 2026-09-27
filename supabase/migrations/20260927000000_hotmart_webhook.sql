-- Conexión con Hotmart (18-VENTA-HOTMART.md + Gates 2/7 de 61-INTEGRIDAD).
-- El webhook (app/api/hotmart/webhook/route.ts) verifica el hottok, crea la
-- cuenta de auth si hace falta y DESPUÉS llama a apply_hotmart_event: la marca
-- de "evento procesado", el ledger de dinero y el cambio de plan ocurren en
-- UNA transacción. Si algo falla antes, el evento no queda procesado y Hotmart
-- lo reintenta (patrón A de "pagó y no entra").

-- ─────────────────────────────────────────────────────────────────────────
-- profiles: estado de la suscripción. `plan` + `plan_activo_hasta` siguen
-- siendo lo que decide el acceso (los usa también el alta manual del panel);
-- estas columnas guardan el detalle de Hotmart y la métrica prueba→pago.
-- ─────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column suscripcion_estado text check (suscripcion_estado in
    ('trialing', 'active', 'past_due', 'cancelled', 'expired', 'refunded', 'chargeback')),
  add column hotmart_plan text check (hotmart_plan in ('anual', 'mensual')),
  add column hotmart_subscriber_code text,
  add column hotmart_transaction text,
  add column hotmart_sck text,
  add column trial_ends_at timestamptz,
  add column first_paid_at timestamptz;

alter table public.profiles drop constraint profiles_creado_via_check;
alter table public.profiles add constraint profiles_creado_via_check
  check (creado_via in ('login', 'manual', 'hotmart'));

create index profiles_hotmart_subscriber_idx on public.profiles(hotmart_subscriber_code);

-- ─────────────────────────────────────────────────────────────────────────
-- processed_events: dedupe técnico — Hotmart REENVÍA eventos. Solo el
-- servidor (clave de servicio) escribe y lee: RLS activo y sin políticas.
-- ─────────────────────────────────────────────────────────────────────────
create table public.processed_events (
  event_id text primary key,
  event_type text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);
alter table public.processed_events enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- webhook_log: TODO intento (también los rechazados) — lo lee la pantalla
-- Salud del panel. `resumen` guarda la forma del evento SIN datos personales
-- del comprador (sirve para verificar cómo llega el inicio de la prueba).
-- ─────────────────────────────────────────────────────────────────────────
create table public.webhook_log (
  id bigserial primary key,
  event_id text,
  tipo text,
  resultado text not null check (resultado in
    ('applied', 'duplicate', 'illegal', 'unauthorized', 'ignored', 'error')),
  motivo text,
  resumen jsonb,
  received_at timestamptz not null default now()
);
create index webhook_log_received_idx on public.webhook_log(received_at desc);
create index webhook_log_resultado_idx on public.webhook_log(resultado, received_at desc);
alter table public.webhook_log enable row level security;
create policy "webhook_log_admin_select" on public.webhook_log
  for select using ((select private.es_admin()));

-- ─────────────────────────────────────────────────────────────────────────
-- payment_transactions: ledger económico. APPROVED y COMPLETE de la misma
-- compra comparten transaction_id → cuentan UNA sola vez.
-- ─────────────────────────────────────────────────────────────────────────
create table public.payment_transactions (
  provider text not null default 'hotmart',
  transaction_id text not null,
  economic_kind text not null check (economic_kind in ('sale', 'refund', 'chargeback')),
  user_id uuid references auth.users(id) on delete set null,
  product_id text not null,
  plan text,
  amount_minor bigint not null,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  occurred_at timestamptz not null,
  raw_event_id text not null,
  created_at timestamptz not null default now(),
  primary key (provider, transaction_id, economic_kind)
);
create index payment_transactions_user_idx on public.payment_transactions(user_id);
create index payment_transactions_occurred_idx on public.payment_transactions(occurred_at desc);
alter table public.payment_transactions enable row level security;
create policy "payment_transactions_admin_select" on public.payment_transactions
  for select using ((select private.es_admin()));

-- ─────────────────────────────────────────────────────────────────────────
-- apply_hotmart_event: idempotencia + ledger + transición de plan, atómico.
-- Recibe el usuario YA resuelto por el handler (p_user_id null = evento
-- negativo de alguien sin cuenta: solo se registra).
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.apply_hotmart_event(
  p_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_user_id uuid,
  p_nombre text,
  p_nuevo_estado text,
  p_plan text,
  p_hasta timestamptz,
  p_trial_hasta timestamptz,
  p_subscriber_code text,
  p_transaction text,
  p_sck text,
  p_ledger_kind text,
  p_amount_minor bigint,
  p_currency text,
  p_product_id text,
  p_occurred_at timestamptz
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_estado text;
  v_tx text;
  v_hasta timestamptz;
  v_plan_actual text;
  v_hotmart_plan text;
begin
  -- (a) Idempotencia: el mismo evento reenviado no hace nada.
  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;

  -- (b) Ledger económico (dedupe por transacción + tipo, no por evento).
  if p_ledger_kind is not null and p_transaction is not null then
    insert into public.payment_transactions
      (transaction_id, economic_kind, user_id, product_id, plan, amount_minor, currency, occurred_at, raw_event_id)
    values
      (p_transaction, p_ledger_kind, p_user_id, p_product_id, p_plan, p_amount_minor, p_currency,
       coalesce(p_occurred_at, now()), p_event_id)
    on conflict (provider, transaction_id, economic_kind) do nothing;
  end if;

  if p_user_id is null then
    return jsonb_build_object('status', 'applied', 'sin_cuenta', true);
  end if;

  select suscripcion_estado, hotmart_transaction, plan_activo_hasta, plan, hotmart_plan
    into v_estado, v_tx, v_hasta, v_plan_actual, v_hotmart_plan
  from public.profiles where id = p_user_id for update;

  if not found then
    return jsonb_build_object('status', 'error', 'motivo', 'sin_perfil');
  end if;

  -- (c) Transición legal: un evento viejo de la MISMA compra no resucita un
  --     reembolso/contracargo. Una compra NUEVA (otra transacción) sí reactiva.
  if v_estado in ('refunded', 'chargeback')
     and p_nuevo_estado in ('trialing', 'active', 'past_due', 'cancelled')
     and (p_transaction is null or p_transaction = v_tx) then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_estado);
  end if;

  update public.profiles set
    nombre = coalesce(nombre, nullif(p_nombre, '')),
    hotmart_subscriber_code = coalesce(p_subscriber_code, hotmart_subscriber_code),
    hotmart_sck = coalesce(hotmart_sck, p_sck)
  where id = p_user_id;

  if p_nuevo_estado = 'trialing' then
    update public.profiles set
      plan = 'trial',
      suscripcion_estado = 'trialing',
      hotmart_plan = coalesce(p_plan, hotmart_plan),
      hotmart_transaction = coalesce(p_transaction, hotmart_transaction),
      plan_activo_hasta = p_hasta,
      trial_ends_at = p_trial_hasta
    where id = p_user_id;

  elsif p_nuevo_estado = 'active' then
    update public.profiles set
      plan = coalesce(p_plan, hotmart_plan, 'mensual'),
      suscripcion_estado = 'active',
      hotmart_plan = coalesce(p_plan, hotmart_plan),
      hotmart_transaction = coalesce(p_transaction, hotmart_transaction),
      plan_activo_hasta = greatest(coalesce(plan_activo_hasta, now()), p_hasta),
      first_paid_at = coalesce(first_paid_at, now())
    where id = p_user_id;

  elsif p_nuevo_estado = 'past_due' then
    -- Periodo de gracia: no se corta el acceso de golpe (dunning, 18/58).
    update public.profiles set
      suscripcion_estado = 'past_due',
      plan_activo_hasta = greatest(coalesce(plan_activo_hasta, now()), p_hasta)
    where id = p_user_id;

  elsif p_nuevo_estado = 'cancelled' then
    -- Cancelar detiene la renovación, NO corta lo ya pagado.
    update public.profiles set
      plan = 'cancelado',
      suscripcion_estado = 'cancelled',
      plan_activo_hasta = coalesce(p_hasta, plan_activo_hasta)
    where id = p_user_id;

  elsif p_nuevo_estado in ('expired', 'refunded', 'chargeback') then
    -- Corte inmediato del acceso; los datos del usuario NO se borran.
    update public.profiles set
      plan = 'ninguno',
      suscripcion_estado = p_nuevo_estado,
      plan_activo_hasta = now()
    where id = p_user_id;

  elsif p_nuevo_estado is null and p_plan is not null then
    -- Cambio de plan (SWITCH_PLAN): mismo estado, otro plan.
    update public.profiles set
      hotmart_plan = p_plan,
      plan = case when plan in ('anual', 'mensual') then p_plan else plan end
    where id = p_user_id;
  end if;

  return jsonb_build_object('status', 'applied', 'nuevo_estado', p_nuevo_estado);
end;
$$;

revoke execute on function public.apply_hotmart_event(
  text, text, text, uuid, text, text, text, timestamptz, timestamptz,
  text, text, text, text, bigint, text, text, timestamptz
) from public, anon, authenticated;
