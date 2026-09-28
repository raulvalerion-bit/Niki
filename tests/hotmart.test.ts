import { describe, expect, it } from 'vitest';
import { decidir, parsearPayload, HOTMART_PRODUCT_ID } from '@/lib/hotmart/evento';

// Reglas de dinero del webhook de Hotmart (18 + 61 Gate 2). Si una de estas
// pruebas falla, alguien podría obtener acceso sin pagar o perderlo pagando.

const AHORA = new Date('2026-09-28T12:00:00Z');
const DIA = 24 * 60 * 60 * 1000;

function evento(tipo: string, compra: Record<string, unknown> = {}) {
  return parsearPayload({
    id: `ev-${tipo}`,
    event: tipo,
    creation_date: AHORA.getTime() - 60_000,
    data: {
      product: { id: Number(HOTMART_PRODUCT_ID) },
      buyer: { email: 'Cliente@Correo.com', name: 'Cliente' },
      purchase: { transaction: 'HP123', ...compra },
    },
  })!;
}

describe('webhook de Hotmart → decisión', () => {
  it('prueba gratis (importe 0) da acceso trialing sin registrar ingreso', () => {
    const proximo = AHORA.getTime() + 3 * DIA;
    const d = decidir(
      evento('PURCHASE_APPROVED', {
        price: { value: 0, currency_value: 'MXN' },
        original_offer_price: { value: 0, currency_value: 'USD' },
        date_next_charge: proximo,
      }),
      AHORA
    );
    if (d.tipo !== 'aplicar') throw new Error('debía aplicarse');
    expect(d.nuevoEstado).toBe('trialing');
    expect(d.ledger).toBeNull();
    expect(d.trialHasta?.getTime()).toBe(proximo);
    expect(d.email).toBe('cliente@correo.com');
  });

  it('compra pagada anual activa el plan y registra el ingreso en centavos', () => {
    const d = decidir(
      evento('PURCHASE_APPROVED', {
        price: { value: 2336.24, currency_value: 'MXN' },
        original_offer_price: { value: 107.88, currency_value: 'USD' },
      }),
      AHORA
    );
    if (d.tipo !== 'aplicar') throw new Error('debía aplicarse');
    expect(d.nuevoEstado).toBe('active');
    expect(d.plan).toBe('anual');
    expect(d.ledger).toEqual({ kind: 'sale', amountMinor: 233624, currency: 'MXN' });
  });

  it('compra completa no cambia el acceso (mismo transaction_id que la aprobada)', () => {
    const d = decidir(evento('PURCHASE_COMPLETE', { price: { value: 14.99, currency_value: 'USD' } }), AHORA);
    if (d.tipo !== 'aplicar') throw new Error('debía aplicarse');
    expect(d.nuevoEstado).toBeNull();
    expect(d.transaction).toBe('HP123');
  });

  it('producto ajeno se ignora', () => {
    const p = evento('PURCHASE_APPROVED', { price: { value: 10, currency_value: 'USD' } });
    p.data!.product = { id: 1 };
    expect(decidir(p, AHORA)).toEqual({ tipo: 'ignorar', motivo: 'producto_ajeno' });
  });

  it('importe fuera del catálogo se ignora', () => {
    const d = decidir(
      evento('PURCHASE_APPROVED', {
        price: { value: 500, currency_value: 'USD' },
        original_offer_price: { value: 500, currency_value: 'USD' },
      }),
      AHORA
    );
    expect(d).toEqual({ tipo: 'ignorar', motivo: 'importe_fuera_de_catalogo' });
  });

  it('un aviso de hace más de 30 días se ignora (no reactiva nada)', () => {
    const p = evento('PURCHASE_APPROVED', { price: { value: 14.99, currency_value: 'USD' } });
    p.creation_date = AHORA.getTime() - 40 * DIA;
    expect(decidir(p, AHORA)).toEqual({ tipo: 'ignorar', motivo: 'evento_viejo' });
  });

  it('pago atrasado pasa a past_due con gracia (no quita el acceso de golpe)', () => {
    const d = decidir(evento('PURCHASE_DELAYED'), AHORA);
    if (d.tipo !== 'aplicar') throw new Error('debía aplicarse');
    expect(d.nuevoEstado).toBe('past_due');
    expect(d.hasta!.getTime()).toBeGreaterThan(AHORA.getTime());
  });

  it('cancelación conserva el acceso hasta el próximo cobro', () => {
    const proximo = AHORA.getTime() + 2 * DIA;
    const d = decidir(evento('SUBSCRIPTION_CANCELLATION', { date_next_charge: proximo }), AHORA);
    if (d.tipo !== 'aplicar') throw new Error('debía aplicarse');
    expect(d.nuevoEstado).toBe('cancelled');
    expect(d.hasta?.getTime()).toBe(proximo);
  });

  it('reembolso y contracargo quitan el acceso y quedan en el registro de dinero', () => {
    const casos: [string, string][] = [
      ['PURCHASE_REFUNDED', 'refunded'],
      ['PURCHASE_CHARGEBACK', 'chargeback'],
    ];
    for (const [tipo, estado] of casos) {
      const d = decidir(evento(tipo, { price: { value: 14.99, currency_value: 'USD' } }), AHORA);
      if (d.tipo !== 'aplicar') throw new Error('debía aplicarse');
      expect(d.nuevoEstado).toBe(estado);
      expect(d.hasta).toBeNull();
      expect(d.creaCuenta).toBe(false);
      expect(d.ledger?.amountMinor).toBe(1499);
    }
  });

  it('solo prueba o compra pueden crear una cuenta nueva', () => {
    for (const tipo of ['PURCHASE_DELAYED', 'SUBSCRIPTION_CANCELLATION', 'PURCHASE_REFUNDED', 'PURCHASE_EXPIRED']) {
      const d = decidir(evento(tipo), AHORA);
      if (d.tipo === 'aplicar') expect(d.creaCuenta).toBe(false);
    }
  });
});
