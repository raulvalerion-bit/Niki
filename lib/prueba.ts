// PUENTE DE LA PRUEBA GRATIS (02C "EL PUENTE DEL TRIAL"): 3 días de VIP Pro, solo en el plan
// Anual. Un momento por día: D1 primer Check (y correo si no lo hizo), D2 aviso de cobro honesto
// (correo + panel), D3 cobro → bienvenida "Ya eres VIP Pro". Lógica pura, sin base de datos.

const DIA_MS = 24 * 60 * 60 * 1000;

export const DIAS_PRUEBA = 3;
/** Lo que Hotmart cobra al terminar la prueba (plan Anual, precio desde 2026-10-04). */
export const PRECIO_ANUAL = '$59.99 USD';
/** La bienvenida "Ya eres VIP Pro" se muestra durante esta ventana tras el primer cobro. */
const DIAS_BIENVENIDA = 7;

/** "Día X de 3": se cuenta desde el inicio de la prueba (fin − 3 días), siempre entre 1 y 3. */
export function diaDePrueba(finPrueba: Date, ahora: Date): number {
  const inicio = finPrueba.getTime() - DIAS_PRUEBA * DIA_MS;
  const dia = Math.floor((ahora.getTime() - inicio) / DIA_MS) + 1;
  return Math.min(DIAS_PRUEBA, Math.max(1, dia));
}

export function muestraBienvenidaPro(primerCobro: Date | null, ahora: Date): boolean {
  if (!primerCobro) return false;
  const pasado = ahora.getTime() - primerCobro.getTime();
  return pasado >= 0 && pasado < DIAS_BIENVENIDA * DIA_MS;
}

/** El correo "aún no haces tu primer Check" sale si pasaron ≥18 h de la prueba y faltan ≥12 h
    (después de eso ya llega el aviso de fin de prueba y serían dos correos el mismo día). */
export function tocaReenganche(finPrueba: Date, ahora: Date): boolean {
  const inicio = finPrueba.getTime() - DIAS_PRUEBA * DIA_MS;
  const hora = 60 * 60 * 1000;
  return ahora.getTime() - inicio >= 18 * hora && finPrueba.getTime() - ahora.getTime() >= 12 * hora;
}
