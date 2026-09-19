import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

// Cliente de servidor: lee/escribe la sesión vía cookies (Server Components,
// Route Handlers, Server Actions). Sigue usando la publishable key — la
// sesión del usuario es la que autoriza cada request contra RLS, no una
// clave con permisos elevados.
export async function crearClienteSupabaseServidor() {
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde un Server Component sin permiso de escritura — se
          // ignora porque el middleware ya refresca la sesión en ese caso.
        }
      },
    },
  });
}
