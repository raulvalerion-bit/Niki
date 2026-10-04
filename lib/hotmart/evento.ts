import { z } from 'zod';

// Traduce un evento del webhook de Hotmart (versión 2.0.0) a una DECISIÓN:
// qué estado de suscripción aplica, hasta cuándo hay acceso, qué va al ledger.
// Sin efectos: el route handler hace la parte de base de datos.
// Mapa de estados y reglas: docs/sistema/18-VENTA-HOTMART.md §"Máquina de estados".

/** Producto Niki en Hotmart (app.hotmart.com/products/manage/8595742). Es la
    allowlist del catálogo: un evento de otro producto nunca da acceso. */
export const HOTMART_PRODUCT_ID = '8595742';

const DIA_MS = 24 * 60 * 60 * 1000;
const DIAS_PRUEBA = 3;
/** Margen tras la fecha de cobro para que un aviso de Hotmart que llega tarde
    no le corte el acceso a alguien que sí pagó. */
const DIAS_GRACIA_COBRO = 3;
/** Gracia de dunning: pago atrasado → sigue usando la app mientras reintenta. */
const DIAS_GRACIA_ATRASO = 5;
/** Anti-replay: un evento con fecha de hace más de esto no se aplica. Holgado a
    propósito — Hotmart reintenta durante días y el dedupe ya frena el doble uso. */
const MAX_ANTIGUEDAD_MS = 30 * DIA_MS;

const Precio = z.object({ value: z.number().optional(), currency_value: z.string().optional() }).partial();
const Plan = z.object({ id: z.union([z.number(), z.string()]).optional(), name: z.string().optional() }).partial();

const Payload = z.object({
  id: z.string().optional(),
  event: z.string(),
  version: z.string().optional(),
  creation_date: z.number().optional(),
  hottok: z.string().optional(),
  data: z
    .object({
      product: z.object({ id: z.union([z.number(), z.string()]).optional() }).partial().optional(),
      buyer: z.object({ email: z.string().optional(), name: z.string().optional() }).partial().optional(),
      purchase: z
        .object({
          transaction: z.string().optional(),
          status: z.string().optional(),
          approved_date: z.number().optional(),
          date_next_charge: z.number().optional(),
          recurrence_number: z.number().optional(),
          price: Precio.optional(),
          original_offer_price: Precio.optional(),
          offer: z.object({ code: z.string().optional() }).partial().optional(),
          payment: z.object({ type: z.string().optional() }).partial().optional(),
          origin: z.object({ sck: z.string().optional(), src: z.string().optional() }).partial().optional(),
        })
        .partial()
        .optional(),
      subscription: z
        .object({
          status: z.string().optional(),
          subscriber_code: z.string().optional(),
          plan: Plan.optional(),
          subscriber: z.object({ code: z.string().optional() }).partial().optional(),
          product: z.object({ id: z.union([z.number(), z.string()]).optional() }).partial().optional(),
          user: z.object({ email: z.string().optional() }).partial().optional(),
        })
        .partial()
        .optional(),
      // SUBSCRIPTION_CANCELLATION trae el suscriptor aquí, no dentro de subscription.
      subscriber: z.object({ code: z.string().optional(), email: z.string().optional(), name: z.string().optional() }).partial().optional(),
      date_next_charge: z.number().optional(),
      cancellation_date: z.number().optional(),
      // SWITCH_PLAN: lista de planes, el nuevo viene con current = true.
      plans: z.array(z.object({ name: z.string().optional(), current: z.boolean().optional() }).partial()).optional(),
    })
    .partial()
    .optional(),
});

export type PayloadHotmart = z.infer<typeof Payload>;

export type EstadoSuscripcion = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded' | 'chargeback';
export type PlanNiki = 'anual' | 'mensual';

export type Decision =
  | { tipo: 'ignorar'; motivo: string }
  | {
      tipo: 'aplicar';
      eventId: string;
      evento: string;
      email: string | null;
      nombre: string;
      subscriberCode: string | null;
      transaction: string | null;
      sck: string | null;
      /** null = no cambia el estado (compra completa, cambio de plan). */
      nuevoEstado: EstadoSuscripcion | null;
      plan: PlanNiki | null;
      hasta: Date | null;
      trialHasta: Date | null;
      /** Solo prueba/compra abren una cuenta nueva; lo demás actúa sobre una existente. */
      creaCuenta: boolean;
      ledger: { kind: 'sale' | 'refund' | 'chargeback'; amountMinor: number; currency: string } | null;
      productId: string;
      ocurrio: Date | null;
    };

