-- Desmarcar el hábito de hoy: antes la app lo borraba pero no había política
-- de DELETE, así que el registro seguía en la base (bug silencioso).
create policy "habito_registros_delete_own" on public.habito_registros
  for delete using ((select auth.uid()) = user_id);
