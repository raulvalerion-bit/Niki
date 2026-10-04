import { describe, expect, it } from 'vitest';
import { urlCheckout } from '@/lib/hotmart/checkout';

describe('link de pago de Hotmart', () => {
  it('lleva la red de origen dentro de sck para medir ventas por red', () => {
    const u = new URL(urlCheckout('anual', null, 'tiktok'));
    expect(u.searchParams.get('sck')).toBe('tiktok_paywall_anual');
    expect(u.searchParams.get('off')).toBe('foybda2j');
  });
  it('sin red de origen queda como antes', () => {
    const u = new URL(urlCheckout('mensual', 'a@b.com'));
    expect(u.searchParams.get('sck')).toBe('paywall_mensual');
    expect(u.searchParams.get('email')).toBe('a@b.com');
  });
});
