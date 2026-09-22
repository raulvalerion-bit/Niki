-- Simplifica temporalmente el candado de las fotos: solo exige estar logueado
-- (sin restringir a la carpeta propia). La versión con carpeta por usuario
-- (20260921000000) daba "row-level security policy violation" en pruebas
-- reales sin causa identificada aún — pendiente investigar antes de vender
-- (ver ESTADO.md, "Problemas conocidos"). Por ahora solo hay un usuario
-- real (el dueño del proyecto en pruebas), así que el riesgo es bajo.

drop policy if exists "checks_fotos_insert_own" on storage.objects;
drop policy if exists "checks_fotos_select_own" on storage.objects;

create policy "checks_fotos_insert_autenticado" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'checks-fotos');

create policy "checks_fotos_select_autenticado" on storage.objects
  for select to authenticated
  using (bucket_id = 'checks-fotos');
