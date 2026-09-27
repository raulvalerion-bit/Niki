// ¿Esta cuenta puede usar la app por dentro? Una sola regla para todo el
// código (middleware, pantallas): plan pagado o en prueba, con fecha vigente.
// La fecha la fija el webhook de Hotmart (o el alta manual del panel).

export type PerfilAcceso = {
  role: string | null;
  plan: string | null;
  plan_activo_hasta: string | null;
  suscripcion_estado: string | null;
};

const PLANES_CON_ACCESO = ['trial', 'anual', 'mensual', 'cancelado'];

export function tieneAcceso(p: PerfilAcceso | null, ahora = new Date()): boolean {
  if (!p) return false;
  if (p.role === 'admin') return true;
  if (p.suscripcion_estado === 'refunded' || p.suscripcion_estado === 'chargeback') return false;
  if (!p.plan || !PLANES_CON_ACCESO.includes(p.plan)) return false;
  // Cancelado conserva el acceso hasta el fin de lo ya pagado.
  return !!p.plan_activo_hasta && new Date(p.plan_activo_hasta) > ahora;
}
