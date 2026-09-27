// Link de la página de pago de Hotmart (producto Niki). Es público por
// diseño: lo ve cualquier comprador. Muestra los 2 planes (Anual con 3 días
// gratis y Mensual); `sck` le dice al panel desde qué botón llegó la venta.
export const HOTMART_CHECKOUT_URL = 'https://pay.hotmart.com/G107766783O';

export function urlCheckout(plan: 'anual' | 'mensual', email?: string | null): string {
  const url = new URL(HOTMART_CHECKOUT_URL);
  url.searchParams.set('sck', `paywall_${plan}`);
  // Si ya tiene cuenta, se precarga su correo para que la compra quede en ESA
  // cuenta y no cree una segunda (18: el match es por correo).
  if (email) url.searchParams.set('email', email);
  return url.toString();
}
