-- Rate limit para pedir código de acceso (Login). Hallazgo 2026-10-22: el
-- formulario de login (signInWithOtp con shouldCreateUser:true) estaba
-- abierto a que cualquiera mandara correos de "tu código es..." a una lista
-- larga de direcciones al azar (22 cuentas creadas sin onboarding ni
-- actividad en una semana, emails de empresas/gmail con puntos insertados).
-- Cada solicitud crea una fila en auth.users de inmediato (antes de
-- verificar el código), así que el abuso no solo ensucia la tabla de
-- usuarios: manda correos reales no pedidos y puede dañar la reputación del
-- dominio de envío (Resend) si los destinatarios los marcan como spam.
--
-- Esta tabla + función viven SOLO para service_role (la ruta de servidor
-- app/api/auth/solicitar-codigo la usa); nunca se expone a anon/authenticated.

create table if not exists public.rate_limit_otp (
  id bigint generated always as identity primary key,
  ip text not null,
  creado_at timestamptz not null default now()
);

create index if not exists idx_rate_limit_otp_ip_creado
  on public.rate_limit_otp (ip, creado_at desc);

alter table public.rate_limit_otp enable row level security;
-- Sin políticas a propósito: sin policy, RLS bloquea a anon/authenticated
-- por completo; solo service_role (que bypassa RLS) puede tocar esta tabla.

create or replace function public.solicitar_otp_permitido(
  p_ip text,
  p_limite int default 5,
  p_ventana_minutos int default 15
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conteo int;
begin
  -- Limpieza perezosa: nunca deja crecer la tabla sin control, sin depender de un cron aparte.
  delete from public.rate_limit_otp where creado_at < now() - interval '1 day';

  select count(*) into v_conteo
  from public.rate_limit_otp
  where ip = p_ip and creado_at > now() - (p_ventana_minutos || ' minutes')::interval;

  if v_conteo >= p_limite then
    return false;
  end if;

  insert into public.rate_limit_otp (ip) values (p_ip);
  return true;
end;
$$;

revoke all on function public.solicitar_otp_permitido(text, int, int) from public, anon, authenticated;
grant execute on function public.solicitar_otp_permitido(text, int, int) to service_role;
