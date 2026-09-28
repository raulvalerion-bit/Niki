'use client';

// RESULTADO DEL CHECK DE PRESENCIA — el mecanismo de Niki (FICHA-ARTE:
// anillo de progreso central + 3 ejes con escala de intensidad
// suave→medio→fuerte + frase de cierre). Lo usan la pantalla Hoy (recién
// analizado) y el detalle del historial.
//
// spec:
//   objeto_principal: anillo con el Puntaje de Presencia (conteo 0→puntaje)
//   niveles: display 40 (puntaje) · title 20-22 · body 14 · label 12
//   acento_en: anillo, bordes finos de ejes, CTA
//   baseline: stagger de entrada, conteo héroe, anillo se dibuja, tap, celebración (+1 gema)

import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ArrowUp, Check, Quote, ShoppingBag, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { puntajeDe, type ResultadoCheck as Resultado } from '@/lib/ia/resultado';

const OCASION_LABEL: Record<string, string> = {
  entrevista: 'tu entrevista',
  cita: 'tu cita',
  negocios: 'tu reunión',
  amigos: 'salir con amigos',
  cena: 'tu cena formal',
  vacaciones: 'tus vacaciones',
};

const EJES: { clave: 'outfit' | 'postura' | 'actitud'; titulo: string; icono: LucideIcon; nivel: 'suave' | 'medio' | 'fuerte' }[] = [
  { clave: 'outfit', titulo: 'Outfit', icono: ShoppingBag, nivel: 'suave' },
  { clave: 'postura', titulo: 'Postura', icono: ArrowUp, nivel: 'medio' },
  { clave: 'actitud', titulo: 'Actitud', icono: Check, nivel: 'fuerte' },
];

const ESTILO_NIVEL = {
  suave: {
    caja: 'bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] border',
    chip: 'bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]',
    nota: 'text-[var(--text-secondary)]',
    titulo: 'text-[var(--text-primary)]',
  },
  medio: {
    caja: 'bg-[color-mix(in_oklab,var(--surface)_92%,var(--accent)_8%)] border',
    chip: 'bg-[color-mix(in_oklab,var(--accent)_20%,transparent)]',
    nota: 'text-[var(--accent)]',
    titulo: 'text-[var(--text-primary)]',
  },
  fuerte: {
    caja: 'bg-[color-mix(in_oklab,var(--surface)_80%,var(--accent)_20%)] border-[1.5px] shadow-[var(--shadow-2)]',
    chip: 'bg-[color-mix(in_oklab,var(--accent)_30%,transparent)]',
    nota: 'text-[var(--accent)]',
    titulo: 'text-[var(--accent)]',
  },
} as const;

function AnilloPuntaje({ puntaje }: { puntaje: number }) {
  const reduce = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduce ? puntaje : 0);
  const R = 66;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    if (reduce) return;
    const control = animate(0, puntaje, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: setMostrado });
    return () => control.stop();
  }, [puntaje, reduce]);

  return (
    <div className="relative size-40" role="img" aria-label={`Puntaje de Presencia: ${puntaje.toFixed(1)} de 10`}>
      <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true">
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
          initial={{ strokeDashoffset: reduce ? C * (1 - puntaje / 10) : C }}
          animate={{ strokeDashoffset: C * (1 - puntaje / 10) }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-[40px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {mostrado.toFixed(1)}
        </span>
        <span className="mt-1 text-[12px] font-medium text-[var(--text-secondary)]">de 10</span>
      </div>
    </div>
  );
}

export function ResultadoCheck({
  resultado,
  ocasion,
  fecha,
  gemaNueva,
}: {
  resultado: Resultado;
  ocasion: string;
  /** Si viene, es un Check pasado (historial): se muestra la fecha en vez de "hoy". */
  fecha?: string;
  gemaNueva?: boolean;
}) {
  const reduce = useReducedMotion();
  const puntaje = puntajeDe(resultado);
  const entrada = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.28, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="flex flex-col items-center">
      <motion.h1
        {...entrada(0)}
        className="text-balance text-center text-[22px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]"
      >
        {fecha ? `Tu Check del ${fecha}` : '¡Tus resultados para hoy!'}
      </motion.h1>
      <motion.p {...entrada(0)} className="mt-1 text-[14px] text-[var(--text-secondary)]">
        Para {OCASION_LABEL[ocasion] ?? 'salir'}
      </motion.p>

      <div className="mt-4">
        <AnilloPuntaje puntaje={puntaje} />
      </div>

      {gemaNueva && (
        <motion.p
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20, delay: 0.9 }}
          className="mt-3 flex items-center gap-1.5 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[12px] font-semibold text-[var(--accent)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/iconos/icono-3-gema.gif" alt="" aria-hidden="true" className="size-4" />
          +1 gema por tu calificación
        </motion.p>
      )}

      <motion.div
        {...entrada(1)}
        className="mt-4 flex w-full items-start gap-3 rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)]">
          <Target size={18} color="var(--accent)" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu ajuste clave</p>
          <p className="mt-1 text-[14px] font-semibold leading-[1.45] text-[var(--text-primary)]">{resultado.ajuste_clave}</p>
        </div>
      </motion.div>

      <div className="mt-3 flex w-full flex-col gap-3">
        {EJES.map((eje, i) => {
          const e = resultado[eje.clave];
          const s = ESTILO_NIVEL[eje.nivel];
          const Icono = eje.icono;
          return (
            <motion.div
              key={eje.clave}
              {...entrada(2 + i)}
              className={`flex gap-3 rounded-[var(--radius-card)] border-[color-mix(in_oklab,var(--accent)_28%,transparent)] p-4 text-left ${s.caja}`}
            >
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] ${s.chip}`}>
                <Icono size={18} color="var(--accent)" strokeWidth={eje.nivel === 'fuerte' ? 2.4 : 2} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className={`text-[15px] font-bold ${s.titulo}`}>{eje.titulo}</h2>
                  <span className={`text-[14px] font-bold tabular-nums [font-family:var(--font-display)] ${s.nota}`}>{e.nota}/10</span>
                </div>
                <p className="mt-1 text-[14px] leading-[1.45] text-[var(--text-secondary)]">{e.comentario}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        {...entrada(5)}
        className="mt-3 flex w-full items-start gap-3 rounded-[var(--radius-card)] border-[1.5px] border-transparent p-4 text-left [background:linear-gradient(color-mix(in_oklab,var(--surface)_88%,var(--accent)_12%),color-mix(in_oklab,var(--surface)_88%,var(--accent)_12%))_padding-box,linear-gradient(135deg,color-mix(in_oklab,var(--accent)_55%,transparent),transparent_65%)_border-box]"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent)_18%,transparent)]">
          <Quote size={16} color="var(--accent)" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu presencia hoy</p>
          <p className="mt-1 text-[14px] font-semibold leading-[1.45] text-[var(--text-primary)]">{resultado.frase_cierre}</p>
        </div>
      </motion.div>
    </div>
  );
}
