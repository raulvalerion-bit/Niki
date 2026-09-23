import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

/**
 * Verifica en el SERVIDOR (nunca confiando en el cliente) si quien hace la
 * petición está logueado Y es admin. Se usa en el layout de /admin (para
 * decidir si renderiza) y en cada ruta /api/admin/* (para autorizar la
 * acción) — ocultar el link a /admin no es seguridad, esto sí lo es
 * (09-SEGURIDAD.md, "El BFF debe AUTORIZAR, no solo esconder la clave").
 */
export async function verificarAdmin() {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, esAdmin: false as const, supabase };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return { user, esAdmin: profile?.role === 'admin', supabase };
}
