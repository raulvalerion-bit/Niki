'use client';

// Entrada suave con stagger para el panel — la misma doctrina de movimiento
// que el resto de la app (spring suave, ~220ms base, reduced-motion
// respetado) aplicada a un contexto de datos (14-LEYES-DE-DISENO,
// "la mejora más barata de estático a premium").

import { motion, useReducedMotion } from 'motion/react';

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
