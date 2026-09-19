import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

// Cliente del navegador: usa la publishable key (pública por diseño, protegida
// por RLS — ver docs/sistema/51-STACK-PINEADO.md §5). Nunca pasar la secret key aquí.
export function crearClienteSupabase() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
