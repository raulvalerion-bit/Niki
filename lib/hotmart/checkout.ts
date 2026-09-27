// Links de la página de pago de Hotmart (producto Niki). Son públicos por
// diseño: los ve cualquier comprador. `off` elige el plan en el checkout
// (sacado de Hotmart → Links de divulgación → selector de plan, 2026-09-27);
// sin él, Hotmart abre el Mensual aunque la persona haya elegido el Anual.
// `sck` le dice al panel desde qué botón llegó la venta.
export const HOTMART_CHECKOUT_URL = 'https://pay.hotmart.com/G107766783O';

const OFERTA_POR_PLAN: Record<'anual' | 'mensual', string> = {
  anual: 'foybda2j',
  mensual: 'f7q8q4tt',
};

export function urlCheckout(plan: 'anual' | 'mensual', email?: string | null): string {
  const url = new URL(HOTMART_CHECKOUT_URL);
  url.searchParams.set('off', OFERTA_POR_PLAN[plan]);
  url.searchParams.set('sck', `paywall_${plan}`);
  // Si ya tiene cuenta, se precarga su correo para que la compra quede en ESA
  // cuenta y no cree una segunda (18: el match es por correo).
  if (email) url.searchParams.set('email', email);
  return url.toString();
}
