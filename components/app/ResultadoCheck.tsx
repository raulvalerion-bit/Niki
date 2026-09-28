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
import { ArrowUp, Check, Flame, Quote, ShoppingBag, Target, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { META_GLOWUP, puntajeDe, type RachaTrasCheck, type ResultadoCheck as Resultado } from '@/lib/ia/resultado';

/** Texto del momento de racha (56 M2/M4): con significado, sin inflar exclamaciones. */
function mensajeRacha(r: RachaTrasCheck): { titulo: string; texto: string } | null {
  if (r.hito === 21) return { titulo: '¡Glow-Up completo!', texto: '21 días seguidos cuidando tu presencia. Esta versión de ti llegó para quedarse.' };
  if (r.hito === 14) return { titulo: 'Dos semanas seguidas', texto: 'A esta altura verte bien ya es parte de tu rutina. Faltan 7 días para tu Glow-Up.' };
  if (r.hito === 7) return { titulo: 'Una semana completa', texto: 'La mayoría abandona antes del día 7; tú ya llegaste. Cada semana completa suma un congelador: salva tu racha si un día no haces tu Check.' };
  if (r.hito === 3) return { titulo: '3 días seguidos', texto: 'Ya no es casualidad: es el inicio de tu hábito.' };
  if (r.congeladores_usados > 0)
    return {
      titulo: 'Tu racha sigue viva',
      texto: `Usamos ${r.congeladores_usados === 1 ? 'un congelador' : `${r.congeladores_usados} congeladores`} para cuidarla. Te ${r.congeladores === 1 ? 'queda 1' : `quedan ${r.congeladores}`}.`,
    };
  if (r.reiniciada) return { titulo: 'Empezaste una racha nueva', texto: `Tu récord sigue siendo de ${r.mejor} días. Hoy es el día 1.` };
  return null;
}

const PASOS_ALTO_IMPACTO: { clave: 'antes' | 'al_llegar' | 'durante'; titulo: string }[] = [
  { clave: 'antes', titulo: 'Antes de entrar' },
  { clave: 'al_llegar', titulo: 'Al llegar' },
  { clave: 'durante', titulo: 'Durante' },
];

const OCASION_LABEL: Record<string, string> = {
  entrevista: 'tu entrevista',
  cita: 'tu cita',
  negocios: 'tu reunión',
  amigos: 'salir con amigos',
  cena: 'tu cena formal',
  vacaciones: 'tus vacaciones',
};

type ClaveEje = 'outfit' | 'postura' | 'actitud';
type Nivel = 'suave' | 'medio' | 'fuerte';

const EJES: { clave: ClaveEje; titulo: string; icono: LucideIcon }[] = [
  { clave: 'outfit', titulo: 'Outfit', icono: ShoppingBag },
  { clave: 'postura', titulo: 'Postura', icono: ArrowUp },
  { clave: 'actitud', titulo: 'Actitud', icono: Check },
];

/** Escala de intensidad de FICHA-ARTE aplicada al dato: la nota más baja (lo
    que más conviene ajustar) se ve "fuerte"; la más alta, "suave". */
function nivelesPorNota(r: Resultado): Record<ClaveEje, Nivel> {
  const orden = [...EJES].sort((a, b) => r[a.clave].nota - r[b.clave].nota).map((e) => e.clave);
  return { [orden[0]]: 'fuerte', [orden[1]]: 'medio', [orden[2]]: 'suave' } as Record<ClaveEje, Nivel>;
}

const ESTILO_NIVEL = {
  suave: {
    caja: 'bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] border',
    chip: 'bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]',
    nota: 'text-[var(--text-primary)]',
    titulo: 'text-[var(--text-primary)]',
  },
  medio: {
    caja: 'bg-[color-mix(in_oklab,var(--surface)_92%,var(--accent)_8%)] border',
    chip: 'bg-[color-mix(in_oklab,var(--accent)_20%,transparent)]',
    nota: 'text-[var(--text-primary)]',
    titulo: 'text-[var(--text-primary)]',
  },
  fuerte: {
    caja: 'bg-[color-mix(in_oklab,var(--surface)_80%,var(--accent)_20%)] border-[1.5px]',
    chip: 'bg-[color-mix(in_oklab,var(--accent)_30%,transparent)]',
    nota: 'text-[var(--text-primary)]',
    titulo: 'text-[var(--accent)]',
  },
} as const;

export function AnilloPuntaje({ puntaje }: { puntaje: number }) {
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
        <span className="mt-1 text-[12px] font-medium text-[var(--text-primary)]">de 10</span>
      </div>
    </div>
  );
}

