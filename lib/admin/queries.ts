import type { SupabaseClient } from '@supabase/supabase-js';

// Consultas del backoffice. Todas usan el cliente de sesión del propio admin
// (RLS con private.es_admin() las autoriza) — nunca la clave de servicio,
// que se reserva para las rutas /api/admin/* que MUTAN datos sensibles
// (crear usuario, cambiar plan/rol). Cada función devuelve datos REALES o
// arreglos/objetos vacíos — la UI decide cómo mostrar "Sin datos" (nunca se
// inventa un número aquí).

export type PerfilAdmin = {
  id: string;
  email: string;
  nombre: string | null;
  plan: string;
  plan_activo_hasta: string | null;
  creado_via: string;
  source: string | null;
  role: string;
  created_at: string;
};

export async function listarUsuarios(supabase: SupabaseClient, busqueda: string): Promise<PerfilAdmin[]> {
  let query = supabase
    .from('profiles')
    .select('id, email, nombre, plan, plan_activo_hasta, creado_via, source, role, created_at')
    .order('created_at', { ascending: false });
  if (busqueda.trim()) query = query.ilike('email', `%${busqueda.trim()}%`);
  const { data } = await query;
  return data ?? [];
}

export async function contarPorPlan(supabase: SupabaseClient) {
  const { data } = await supabase.from('profiles').select('plan');
  const conteo: Record<string, number> = { ninguno: 0, trial: 0, anual: 0, mensual: 0, cancelado: 0 };
  for (const fila of data ?? []) conteo[fila.plan] = (conteo[fila.plan] ?? 0) + 1;
  const total = data?.length ?? 0;
  const activos = conteo.trial + conteo.anual + conteo.mensual;
  return { conteo, total, activos };
}

export async function contarErroresRecientes(supabase: SupabaseClient, horas = 24) {
  const desde = new Date(Date.now() - horas * 60 * 60 * 1000).toISOString();
  const { data } = await supabase.from('error_log').select('context').gte('created_at', desde);
  return data?.length ?? 0;
}

export async function listarErroresAgrupados(supabase: SupabaseClient, limite = 50) {
  const { data } = await supabase
    .from('error_log')
    .select('id, message, context, created_at')
    .order('created_at', { ascending: false })
    .limit(limite);
  const filas = data ?? [];
  const porContexto = new Map<string, number>();
  for (const f of filas) porContexto.set(f.context, (porContexto.get(f.context) ?? 0) + 1);
  const agrupado = [...porContexto.entries()].map(([context, veces]) => ({ context, veces })).sort((a, b) => b.veces - a.veces);
  return { recientes: filas.slice(0, 20), agrupado };
}

export async function metricasDeUso(supabase: SupabaseClient) {
  const { data: eventos } = await supabase
    .from('event_log')
    .select('tipo, user_id, created_at')
    .order('created_at', { ascending: false })
    .limit(2000);
  const filas = eventos ?? [];

  const usuariosConCuenta = await supabase.from('profiles').select('id', { count: 'exact', head: true });
  const totalCuentas = usuariosConCuenta.count ?? 0;

  const onboardingCompletado = new Set(filas.filter((e) => e.tipo === 'onboarding_completado').map((e) => e.user_id)).size;
  const checksCreados = filas.filter((e) => e.tipo === 'check_creado').length;
  const usuariosConCheck = new Set(filas.filter((e) => e.tipo === 'check_creado').map((e) => e.user_id)).size;

  // Serie de los últimos 7 días con Checks creados (gráfico de barras — 17-VISUALIZACION-DATOS).
  const dias: { etiqueta: string; valor: number }[] = [];
  const nombresDia = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const clave = fecha.toISOString().slice(0, 10);
    const valor = filas.filter((e) => e.tipo === 'check_creado' && e.created_at.slice(0, 10) === clave).length;
    dias.push({ etiqueta: nombresDia[fecha.getDay()], valor });
  }

  return { totalCuentas, onboardingCompletado, checksCreados, usuariosConCheck, serieChecks7d: dias };
}

export async function listarGastoAdquisicion(supabase: SupabaseClient) {
  const { data } = await supabase.from('acquisition_spend').select('*').order('period_start', { ascending: false });
  return data ?? [];
}

export async function costoIA(supabase: SupabaseClient) {
  const { data } = await supabase.from('ai_calls').select('cost_usd, feature, created_at');
  const filas = data ?? [];
  const totalUsd = filas.reduce((acc, f) => acc + (Number(f.cost_usd) || 0), 0);
  const hoy = new Date().toISOString().slice(0, 10);
  const gastoHoy = filas.filter((f) => f.created_at.slice(0, 10) === hoy).reduce((acc, f) => acc + (Number(f.cost_usd) || 0), 0);
  const porFeature = new Map<string, number>();
  for (const f of filas) porFeature.set(f.feature, (porFeature.get(f.feature) ?? 0) + (Number(f.cost_usd) || 0));
  return { totalLlamadas: filas.length, totalUsd, gastoHoy, porFeature: [...porFeature.entries()] };
}
