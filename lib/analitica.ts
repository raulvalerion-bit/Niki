// Embudo de venta anónimo (36-ANALITICA): visitas por página las cuenta Vercel Web
// Analytics solo (sin cookies); estos son los pasos que una visita no muestra.
// Si Analytics está apagado en Vercel, la cola queda en memoria y no pasa nada.
// Cada paso también va al píxel de Meta, solo si la persona aceptó cookies (lib/pixel.ts).

import { pixelEvento } from '@/lib/pixel';

type EventoEmbudo = 'onboarding_inicio' | 'onboarding_resultado' | 'paywall_pago_click';

declare global {
  interface Window {
    va?: (accion: 'event', datos: { name: string; data?: Record<string, string> }) => void;
  }
}

export function eventoEmbudo(nombre: EventoEmbudo, datos?: Record<string, string>) {
  try {
    window.va?.('event', { name: nombre, data: datos });
  } catch {
    // La medición nunca debe romper el camino de compra.
  }
  pixelEvento(nombre, datos);
}
