-- Racha Glow-Up de 21 días (24 MECÁNICA 1 + 56 M2/M4) — 2026-09-28.
-- Un día cuenta cuando hay al menos 1 Check "listo" en la fecha LOCAL del
-- usuario. La racha la calcula SOLO el servidor dentro de finalizar_check
-- (61 Gate 5): el cliente puede leerla, nunca escribirla.

alter table public.profiles
  add column if not exists racha_mejor integer not null default 0,
  add column if not exists congeladores integer not null default 2 check (congeladores between 0 and 2),
  add column if not exists glowup_completado_at timestamptz;

-- finalizar_check ahora devuelve el estado de la racha (para celebrar el hito
-- en la MISMA respuesta, 24). Cambia el tipo de retorno → se recrea.
drop function if exists public.finalizar_check(uuid, uuid, text, jsonb, numeric, text, integer, integer, numeric, integer, text);

create function public.finalizar_check(
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
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
  v_fecha date;
  v_perfil public.profiles%rowtype;
  v_dias integer;
  v_perdidos integer;
  v_racha integer;
  v_congeladores integer;
  v_usados integer := 0;
  v_hito integer := null;
  v_extendida boolean := false;
begin
  update public.checks
     set estado = p_estado,
         resultado = p_resultado,
         puntaje = p_puntaje,
         motivo = p_motivo,
         analizado_at = now()
   where id = p_check and estado = 'procesando'
  returning user_id, fecha_local into v_user, v_fecha;

  update public.ai_calls
     set status = case when p_error is null then 'ok' else 'error' end,
         tokens_in = p_tokens_in,
         tokens_out = p_tokens_out,
         cost_usd = p_costo_usd,
         latency_ms = p_latencia_ms,
         error = p_error
   where id = p_ai_call;

  if p_estado <> 'listo' or v_user is null then
    return jsonb_build_object('racha', null);
  end if;

  select * into v_perfil from public.profiles where id = v_user for update;
  v_racha := v_perfil.racha_dias;
  v_congeladores := v_perfil.congeladores;

  if v_perfil.racha_ultima_fecha is null or v_racha = 0 then
    v_racha := 1;
    v_extendida := true;
  elsif v_fecha > v_perfil.racha_ultima_fecha then
    v_dias := v_fecha - v_perfil.racha_ultima_fecha;
    v_perdidos := v_dias - 1;
    if v_perdidos = 0 then
      v_racha := v_racha + 1;
    elsif v_perdidos <= v_congeladores then
      -- 1 congelador por cada día perdido (24): la racha se salva.
      v_congeladores := v_congeladores - v_perdidos;
      v_usados := v_perdidos;
      v_racha := v_racha + 1;
    else
      v_racha := 1;
    end if;
    v_extendida := true;
  end if;
  -- (misma fecha u otra anterior: el día ya contaba, no cambia nada)

  if v_extendida then
    -- Cada 7 días seguidos se gana un congelador (máximo 2).
    if v_racha % 7 = 0 and v_congeladores < 2 then
      v_congeladores := v_congeladores + 1;
    end if;
    if v_racha in (3, 7, 14, 21) then
      v_hito := v_racha;
    end if;
  end if;

  update public.profiles
     set gemas = gemas + 1,
         racha_dias = v_racha,
         racha_ultima_fecha = greatest(coalesce(racha_ultima_fecha, v_fecha), v_fecha),
         racha_mejor = greatest(racha_mejor, v_racha),
         congeladores = v_congeladores,
         glowup_completado_at = case
           when v_racha >= 21 and glowup_completado_at is null then now()
           else glowup_completado_at
         end
   where id = v_user;

  return jsonb_build_object(
    'racha', v_racha,
    'mejor', greatest(v_perfil.racha_mejor, v_racha),
    'congeladores', v_congeladores,
    'congeladores_usados', v_usados,
    'hito', v_hito,
    'reiniciada', v_extendida and v_racha = 1 and v_perfil.racha_dias > 1
  );
end;
$$;

revoke execute on function public.finalizar_check(uuid, uuid, text, jsonb, numeric, text, integer, integer, numeric, integer, text) from public, anon, authenticated;
grant execute on function public.finalizar_check(uuid, uuid, text, jsonb, numeric, text, integer, integer, numeric, integer, text) to service_role;
