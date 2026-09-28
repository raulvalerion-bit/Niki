import { describe, expect, it } from 'vitest';
import { tieneAcceso } from '@/lib/acceso';

// Quién entra a la app por dentro (el middleware usa esta misma regla).
const AHORA = new Date('2026-09-28T12:00:00Z');
const futuro = '2026-10-10T00:00:00Z';
const pasado = '2026-09-01T00:00:00Z';
const base = { role: 'user', plan: 'anual', plan_activo_hasta: futuro, suscripcion_estado: 'active' };

describe('acceso a la app (gating en servidor)', () => {
  it('plan vigente entra', () => expect(tieneAcceso(base, AHORA)).toBe(true));
  it('plan vencido no entra', () => expect(tieneAcceso({ ...base, plan_activo_hasta: pasado }, AHORA)).toBe(false));
  it('sin plan no entra', () => expect(tieneAcceso({ ...base, plan: 'ninguno' }, AHORA)).toBe(false));
  it('sin perfil no entra', () => expect(tieneAcceso(null, AHORA)).toBe(false));
  it('reembolso o contracargo no entran aunque la fecha siga vigente', () => {
    expect(tieneAcceso({ ...base, suscripcion_estado: 'refunded' }, AHORA)).toBe(false);
    expect(tieneAcceso({ ...base, suscripcion_estado: 'chargeback' }, AHORA)).toBe(false);
  });
  it('cancelado conserva el acceso hasta la fecha pagada', () => {
    expect(tieneAcceso({ ...base, plan: 'cancelado', suscripcion_estado: 'cancelled' }, AHORA)).toBe(true);
  });
  it('admin siempre entra', () => expect(tieneAcceso({ ...base, role: 'admin', plan: 'ninguno' }, AHORA)).toBe(true));
});
