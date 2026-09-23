-- Vuelve a restringir el candado de las fotos de los Checks a "cada usuario
-- solo ve/sube las suyas" (carpeta = user_id). La versión permisiva de
-- 20260921010000 fue temporal mientras se investigaba un error de RLS que
-- resultó no reproducirse: se verificó con una simulación de auth.uid() en
-- SQL que la condición carpeta=usuario coincide exactamente con cómo
-- app/app/page.tsx arma la ruta de subida (`${user.id}/uuid.ext`).

drop policy if exists "checks_fotos_insert_autenticado" on storage.objects;
drop policy if exists "checks_fotos_select_autenticado" on storage.objects;

create policy "checks_fotos_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'checks-fotos'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "checks_fotos_select_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'checks-fotos'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );
