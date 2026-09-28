-- IA real del Check de Presencia (2026-09-28) — 30-INTEGRACION-IA.md.
-- 1) Los Checks ya no los crea el navegador: los crea el servidor, que es
--    el único que puede aplicar el límite de 3 al día y el tope de gasto.
-- 2) Reserva ATÓMICA (límite por usuario + tope global diario/mensual) antes
--    de llamar a la IA, y liquidación del costo real al terminar.

-- ── checks: nuevos estados y columnas ───────────────────────────────────
alter table public.checks drop constraint if exists checks_estado_check;
alter table public.checks
  add constraint checks_estado_check
  check (estado in ('pendiente', 'procesando', 'listo', 'invalida', 'error'));

alter table public.checks
  add column if not exists fecha_local date,
  add column if not exists puntaje numeric(3, 1),
  add column if not exists motivo text,
  add column if not exists analizado_at timestamptz;

-- Zona horaria del usuario: se fija con su primer Check y ya no cambia, así
-- el "día" del límite no se puede estirar mandando otra zona cada vez.
alter table public.profiles add column if not exists zona_horaria text;

create index if not exists checks_user_fecha_local_idx on public.checks(user_id, fecha_local);
create unique index if not exists checks_foto_url_uidx on public.checks(foto_url) where foto_url is not null;

-- El usuario ya no inserta ni edita Checks directo (podría escribirse su
-- propio "resultado" o saltarse el límite). Solo lee los suyos.
drop policy if exists "checks_insert_own" on public.checks;
drop policy if exists "checks_update_own" on public.checks;

-- ── reservar_check: límite diario + tope global, todo en una transacción ─
create or replace function public.reservar_check(
  p_user uuid,
  p_ocasion text,
  p_foto text,
  p_fecha_local date,
  p_limite_dia integer,
  p_max_intentos_dia integer,
  p_tope_dia_usd numeric,
  p_tope_mes_usd numeric,
  p_costo_reserva_usd numeric,
  p_modelo text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existente public.checks%rowtype;
  v_usados integer;
  v_intentos integer;
  v_gasto_dia numeric;
  v_gasto_mes numeric;
  v_check uuid;
  v_call uuid;
begin
  -- Doble-tap / reintento con la misma foto: devolver el mismo Check.
  select * into v_existente from public.checks where foto_url = p_foto and user_id = p_user;
  if found then
    return jsonb_build_object('ok', false, 'motivo', 'duplicado', 'check_id', v_existente.id, 'estado', v_existente.estado);
  end if;

  -- Serializa por usuario (límite) y global (presupuesto) mientras se decide.
  perform pg_advisory_xact_lock(hashtext('niki_check_user_' || p_user::text));
  perform pg_advisory_xact_lock(hashtext('niki_ai_budget'));

  -- Un Check que quedó "procesando" más de 3 min (la función se cortó) no
  -- debe gastarle un Check al usuario.
  update public.checks set estado = 'error', motivo = 'sin_respuesta'
   where user_id = p_user and estado = 'procesando' and created_at < now() - interval '3 minutes';

  select count(*) filter (where estado in ('procesando', 'listo')), count(*)
    into v_usados, v_intentos
    from public.checks
   where user_id = p_user and fecha_local = p_fecha_local;

  if v_usados >= p_limite_dia then
    return jsonb_build_object('ok', false, 'motivo', 'limite', 'usados', v_usados);
  end if;
  if v_intentos >= p_max_intentos_dia then
    return jsonb_build_object('ok', false, 'motivo', 'intentos', 'usados', v_usados);
  end if;

  select coalesce(sum(cost_usd), 0) into v_gasto_dia
    from public.ai_calls where created_at >= date_trunc('day', now());
  select coalesce(sum(cost_usd), 0) into v_gasto_mes
    from public.ai_calls where created_at >= date_trunc('month', now());

  if v_gasto_dia + p_costo_reserva_usd > p_tope_dia_usd then
    return jsonb_build_object('ok', false, 'motivo', 'tope_dia', 'usados', v_usados);
  end if;
  if v_gasto_mes + p_costo_reserva_usd > p_tope_mes_usd then
    return jsonb_build_object('ok', false, 'motivo', 'tope_mes', 'usados', v_usados);
  end if;

  insert into public.checks (user_id, ocasion, foto_url, estado, fecha_local)
  values (p_user, p_ocasion, p_foto, 'procesando', p_fecha_local)
  returning id into v_check;

  -- La reserva cuenta en el gasto desde YA (con el costo máximo estimado),
  -- así dos pedidos simultáneos no pueden pasarse del tope.
  insert into public.ai_calls (user_id, feature, model, cost_usd, status)
  values (p_user, 'check_presencia', p_modelo, p_costo_reserva_usd, 'reservado')
  returning id into v_call;

  return jsonb_build_object('ok', true, 'check_id', v_check, 'ai_call_id', v_call, 'usados', v_usados + 1);
end;
$$;

-- ── finalizar_check: guarda el resultado, liquida el costo real, da la gema ─
create or replace function public.finalizar_check(
  p_check uuid,
  p_ai_call uuid,
  p_estado text,
  p_resultado jsonb,
  p_puntaje numeric,
  p_motivo text,
  p_tokens_in integer,
  p_tokens_out integer,
  p_costo_usd numeric,
  p_latencia_ms integer,
  p_error text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
begin
  update public.checks
     set estado = p_estado,
         resultado = p_resultado,
         puntaje = p_puntaje,
         motivo = p_motivo,
         analizado_at = now()
   where id = p_check and estado = 'procesando'
  returning user_id into v_user;

  update public.ai_calls
     set status = case when p_error is null then 'ok' else 'error' end,
         tokens_in = p_tokens_in,
         tokens_out = p_tokens_out,
         cost_usd = p_costo_usd,
         latency_ms = p_latencia_ms,
         error = p_error
   where id = p_ai_call;

  if p_estado = 'listo' and v_user is not null then
    update public.profiles set gemas = gemas + 1 where id = v_user;
  end if;
end;
$$;

-- Solo el servidor (clave de servicio) puede llamarlas.
revoke execute on function public.reservar_check(uuid, text, text, date, integer, integer, numeric, numeric, numeric, text) from public, anon, authenticated;
revoke execute on function public.finalizar_check(uuid, uuid, text, jsonb, numeric, text, integer, integer, numeric, integer, text) from public, anon, authenticated;
grant execute on function public.reservar_check(uuid, text, text, date, integer, integer, numeric, numeric, numeric, text) to service_role;
grant execute on function public.finalizar_check(uuid, uuid, text, jsonb, numeric, text, integer, integer, numeric, integer, text) to service_role;
