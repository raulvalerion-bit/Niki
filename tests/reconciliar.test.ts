import { describe, expect, it } from 'vitest';
import { reconciliar, type PerfilReconciliar, type SuscripcionHotmart } from '@/lib/hotmart/reconciliar';
import { HOTMART_PRODUCT_ID } from '@/lib/hotmart/evento';

// Reconciliación semanal Hotmart ↔ Niki: diferencias en AMBAS direcciones.
const AHORA = new Date('2026-10-05T14:00:00Z');
const futuro = '2026-11-01T00:00:00Z';
const pasado = '2026-09-01T00:00:00Z';

const sus = (o: Partial<SuscripcionHotmart>): SuscripcionHotmart => ({
  codigo: 'S1', email: 'ana@x.com', nombre: 'Ana', estado: 'ACTIVE', productoId: HOTMART_PRODUCT_ID, ...o,
});
const perfil = (o: Partial<PerfilReconciliar>): PerfilReconciliar => ({
  email: 'ana@x.com', nombre: 'Ana', plan: 'mensual', plan_activo_hasta: futuro, suscripcion_estado: 'active',
  hotmart_subscriber_code: 'S1', creado_via: 'hotmart', ...o,
});

describe('reconciliación Hotmart ↔ Niki', () => {
  it('activo en ambos lados → sin diferencias', () => {
    const r = reconciliar([sus({})], [perfil({})], AHORA);
    expect(r.diferencias).toEqual([]);
    expect(r.totalHotmart).toBe(1);
    expect(r.totalConAcceso).toBe(1);
  });

  it('paga en Hotmart y no tiene cuenta → pagando_sin_acceso', () => {
    const r = reconciliar([sus({})], [], AHORA);
    expect(r.diferencias).toHaveLength(1);
    expect(r.diferencias[0].tipo).toBe('pagando_sin_acceso');
  });

  it('paga en Hotmart y su plan venció en Niki → pagando_sin_acceso', () => {
    const r = reconciliar([sus({})], [perfil({ plan_activo_hasta: pasado })], AHORA);
    expect(r.diferencias.map((d) => d.tipo)).toEqual(['pagando_sin_acceso']);
  });

  it('encuentra al comprador por correo si el código no coincide', () => {
    const r = reconciliar([sus({ codigo: 'OTRO', email: 'ANA@x.com' })], [perfil({ hotmart_subscriber_code: null, creado_via: 'manual' })], AHORA);
    expect(r.diferencias).toEqual([]);
  });

  it('canceló en Hotmart y Niki no se enteró → acceso_sin_pago', () => {
    const r = reconciliar([sus({ estado: 'CANCELLED_BY_CUSTOMER' })], [perfil({})], AHORA);
    expect(r.diferencias.map((d) => d.tipo)).toEqual(['acceso_sin_pago']);
  });

  it('canceló y Niki ya lo sabe (acceso hasta lo pagado) → sin diferencias', () => {
    const r = reconciliar([sus({ estado: 'CANCELLED_BY_CUSTOMER' })], [perfil({ plan: 'cancelado', suscripcion_estado: 'cancelled' })], AHORA);
    expect(r.diferencias).toEqual([]);
  });

  it('pago atrasado (DELAYED) está en gracia → sin diferencias', () => {
    expect(reconciliar([sus({ estado: 'DELAYED' })], [perfil({ suscripcion_estado: 'past_due' })], AHORA).diferencias).toEqual([]);
    expect(reconciliar([sus({ estado: 'DELAYED' })], [perfil({ plan_activo_hasta: pasado })], AHORA).diferencias).toEqual([]);
  });

  it('acceso con código que no existe en Hotmart → acceso_sin_pago', () => {
    const r = reconciliar([], [perfil({})], AHORA);
    expect(r.diferencias.map((d) => d.tipo)).toEqual(['acceso_sin_pago']);
  });

  it('acceso dado a mano desde el panel no es diferencia (se cuenta aparte)', () => {
    const r = reconciliar([], [perfil({ hotmart_subscriber_code: null, creado_via: 'manual' })], AHORA);
    expect(r.diferencias).toEqual([]);
    expect(r.manuales).toBe(1);
  });

  it('reembolsado sin acceso y Hotmart INACTIVE → sin diferencias', () => {
    const r = reconciliar([sus({ estado: 'INACTIVE' })], [perfil({ plan: 'ninguno', suscripcion_estado: 'refunded' })], AHORA);
    expect(r.diferencias).toEqual([]);
  });

  it('suscripciones de otro producto se ignoran', () => {
    const r = reconciliar([sus({ productoId: '123' })], [], AHORA);
    expect(r.diferencias).toEqual([]);
    expect(r.totalHotmart).toBe(0);
  });
});
