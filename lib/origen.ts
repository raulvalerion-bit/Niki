// De qué red llegó la persona (34 "MEDIR ANTES DE GASTAR"): cada red usa su link en la
// biografía, p. ej. holaniki.com/?src=tiktok. Se guarda la última red de entrada (30 días) y
// viaja al checkout de Hotmart dentro de `sck`, así cada venta dice de dónde vino.

const CLAVE = 'niki_src';
const VIGENCIA_MS = 30 * 24 * 60 * 60 * 1000;
const VALIDO = /^[a-z0-9_]{1,30}$/;

export function guardarOrigen(busqueda: string): void {
  const p = new URLSearchParams(busqueda);
  const src = (p.get('src') ?? p.get('utm_source') ?? '').toLowerCase().trim();
  if (!VALIDO.test(src)) return;
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ src, en: Date.now() }));
  } catch {
    // Storage bloqueado: la venta se registra sin canal.
  }
}

export function leerOrigen(): string | null {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return null;
    const { src, en } = JSON.parse(crudo) as { src?: string; en?: number };
    if (!src || !VALIDO.test(src) || typeof en !== 'number' || Date.now() - en > VIGENCIA_MS) return null;
    return src;
  } catch {
    return null;
  }
}
