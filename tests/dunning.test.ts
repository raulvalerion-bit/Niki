import { describe, expect, it } from 'vitest';
import { DIAS_GRACIA_ATRASO, diaLimite, pasoQueToca, tipoDeCobro } from '@/lib/dunning';
import { correoDunning } from '@/lib/email/dunning';
import { decidir, parsearPayload, HOTMART_PRODUCT_ID } from '@/lib/hotmart/evento';

// Cobros fallidos (58): si una de estas pruebas falla, un cliente que sí quería pagar podría
// recibir correos repetidos, a destiempo, o perder el acceso antes del último aviso.

const DIA = 24 * 60 * 60 * 1000;
const DESDE = new Date('2026-10-14T10:00:00Z');
const en = (dias: number, horas = 0) => new Date(DESDE.getTime() + dias * DIA + horas * 60 * 60 * 1000);

describe('cadencia de correos de cobro fallido', () => {
  it('el día 1 toca el primer correo y no se repite', () => {
    expect(pasoQueToca(DESDE, 0, en(0, 7))).toBe(1);
    expect(pasoQueToca(DESDE, 1, en(0, 20))).toBeNull();
  });

  it('días 3, 5 y 7 tocan los correos 2, 3 y 4', () => {
    expect(pasoQueToca(DESDE, 1, en(2, 1))).toBe(2);
    expect(pasoQueToca(DESDE, 2, en(4, 1))).toBe(3);
    expect(pasoQueToca(DESDE, 3, en(6, 1))).toBe(4);
    expect(pasoQueToca(DESDE, 4, en(9))).toBeNull();
  });

  it('si el envío diario se saltó días, manda solo el correo más reciente', () => {
    expect(pasoQueToca(DESDE, 1, en(6, 2))).toBe(4);
  });

  it('el acceso dura más que el último aviso (no se corta antes del día 7)', () => {
    expect(DIAS_GRACIA_ATRASO).toBeGreaterThan(7);
    expect(diaLimite(DESDE, DIAS_GRACIA_ATRASO).getTime()).toBeGreaterThan(en(7).getTime());
  });

  it('separa tarjeta de ficha en efectivo', () => {
    expect(tipoDeCobro('CREDIT_CARD')).toBe('tarjeta');
    expect(tipoDeCobro(null)).toBe('tarjeta');
    expect(tipoDeCobro('BILLET')).toBe('ficha');
    expect(tipoDeCobro('PIX')).toBe('ficha');
    expect(tipoDeCobro('CASH_PAYMENT')).toBe('ficha');
  });
});

describe('correos de cobro fallido', () => {
  it('cada correo lleva el enlace de Hotmart y la fecha límite real', () => {
    for (const paso of [1, 2, 3, 4] as const) {
      const c = correoDunning({ paso, tipo: 'tarjeta', nombre: 'Mateo Pérez', limite: en(8) });
      expect(c.html).toContain('https://consumer.hotmart.com');
      expect(c.texto).toContain('https://consumer.hotmart.com');
      expect(c.texto).toContain('22 de octubre');
      expect(c.html).toContain('Hola, Mateo');
    }
  });

  it('la versión de ficha habla de pagar la ficha, no de cambiar la tarjeta', () => {
    const c = correoDunning({ paso: 1, tipo: 'ficha', nombre: null, limite: en(8) });
    expect(c.html).toContain('Ver mi ficha de pago');
    expect(c.html).not.toContain('Actualizar mi método de pago');
  });

  it('escapa el nombre (nada de HTML ajeno en el correo)', () => {
    const c = correoDunning({ paso: 1, tipo: 'tarjeta', nombre: '<script>x</script>', limite: en(8) });
    expect(c.html).not.toContain('<script>');
  });
});

describe('webhook → método de pago', () => {
  it('el pago atrasado guarda con qué paga y da 8 días de gracia', () => {
    const ahora = new Date('2026-10-14T12:00:00Z');
    const p = parsearPayload({
      id: 'ev-delayed',
      event: 'PURCHASE_DELAYED',
      creation_date: ahora.getTime() - 60_000,
      data: {
        product: { id: Number(HOTMART_PRODUCT_ID) },
        buyer: { email: 'cliente@correo.com' },
        purchase: { transaction: 'HP1', payment: { type: 'credit_card' } },
      },
    })!;
    const d = decidir(p, ahora);
    if (d.tipo !== 'aplicar') throw new Error('debía aplicarse');
    expect(d.pagoMetodo).toBe('CREDIT_CARD');
    expect(d.hasta!.getTime() - ahora.getTime()).toBe(DIAS_GRACIA_ATRASO * DIA);
  });
});
