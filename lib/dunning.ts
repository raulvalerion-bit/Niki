// DUNNING — recuperar cobros fallidos (58-RETENCION-DE-INGRESOS §Dunning).
// Cadencia de 4 correos sobre el estado past_due del webhook: días 1, 3, 5 y 7 desde que
// Hotmart avisó el atraso (PURCHASE_DELAYED). El acceso se mantiene DIAS_GRACIA_ATRASO días
// (lib/hotmart/evento.ts) y nunca se borra nada. Lógica pura: el cron hace la base de datos.

const DIA_MS = 24 * 60 * 60 * 1000;

/** Panel de comprador de Hotmart: ahí se cambia la tarjeta o se ve la ficha pendiente. */
export const URL_PAGO_HOTMART = 'https://consumer.hotmart.com';

/** Gracia de dunning: con el pago atrasado se sigue usando la app mientras Hotmart reintenta.
    Cubre la cadencia de correos (días 1/3/5/7) con un día de margen. */
export const DIAS_GRACIA_ATRASO = 8;

/** Día de la cadencia en que sale cada correo (paso 1 = día 1, paso 4 = día 7). */
export const DIAS_CADENCIA = [1, 3, 5, 7] as const;
export type PasoDunning = 1 | 2 | 3 | 4;

/**
 * Qué correo toca hoy. Devuelve el paso más alto ya alcanzado que todavía no se mandó, o null.
 * Si el cron se saltó un día, manda solo el más reciente (nunca dos correos el mismo día).
 */
export function pasoQueToca(pastDueDesde: Date, pasoEnviado: number, ahora: Date): PasoDunning | null {
  const dia = Math.floor((ahora.getTime() - pastDueDesde.getTime()) / DIA_MS) + 1;
  let alcanzado = 0;
  DIAS_CADENCIA.forEach((d, i) => {
    if (dia >= d) alcanzado = i + 1;
  });
  return alcanzado > pasoEnviado ? (alcanzado as PasoDunning) : null;
}

/** Tarjeta (se actualiza en Hotmart y Hotmart reintenta) vs. ficha en efectivo / boleto / Pix
    (cada renovación es un pago manual que hay que hacer). Sin dato → se asume tarjeta. */
export function tipoDeCobro(pagoMetodo: string | null): 'tarjeta' | 'ficha' {
  return pagoMetodo && /BILLET|BOLETO|PIX|CASH|OXXO|SPEI|TICKET|EFECTIVO/.test(pagoMetodo) ? 'ficha' : 'tarjeta';
}

/** Último día con acceso, contado desde el inicio del atraso. */
export function diaLimite(pastDueDesde: Date, diasGracia: number): Date {
  return new Date(pastDueDesde.getTime() + diasGracia * DIA_MS);
}
