-- El linter de seguridad de Supabase marcó que cualquiera (incluso sin
-- iniciar sesión) podía intentar llamar a la función que crea el profile al
-- registrarse (handle_new_user) directamente como endpoint, no solo cuando
-- dispara el trigger de verdad. Se le quita ese permiso público: el trigger
-- sigue funcionando igual (lo ejecuta el propio motor de Supabase Auth).

revoke execute on function public.handle_new_user() from public, anon, authenticated;
