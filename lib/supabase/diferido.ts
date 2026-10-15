import type { SupabaseClient } from '@supabase/supabase-js';

// Cliente del navegador cargado BAJO DEMANDA: la librería de Supabase pesa
// ~80 KB comprimidos y las pantallas públicas (planes, entrar) no la necesitan
// para pintarse. Se descarga después de que la pantalla ya se ve (38-PERFORMANCE).
let promesa: Promise<SupabaseClient> | null = null;

export function clienteSupabaseDiferido(): Promise<SupabaseClient> {
  promesa ??= import('@/lib/supabase/client').then((m) => m.crearClienteSupabase());
  return promesa;
}
