-- RUTA DE PRESENCIA — Misión de la semana (2026-10-04, 24 MECÁNICA 2/3 + 61 Gate 5).
-- La misión sale del eje más débil (promedio de sus últimos 5 Checks) y se FIJA la
-- primera vez que se pide en la semana: no cambia aunque cambien los Checks.
-- Se cumple con 3 Checks de esa semana con nota >= meta en ese eje → +3 gemas, una vez.
-- El cliente solo lee y pide reclamar; gemas, meta y conteo los decide SOLO el servidor.

create table public.misiones_semana (
  user_id uuid not null references auth.users(id) on delete cascade,
  semana date not null, -- lunes de la semana (fecha local del usuario)
  eje text not null check (eje in ('outfit', 'postura', 'actitud')),
  meta integer not null check (meta between 1 and 10),
  reclamada_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, semana)
);

alter table public.misiones_semana enable row level security;

create policy "misiones_semana_select_own" on public.misiones_semana
  for select using ((select auth.uid()) = user_id);
-- Sin políticas de insert/update: solo las funciones de abajo escriben.

create index if not exists checks_user_fecha_local_idx on public.checks(user_id, fecha_local);

-- Lunes de la semana de p_hoy, aceptando solo la fecha local real (±1 día de UTC).
create or replace function public._semana_de(p_hoy date)
returns date
language sql
immutable
set search_path = ''
as $$
  select date_trunc('week', p_hoy)::date
$$;

create or replace function public.mision_semana(p_hoy date)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_semana date;
  v_mision public.misiones_semana%rowtype;
  v_eje text;
  v_prom numeric;
  v_hechos integer;
begin
  if v_user is null then
    raise exception 'sin sesión';
  end if;
  if p_hoy is null or abs(p_hoy - (now() at time zone 'utc')::date) > 1 then
    raise exception 'fecha fuera de rango';
  end if;
  v_semana := public._semana_de(p_hoy);

  select * into v_mision from public.misiones_semana where user_id = v_user and semana = v_semana;

  if not found then
    -- Eje más débil en los últimos 5 Checks listos (empate: postura, actitud, outfit).
    select e.eje, e.prom into v_eje, v_prom
      from (
        select x.eje, avg(x.nota) as prom
          from (
            select c.resultado from public.checks c
             where c.user_id = v_user and c.estado = 'listo' and c.resultado is not null
             order by c.created_at desc
             limit 5
          ) u
          cross join lateral (values
            ('postura', (u.resultado -> 'postura' ->> 'nota')::numeric, 1),
            ('actitud', (u.resultado -> 'actitud' ->> 'nota')::numeric, 2),
            ('outfit', (u.resultado -> 'outfit' ->> 'nota')::numeric, 3)
          ) as x(eje, nota, orden)
         group by x.eje, x.orden
         order by avg(x.nota) asc, x.orden asc
         limit 1
      ) e;

    if v_eje is null then
      return null; -- todavía sin Checks: la pantalla invita a hacer el primero
    end if;

    insert into public.misiones_semana (user_id, semana, eje, meta)
    values (v_user, v_semana, v_eje, least(9, greatest(6, floor(v_prom)::integer + 1)))
    on conflict (user_id, semana) do nothing;

    select * into v_mision from public.misiones_semana where user_id = v_user and semana = v_semana;
  end if;

  select count(*) into v_hechos
    from public.checks c
   where c.user_id = v_user and c.estado = 'listo'
     and c.fecha_local >= v_semana and c.fecha_local < v_semana + 7
     and (c.resultado -> v_mision.eje ->> 'nota')::numeric >= v_mision.meta;

  return jsonb_build_object(
    'semana', v_mision.semana,
    'eje', v_mision.eje,
    'meta', v_mision.meta,
    'hechos', least(v_hechos, 3),
    'objetivo', 3,
    'reclamada', v_mision.reclamada_at is not null
  );
end;
$$;

create or replace function public.reclamar_mision(p_hoy date)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_semana date;
  v_mision public.misiones_semana%rowtype;
  v_hechos integer;
  v_gemas integer;
begin
  if v_user is null then
    raise exception 'sin sesión';
  end if;
  if p_hoy is null or abs(p_hoy - (now() at time zone 'utc')::date) > 1 then
    raise exception 'fecha fuera de rango';
  end if;
  v_semana := public._semana_de(p_hoy);

  select * into v_mision from public.misiones_semana
   where user_id = v_user and semana = v_semana
   for update;
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'sin_mision');
  end if;
  if v_mision.reclamada_at is not null then
    return jsonb_build_object('ok', false, 'motivo', 'ya_reclamada');
  end if;

  select count(*) into v_hechos
    from public.checks c
   where c.user_id = v_user and c.estado = 'listo'
     and c.fecha_local >= v_semana and c.fecha_local < v_semana + 7
     and (c.resultado -> v_mision.eje ->> 'nota')::numeric >= v_mision.meta;
  if v_hechos < 3 then
    return jsonb_build_object('ok', false, 'motivo', 'incompleta');
  end if;

  update public.misiones_semana set reclamada_at = now()
   where user_id = v_user and semana = v_semana;
  update public.profiles set gemas = gemas + 3 where id = v_user
  returning gemas into v_gemas;

  return jsonb_build_object('ok', true, 'gemas', v_gemas);
end;
$$;

revoke execute on function public.mision_semana(date) from public, anon;
revoke execute on function public.reclamar_mision(date) from public, anon;
grant execute on function public.mision_semana(date) to authenticated;
grant execute on function public.reclamar_mision(date) to authenticated;