export function parsearPayload(raw: unknown): PayloadHotmart | null {
  const r = Payload.safeParse(raw);
  return r.success ? r.data : null;
}

function planDesdeNombre(nombre?: string): PlanNiki | null {
  if (!nombre) return null;
  if (/anual|annual|year/i.test(nombre)) return 'anual';
  if (/mensual|monthly|month/i.test(nombre)) return 'mensual';
  return null;
}

/** Hotmart manda fechas en milisegundos casi siempre, pero SUBSCRIPTION_CANCELLATION
    trajo date_next_charge en SEGUNDOS (compra real 2026-09-29 → quedó "1970").
    Todo valor menor a 10^12 se toma como segundos. */
function fecha(valor?: number): Date | null {
  if (typeof valor !== 'number' || valor <= 0) return null;
  return new Date(valor < 1e12 ? valor * 1000 : valor);
}

/** Resumen SIN datos personales (ni correo, ni nombre, ni teléfono) para el
    registro del panel — sirve para comprobar la forma real de cada evento. */
export function resumenSinDatosPersonales(p: PayloadHotmart) {
  const d = p.data;
  return {
    event: p.event,
    version: p.version ?? null,
    product_id: d?.product?.id ?? d?.subscription?.product?.id ?? null,
    purchase: d?.purchase
      ? {
          status: d.purchase.status ?? null,
          price: d.purchase.price ?? null,
          original_offer_price: d.purchase.original_offer_price ?? null,
          recurrence_number: d.purchase.recurrence_number ?? null,
          tiene_date_next_charge: typeof d.purchase.date_next_charge === 'number',
          payment_type: d.purchase.payment?.type ?? null,
          offer_code: d.purchase.offer?.code ?? null,
        }
      : null,
    subscription: d?.subscription ? { status: d.subscription.status ?? null, plan: d.subscription.plan?.name ?? null } : null,
    plans: d?.plans?.map((x) => ({ name: x.name ?? null, current: x.current ?? null })) ?? null,
  };
}

