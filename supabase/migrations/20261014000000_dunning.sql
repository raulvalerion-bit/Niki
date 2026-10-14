-- DUNNING: recuperar cobros fallidos (58-RETENCION-DE-INGRESOS §Dunning, 18 §máquina de estados).
-- El webhook pone past_due con PURCHASE_DELAYED; aquí se registra DESDE CUÁNDO, qué correo de
-- la cadencia (días 1/3/5/7) ya se mandó y con qué método paga (tarjeta vs. ficha en efectivo).
-- Las columnas solo las escribe el servidor (service role / trigger): el usuario autenticado
-- conserva su UPDATE limitado a dolor, ocasion_preferida, objetivo y habito_ritmo.

alter table public.profiles
  add column if not exists past_due_desde timestamptz,
  add column if not exists dunning_paso smallint not null default 0,
  add column if not exists pago_metodo text;

-- El cron diario busca solo a quien está en atraso.
create index if not exists profiles_past_due_idx
  on public.profiles (past_due_desde)
  where suscripcion_estado = 'past_due';

-- Marca el inicio y el final del atraso en el mismo UPDATE que cambia el estado (atómico con la
-- RPC apply_hotmart_event) y deja el rastro en event_log para el backoffice (21/36).
create or replace function public.dunning_marcar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.suscripcion_estado = 'past_due' and old.suscripcion_estado is distinct from 'past_due' then
    new.past_due_desde := now();
    new.dunning_paso := 0;
    insert into public.event_log (tipo, user_id, metadata)
    values ('dunning_inicio', new.id, jsonb_build_object('desde', old.suscripcion_estado, 'metodo', new.pago_metodo));
  elsif old.suscripcion_estado = 'past_due' and new.suscripcion_estado is distinct from 'past_due' then
    insert into public.event_log (tipo, user_id, metadata)
    values (
      case when new.suscripcion_estado = 'active' then 'dunning_recuperado' else 'dunning_perdido' end,
      new.id,
      jsonb_build_object(
        'estado', new.suscripcion_estado,
        'correos', old.dunning_paso,
        'dias', extract(day from now() - coalesce(old.past_due_desde, now()))::int
      )
    );
    new.past_due_desde := null;
    new.dunning_paso := 0;
  end if;
  return new;
end;
$$;

revoke all on function public.dunning_marcar() from public, anon, authenticated;

drop trigger if exists profiles_dunning on public.profiles;
create trigger profiles_dunning
  before update of suscripcion_estado on public.profiles
  for each row execute function public.dunning_marcar();
