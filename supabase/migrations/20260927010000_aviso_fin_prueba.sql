-- Aviso "tu prueba termina mañana" (18-VENTA-HOTMART.md: recordatorio antes del
-- cobro). El cron diario /api/cron/aviso-prueba manda el correo una sola vez y
-- marca aquí cuándo; el índice parcial deja la búsqueda diaria barata.
alter table public.profiles add column aviso_fin_prueba_at timestamptz;
create index profiles_trial_pendiente_idx on public.profiles(trial_ends_at)
  where suscripcion_estado = 'trialing' and aviso_fin_prueba_at is null;
