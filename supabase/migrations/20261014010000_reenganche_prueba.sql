-- PUENTE DE LA PRUEBA (02C): marca cuándo se mandó el correo "todavía no haces tu primer Check"
-- para no repetirlo si el cron se reintenta. Solo lo escribe el servidor (service role).
alter table public.profiles
  add column if not exists aviso_reenganche_at timestamptz;
