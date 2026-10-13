'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Cookie } from 'lucide-react';
import { cargarPixel, esRutaDeVenta, guardarDecision, leerDecision, pixelPagina, suscribirDecision, type DecisionCookies } from '@/lib/pixel';

/**
 * Aviso de cookies (47 §6) + carga del píxel de Meta solo tras "Aceptar".
 * Aceptar y Rechazar tienen el mismo tamaño y peso visual: rechazar cuesta lo mismo que aceptar.
 * Solo aparece en las páginas de venta, que es donde vive el píxel.
 */
export function AvisoCookies() {
  const ruta = usePathname();
  const reducir = useReducedMotion();
  // En el servidor no hay navegador: 'pendiente' evita que el aviso parpadee antes de leerlo.
  const decision = useSyncExternalStore(suscribirDecision, leerDecision, () => 'pendiente' as const);

  // Una vista de página por cada pantalla de venta visitada, solo con permiso.
  useEffect(() => {
    if (decision !== 'si' || !esRutaDeVenta(ruta)) return;
    cargarPixel();
    pixelPagina();
  }, [decision, ruta]);

  const elegir = (d: DecisionCookies) => guardarDecision(d);

  const visible = decision === null && esRutaDeVenta(ruta);

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          role="region"
          aria-label="Aviso de cookies"
          initial={reducir ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducir ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-120 px-4 pb-[max(16px,env(safe-area-inset-bottom))] [font-family:var(--font-body)]"
        >
          <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[var(--chip-bg)] text-[var(--accent)]">
                <Cookie size={20} aria-hidden="true" />
              </span>
              <p className="min-w-0 text-sm leading-snug text-[var(--text-secondary)]">
                Usamos cookies de Meta para saber qué publicación te trajo y mostrarle Niki a más gente
                como tú. Nunca tus fotos ni tus datos de cuenta.{' '}
                <Link href="/privacidad" className="font-semibold text-[var(--accent)] underline underline-offset-2">
                  Más detalles
                </Link>
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(['no', 'si'] as const).map((d) => (
                <motion.button
                  key={d}
                  type="button"
                  whileTap={reducir ? undefined : { scale: 0.97 }}
                  onClick={() => elegir(d)}
                  className="h-12 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[16px] font-semibold text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--chip-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] [touch-action:manipulation]"
                >
                  {d === 'si' ? 'Aceptar' : 'Rechazar'}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
