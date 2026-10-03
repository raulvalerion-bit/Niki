import { tieneAcceso } from '@/lib/acceso';
import { HOTMART_PRODUCT_ID } from '@/lib/hotmart/evento';

// Compara las suscripciones de Hotmart contra el acceso en Niki (18 §"RECONCILIACIÓN
// SEMANAL"). Puro, sin red ni base de datos: lo usa lib/hotmart/correr-reconciliacion.ts.
// Reporta en AMBAS direcciones; no corrige nada.

export type SuscripcionHotmart = {
  codigo: string;
  email: string | null;
  nombre: string | null;
  estado: string;
  productoId: string;
};

export type PerfilReconciliar = {
  email: string;
  nombre: string | null;
  plan: string | null;
  plan_activo_hasta: string | null;
  suscripcion_estado: string | null;
  hotmart_subscriber_code: string | null;
  creado_via: string | null;
};

export type Diferencia = {
  tipo: 'pagando_sin_acceso' | 'acceso_sin_pago';
  email: string | null;
  nombre: string | null;
  codigo: string | null;
  estado_hotmart: string | null;
  estado_niki: string | null;
  detalle: string;
};

/** Hotmart dice que esta suscripción está pagada o en prueba: debe tener acceso. */
const DEBE_TENER_ACCESO = ['ACTIVE', 'STARTED'];
/** Pago atrasado: Niki da días de gracia, así que ambos lados son válidos. */
const EN_GRACIA = ['DELAYED'];
const CANCELADAS = ['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_SELLER', 'CANCELLED_BY_ADMIN'];

/** El rol admin entra siempre; aquí importa si el PLAN da acceso. */
const accesoPorPlan = (p: PerfilReconciliar, ahora: Date) => tieneAcceso({ ...p, role: 'user' }, ahora);

export function reconciliar(suscripciones: SuscripcionHotmart[], perfiles: PerfilReconciliar[], ahora = new Date()) {
  const propias = suscripciones.filter((s) => s.productoId === HOTMART_PRODUCT_ID);
  const porCodigo = new Map(propias.map((s) => [s.codigo, s]));
  const perfilPorCodigo = new Map(perfiles.filter((p) => p.hotmart_subscriber_code).map((p) => [p.hotmart_subscriber_code!, p]));
  const perfilPorEmail = new Map(perfiles.map((p) => [p.email.toLowerCase(), p]));
  const diferencias: Diferencia[] = [];

  // 1) Paga en Hotmart → ¿puede entrar a Niki?
  for (const s of propias) {
    if (!DEBE_TENER_ACCESO.includes(s.estado)) continue;
    const p = perfilPorCodigo.get(s.codigo) ?? (s.email ? perfilPorEmail.get(s.email.toLowerCase()) : undefined);
    if (!p) {
      diferencias.push({
        tipo: 'pagando_sin_acceso',
        email: s.email,
        nombre: s.nombre,
        codigo: s.codigo,
        estado_hotmart: s.estado,
        estado_niki: null,
        detalle: 'Paga en Hotmart pero no tiene cuenta en Niki (¿se perdió el aviso de compra o compró con otro correo?).',
      });
    } else if (!accesoPorPlan(p, ahora)) {
      diferencias.push({
        tipo: 'pagando_sin_acceso',
        email: p.email,
        nombre: p.nombre ?? s.nombre,
        codigo: s.codigo,
        estado_hotmart: s.estado,
        estado_niki: p.suscripcion_estado ?? p.plan,
        detalle: 'Paga en Hotmart pero en Niki no tiene acceso. Dale el plan desde Usuarios.',
      });
    }
  }

  // 2) Entra a Niki → ¿Hotmart dice que sigue pagando?
  let totalConAcceso = 0;
  let manuales = 0;
  for (const p of perfiles) {
    if (!accesoPorPlan(p, ahora)) continue;
    totalConAcceso++;
    if (p.creado_via === 'manual' && !p.hotmart_subscriber_code) {
      manuales++; // acceso regalado a propósito por el dueño desde el panel
      continue;
    }
    const s = p.hotmart_subscriber_code ? porCodigo.get(p.hotmart_subscriber_code) : undefined;
    const base = { tipo: 'acceso_sin_pago' as const, email: p.email, nombre: p.nombre, codigo: p.hotmart_subscriber_code, estado_niki: p.suscripcion_estado ?? p.plan };
    if (!s) {
      diferencias.push({
        ...base,
        estado_hotmart: null,
        detalle: p.hotmart_subscriber_code
          ? 'Tiene acceso en Niki pero esa suscripción no aparece en Hotmart.'
          : 'Tiene acceso en Niki sin ninguna compra de Hotmart ni alta manual.',
      });
      continue;
    }
    if (DEBE_TENER_ACCESO.includes(s.estado) || EN_GRACIA.includes(s.estado)) continue;
    // Cancelada: conserva el acceso hasta la fecha ya pagada, si Niki ya lo sabe.
    if (CANCELADAS.includes(s.estado) && p.plan === 'cancelado') continue;
    diferencias.push({
      ...base,
      estado_hotmart: s.estado,
      detalle: CANCELADAS.includes(s.estado)
        ? 'Canceló en Hotmart pero en Niki sigue como suscripción activa (no llegó el aviso de cancelación).'
        : `Hotmart la marca como ${s.estado} pero en Niki sigue con acceso.`,
    });
  }

  return { diferencias, totalHotmart: propias.length, totalConAcceso, manuales };
}
