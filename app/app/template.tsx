'use client';

// Transición entre pestañas de la app (Hoy / Historial / Hábitos / Perfil):
// fundido corto de 200 ms. Un template se vuelve a montar en cada navegación.

import { motion, useReducedMotion } from 'motion/react';

export default function Transicion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