export function decidir(p: PayloadHotmart, ahora = new Date()): Decision {
  const d = p.data ?? {};
  const productId = String(d.product?.id ?? d.subscription?.product?.id ?? '');
  if (productId !== HOTMART_PRODUCT_ID) return { tipo: 'ignorar', motivo: 'producto_ajeno' };

  const creado = fecha(p.creation_date);
  if (creado) {
    const edad = ahora.getTime() - creado.getTime();
    if (edad > MAX_ANTIGUEDAD_MS) return { tipo: 'ignorar', motivo: 'evento_viejo' };
    if (edad < -60 * 60 * 1000) return { tipo: 'ignorar', motivo: 'fecha_futura' };
  }

  const compra = d.purchase ?? {};
  const email = (d.buyer?.email ?? d.subscriber?.email ?? d.subscription?.user?.email ?? '').trim().toLowerCase() || null;
  const nombre = (d.buyer?.name ?? d.subscriber?.name ?? '').trim().slice(0, 120);
  const subscriberCode = d.subscription?.subscriber?.code ?? d.subscriber?.code ?? d.subscription?.subscriber_code ?? null;
  const transaction = compra.transaction ?? null;
  const sck = compra.origin?.sck?.slice(0, 120) ?? null;

  const precio = compra.price?.value;
  const moneda = (compra.price?.currency_value ?? '').toUpperCase();
  const precioOferta = compra.original_offer_price;
  const plan =
    planDesdeNombre(d.subscription?.plan?.name) ??
    (precioOferta?.currency_value === 'USD' && typeof precioOferta.value === 'number'
      ? // Mensual $14.99; Anual $59.99 (desde 2026-10-04) o $107.88 (antes): de $30 para arriba es anual.
        precioOferta.value >= 30
        ? 'anual'
        : precioOferta.value > 0
          ? 'mensual'
          : null
      : null);

  // Catálogo: el importe en dólares de la oferta no puede superar el plan más caro.
  if (precioOferta?.currency_value === 'USD' && typeof precioOferta.value === 'number' && precioOferta.value > 110) {
    return { tipo: 'ignorar', motivo: 'importe_fuera_de_catalogo' };
  }

  const eventId =
    p.id ?? `${p.event}:${transaction ?? subscriberCode ?? email ?? 'sin-id'}:${p.creation_date ?? ''}`;

  const base = {
    tipo: 'aplicar' as const,
    eventId,
    evento: p.event,
    email,
    nombre,
    subscriberCode,
    transaction,
    sck,
    plan,
    productId,
    ocurrio: fecha(compra.approved_date) ?? creado,
  };
  const proximoCobro = fecha(compra.date_next_charge ?? d.date_next_charge);
  const mas = (desde: Date, dias: number) => new Date(desde.getTime() + dias * DIA_MS);
  const ledgerDe = (kind: 'sale' | 'refund' | 'chargeback') =>
    typeof precio === 'number' && precio > 0 && /^[A-Z]{3}$/.test(moneda)
      ? { kind, amountMinor: Math.round(precio * 100), currency: moneda }
      : null;

  switch (p.event) {
    case 'PURCHASE_APPROVED': {
      if (!email) return { tipo: 'ignorar', motivo: 'sin_correo' };
      // Prueba gratis: Hotmart aprueba la suscripción con importe 0. Se trata
      // como 'trialing' (acceso completo) y NO como cobro, para que la métrica
      // prueba→pago no quede rota. Verificar con el primer evento real (18).
      const esPrueba = precio === 0 || compra.status === 'STARTED';
      if (esPrueba) {
        const finPrueba = proximoCobro ?? mas(ahora, DIAS_PRUEBA);
        return {
          ...base,
          nuevoEstado: 'trialing',
          hasta: mas(finPrueba, 1),
          trialHasta: finPrueba,
          creaCuenta: true,
          ledger: null,
        };
      }
      const periodo = plan === 'anual' ? 366 : 31;
      return {
        ...base,
        nuevoEstado: 'active',
        hasta: mas(proximoCobro ?? mas(ahora, periodo), DIAS_GRACIA_COBRO),
        trialHasta: null,
        creaCuenta: true,
        ledger: ledgerDe('sale'),
      };
    }
    case 'PURCHASE_COMPLETE':
      // Pasó el plazo de garantía: no cambia el acceso; solo asegura el ingreso
      // en el ledger (mismo transaction_id que APPROVED → no se cuenta dos veces).
      return { ...base, nuevoEstado: null, plan: null, hasta: null, trialHasta: null, creaCuenta: false, ledger: ledgerDe('sale') };
    case 'PURCHASE_DELAYED':
      return {
        ...base,
        nuevoEstado: 'past_due',
        hasta: mas(ahora, DIAS_GRACIA_ATRASO),
        trialHasta: null,
        creaCuenta: false,
        ledger: null,
      };
    case 'SUBSCRIPTION_CANCELLATION':
      return {
        ...base,
        nuevoEstado: 'cancelled',
        // Una fecha ya pasada nunca recorta el acceso pagado: null = se conserva la que había.
        hasta: proximoCobro && proximoCobro > ahora ? proximoCobro : null,
        trialHasta: null,
        creaCuenta: false,
        ledger: null,
      };
    case 'PURCHASE_EXPIRED':
      return { ...base, nuevoEstado: 'expired', hasta: null, trialHasta: null, creaCuenta: false, ledger: null };
    case 'PURCHASE_REFUNDED':
      return { ...base, nuevoEstado: 'refunded', hasta: null, trialHasta: null, creaCuenta: false, ledger: ledgerDe('refund') };
    case 'PURCHASE_CHARGEBACK':
      return { ...base, nuevoEstado: 'chargeback', hasta: null, trialHasta: null, creaCuenta: false, ledger: ledgerDe('chargeback') };
    case 'SWITCH_PLAN': {
      const nuevo = planDesdeNombre(d.plans?.find((x) => x.current)?.name);
      if (!nuevo) return { tipo: 'ignorar', motivo: 'cambio_de_plan_sin_plan' };
      return { ...base, nuevoEstado: null, plan: nuevo, hasta: null, trialHasta: null, creaCuenta: false, ledger: null };
    }
    default:
      // Boleto impreso, compra cancelada antes de pagar, disputa abierta, carrito
      // abandonado…: se registran en el panel pero no cambian el acceso.
      return { tipo: 'ignorar', motivo: 'evento_sin_efecto' };
  }
}
