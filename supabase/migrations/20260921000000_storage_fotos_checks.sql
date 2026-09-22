-- Bucket privado para las fotos de los Checks de Presencia. Privado (no
-- público): son fotos de cuerpo entero de personas, cada usuario solo puede
-- subir/ver las suyas (carpeta = su user_id).

insert into storage.buckets (id, name, public)
values ('checks-fotos', 'checks-fotos', false)
on conflict (id) do nothing;

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
