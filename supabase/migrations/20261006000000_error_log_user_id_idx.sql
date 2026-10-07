-- Índice de la llave foránea de error_log (advisor de Supabase: FK sin índice). Aplicada 2026-10-06.
create index if not exists error_log_user_id_idx on public.error_log (user_id);
