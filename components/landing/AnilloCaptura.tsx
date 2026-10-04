'use client';

// Anillo de Puntaje VIVO sobre la captura estática del hero (/capturas/resultado.jpg).
// Replica AnilloPuntaje de la app (160px, R 66, trazo 12) escalado a la captura y lo
// posiciona exactamente sobre el anillo de la imagen: el aro se dibuja y el número
// cuenta de 0 al puntaje al entrar en vista (baseline #2 y #3 de animación).
// Geometría medida en la imagen (750px de ancho, 2x): centro (378, 512).

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';

const ESCALA = 0.64; // 240px de pantalla visible / 375px de la app
const LADO = 160;
const R = 66;
const C = 2 * Math.PI * R;
const EASE = [0.22, 1, 0.36, 1] as const;

export function AnilloCaptura({
  puntaje,
  bordeMarco,
  centroX,
  centroY,
}: {
  puntaje: number;
  /** grosor del borde del marco del teléfono (px) */
  bordeMarco: number;
  /** centro del anillo en px de la app a 1x (imagen 2x ÷ 2) */
  centroX: number;
  centroY: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.6 });
  const [mostrado, setMostrado] = useState(reduce ? puntaje : 0);
  const final = C * (1 - puntaje / 10);

  useEffect(() => {
    if (reduce || !visto) return;
    const control = animate(0, puntaje, { duration: 1.1, ease: EASE, onUpdate: setMostrado });
    return () => control.stop();
  }, [puntaje, reduce, visto]);

  const lado = LADO * ESCALA;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute overflow-hidden rounded-full"
      style={{
        width: lado,
        height: lado,
        left: bordeMarco + (centroX - LADO / 2) * ESCALA,
        top: bordeMarco + (centroY - LADO / 2) * ESCALA,
        background: 'var(--captura-fondo)',
      }}
    >
      <div className="relative origin-top-left" style={{ width: LADO, height: LADO, transform: `scale(${ESCALA})` }}>
        <svg viewBox="0 0 160 160" className="size-full -rotate-90">
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
          <motion.circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: reduce ? final : C }}
            animate={{ strokeDashoffset: reduce || visto ? final : C }}
            transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[40px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
            {mostrado.toFixed(1)}
          </span>
          <span className="mt-1 text-[12px] font-medium text-[var(--text-primary)]">de 10</span>
        </div>
      </div>
    </div>
  );
}
