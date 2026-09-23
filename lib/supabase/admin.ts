import { createClient } from '@supabase/supabase-js';
import { envServer } from '@/lib/env-server';

// Cliente ADMIN: usa la clave de servicio (bypassa RLS por completo). Se usa
// SOLO en rutas de servidor que ya verificaron `private.es_admin()` con la
// sesión real del que llama — nunca se expone a un componente de cliente ni
// se usa como atajo para saltarse esa verificación (09-SEGURIDAD.md).
export function crearClienteSupabaseAdmin() {
  return createClient(envServer.SUPABASE_URL, envServer.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