export function ResultadoCheck({
  resultado,
  ocasion,
  fecha,
  gemasTotal,
  racha,
}: {
  resultado: Resultado;
  ocasion: string;
  /** Si viene, es un Check pasado (historial): se muestra la fecha en vez de "hoy". */
  fecha?: string;
  /** Si viene, el Check es de recién: se celebra la gema nueva con el total. */
  gemasTotal?: number;
  /** Si viene, se muestra el día de la Racha Glow-Up y, si toca, su momento. */
  racha?: RachaTrasCheck | null;
}) {
  const momento = racha ? mensajeRacha(racha) : null;
  const reduce = useReducedMotion();
  const puntaje = puntajeDe(resultado);
  const niveles = nivelesPorNota(resultado);
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
      <motion.p {...entrada(0)} className="mt-1 text-[15px] text-[var(--text-primary)]">
        Para {OCASION_LABEL[ocasion] ?? 'salir'}
      </motion.p>

      <div className="mt-4">
        <AnilloPuntaje puntaje={puntaje} />
      </div>

      {gemasTotal !== undefined && (
        <motion.p
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20, delay: 0.9 }}
          className="mt-3 flex items-center gap-1.5 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[12px] font-semibold text-[var(--accent)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/iconos/icono-3-gema.gif" alt="" aria-hidden="true" className="size-5" />
          +1 gema · ya llevas {gemasTotal}
        </motion.p>
      )}

      {racha && (
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22, delay: 1 }}
          aria-live="polite"
          className={`mt-3 w-full rounded-[var(--radius-card)] ${
            !momento
              ? ''
              : racha.hito === 21
                ? 'bg-[var(--accent)] p-4 text-[var(--bg)] shadow-[var(--shadow-2)]'
                : 'border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4 text-[var(--text-primary)]'
          }`}
        >
          {momento ? (
            <div className="flex items-start gap-3 text-left">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] ${
                  racha.hito === 21 ? 'bg-[var(--surface)]' : 'bg-[var(--chip-bg)]'
                }`}
              >
                <Flame
                  size={18}
                  color="var(--accent)"
                  fill="var(--accent)"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-[17px] font-bold [font-family:var(--font-display)]">{momento.titulo}</p>
                <p className="mt-1 text-[15px] leading-[1.45]">{momento.texto}</p>
                <p className="mt-2 text-[12px] font-semibold">
                  Racha Glow-Up: día {racha.racha}{racha.racha <= META_GLOWUP ? ` de ${META_GLOWUP}` : ''}
                </p>
              </div>
            </div>
          ) : (
            <p className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[var(--text-primary)]">
              <Flame size={14} color="var(--accent)" fill="var(--accent)" aria-hidden="true" />
              Racha Glow-Up: día {racha.racha}{racha.racha <= META_GLOWUP ? ` de ${META_GLOWUP}` : ''}
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        {...entrada(1)}
        className="mt-4 flex w-full items-start gap-3 rounded-[var(--radius-card)] border-[1.5px] border-transparent p-4 text-left shadow-[var(--shadow-2)] [background:linear-gradient(color-mix(in_oklab,var(--surface)_84%,var(--accent)_16%),color-mix(in_oklab,var(--surface)_84%,var(--accent)_16%))_padding-box,linear-gradient(135deg,var(--accent),color-mix(in_oklab,var(--accent)_20%,transparent)_70%)_border-box]"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)]">
          <Target size={18} color="var(--accent)" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu ajuste clave</p>
          <p className="mt-1 text-[17px] font-bold leading-[1.35] text-[var(--text-primary)]">{resultado.ajuste_clave}</p>
        </div>
      </motion.div>

      <div className="mt-3 flex w-full flex-col gap-3">
        {EJES.map((eje, i) => {
          const e = resultado[eje.clave];
          const nivel = niveles[eje.clave];
          const s = ESTILO_NIVEL[nivel];
          const Icono = eje.icono;
          return (
            <motion.div
              key={eje.clave}
              {...entrada(2 + i)}
              className={`flex gap-3 rounded-[var(--radius-card)] border-[color-mix(in_oklab,var(--accent)_28%,transparent)] p-4 text-left ${s.caja}`}
            >
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] ${s.chip}`}>
                <Icono
                  size={18}
                  // 2ª nota de la ficha (lima) solo en el ícono de Actitud, oscurecida para verse sobre crema.
                  color={eje.clave === 'actitud' ? 'color-mix(in oklab, var(--accent-2) 55%, var(--text-primary))' : 'var(--accent)'}
                  strokeWidth={nivel === 'fuerte' ? 2.4 : 2}
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className={`text-[15px] font-bold ${s.titulo}`}>{eje.titulo}</h2>
                  <span className={`text-[15px] font-bold tabular-nums [font-family:var(--font-display)] ${s.nota}`}>{e.nota}/10</span>
                </div>
                <p className="mt-1 text-[15px] leading-[1.45] text-[var(--text-primary)]">{e.comentario}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {resultado.plan_alto_impacto && (
        <motion.section
          {...entrada(5)}
          aria-label="Tu plan de Alto Impacto"
          className="mt-3 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--chip-bg)]">
              <Zap size={18} color="var(--accent)" aria-hidden="true" />
            </span>
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu plan de Alto Impacto</p>
          </div>
          <ol className="mt-3 flex flex-col gap-3">
            {PASOS_ALTO_IMPACTO.map((paso, i) => (
              <li key={paso.clave} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[12px] font-bold text-[var(--accent)]">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--text-primary)]">{paso.titulo}</p>
                  <p className="text-[15px] leading-[1.45] text-[var(--text-primary)]">{resultado.plan_alto_impacto![paso.clave]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-[color-mix(in_oklab,var(--accent)_18%,transparent)] pt-3 text-[15px] font-semibold leading-[1.45] text-[var(--text-primary)]">
            {resultado.frase_cierre}
          </p>
        </motion.section>
      )}

      {!resultado.plan_alto_impacto && (
      <motion.div
        {...entrada(5)}
        className="mt-3 flex w-full items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] p-4 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent)_18%,transparent)]">
          <Quote size={16} color="var(--accent)" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu presencia hoy</p>
          <p className="mt-1 text-[15px] font-semibold leading-[1.45] text-[var(--text-primary)]">{resultado.frase_cierre}</p>
        </div>
      </motion.div>
      )}
    </div>
  );
}
