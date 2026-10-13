// Píxel de Meta (34 "gate del píxel"): le dice al algoritmo de anuncios quién entra, quién ve
// su resultado y quién va a pagar. Solo se carga si la persona ACEPTA cookies (47 §6) y solo en
// las páginas de venta (landing, onboarding, planes) — nunca dentro de la app ni en el panel.
// Sin coincidencia avanzada: no se le manda a Meta ningún email, nombre ni foto (47 §3B).
// La compra la registra Hotmart con su integración nativa del píxel.

export const META_PIXEL_ID = '1634146378098022';

const CLAVE = 'niki_cookies';
const VERSION = 1;
export type DecisionCookies = 'si' | 'no';

/** Rutas donde vive el píxel (y por lo tanto donde se pregunta por cookies). */
export function esRutaDeVenta(ruta: string): boolean {
  return ruta === '/' || ruta.startsWith('/onboarding') || ruta.startsWith('/paywall');
}

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[][]; loaded?: boolean; version?: string; push?: unknown };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function leerDecision(): DecisionCookies | null {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return null;
    const { d, v } = JSON.parse(crudo) as { d?: string; v?: number };
    return v === VERSION && (d === 'si' || d === 'no') ? d : null;
  } catch {
    return null;
  }
}

// Avisa a los componentes suscritos (useSyncExternalStore) cuando cambia la decisión.
const oyentes = new Set<() => void>();
export function suscribirDecision(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function guardarDecision(d: DecisionCookies): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ d, v: VERSION, en: Date.now() }));
  } catch {
    // Storage bloqueado: se vuelve a preguntar en la próxima visita.
  }
  oyentes.forEach((o) => o());
}

export function borrarDecision(): void {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Storage bloqueado: no hay decisión guardada que borrar.
  }
  oyentes.forEach((o) => o());
}

/** Carga el script oficial de Meta (equivale al snippet base) e inicia el píxel una sola vez. */
export function cargarPixel(): void {
  if (typeof window === 'undefined' || window.fbq) return;
  const cola: unknown[][] = [];
  const fbq: Fbq = (...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else cola.push(args);
  };
  fbq.queue = cola;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = fbq;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  // Sin configuración automática: Meta no lee botones ni formularios de la página por su cuenta
  // (así no puede tomar un email escrito en un campo — 47 §3B).
  fbq('set', 'autoConfig', false, META_PIXEL_ID);
  fbq('init', META_PIXEL_ID);
}

export function pixelPagina(): void {
  try {
    window.fbq?.('track', 'PageView');
  } catch {
    // La medición nunca debe romper el camino de compra.
  }
}

// Pasos del embudo → eventos que entiende Meta. Solo datos no personales.
const EVENTOS: Record<string, { tipo: 'track' | 'trackCustom'; nombre: string }> = {
  onboarding_inicio: { tipo: 'trackCustom', nombre: 'OnboardingInicio' },
  onboarding_resultado: { tipo: 'track', nombre: 'ViewContent' },
  paywall_pago_click: { tipo: 'track', nombre: 'InitiateCheckout' },
};

export function pixelEvento(paso: string, datos?: Record<string, string>): void {
  const e = EVENTOS[paso];
  if (!e) return;
  try {
    window.fbq?.(e.tipo, e.nombre, datos ?? {});
  } catch {
    // La medición nunca debe romper el camino de compra.
  }
}
