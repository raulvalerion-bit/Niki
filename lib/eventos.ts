import type { SupabaseClient } from '@supabase/supabase-js';

// Wrapper único para escribir en `event_log` (21-BACKOFFICE + 36-ANALITICA:
// la fuente de verdad server-side de activación/retención). Sin PostHog en
// esta pasada (decisión de alcance — ver ESTADO.md): esta tabla basta para
// que el backoffice deje de mostrar "Sin datos" en la sección Uso.
// Nombres en snake_case, objeto_accion, tal como manda 36-ANALITICA-Y-EVENTOS.
export async function registrarEvento(
  supabase: SupabaseClient,
  tipo: string,
  userId: string,
  metadata: Record<string, unknown> = {}
) {
  try {
    await supabase.from('event_log').insert({ tipo, user_id: userId, metadata });
  } catch {
    // Un evento perdido no debe romper la acción real del usuario.
  }
}

/** `sesion_iniciada`, una vez por día activo (clave para D1/D7/D30 — 36). */
export async function registrarSesionDiaria(supabase: SupabaseClient, userId: string) {
  const hoy = new Date().toISOString().slice(0, 10);
  let yaHoy = false;
  try {
    yaHoy = localStorage.getItem('niki_sesion_iniciada_fecha') === hoy;
  } catch {
    /* localStorage no disponible (SSR/privado) — se registra igual, puede duplicar 1 día */
  }
  if (yaHoy) return;
  await registrarEvento(supabase, 'sesion_iniciada', userId);
  try {
    localStorage.setItem('niki_sesion_iniciada_fecha', hoy);
  } catch {
    /* no crítico */
  }
}
