'use client';

// PANTALLA HOY — estado de inicio (M0 de 56): (1) el dato de hoy = anillo con
// el último puntaje, (2) la acción de 1 tap, (3) la Racha Glow-Up, (4) el
// insight = el ajuste pendiente del último Check. Presentacional: los datos
// los carga app/app/page.tsx.

import { motion, useReducedMotion } from 'motion/react';
import { Camera, ChevronRight, Target, WifiOff } from 'lucide-react';
import { AnilloPuntaje } from '@/components/app/ResultadoCheck';
import { RachaGlowUp, type EstadoRacha } from '@/components/app/RachaGlowUp';
import { LIMITE_CHECKS_DIA, type ResultadoCheck as Resultado } from '@/lib/ia/resultado';

export type UltimoCheck = {
  id: string;
  puntaje: number;
  resultado: Resultado;
  created_at: string;
  /** Nombre visible de la ocasión del último Check (p. ej. "Entrevista"). */
  ocasionLabel?: string | null;
  /** El Check anterior DE LA MISMA OCASIÓN, para decir si mejoró o no (dato + interpretación, 17). */
  anterior?: { puntaje: number; created_at: string } | null;
};

const fechaCorta = (iso: string) => new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(iso));

// La ocasión va en la línea de arriba; aquí la comparación es siempre contra
// la misma ocasión (la arma app/app/page.tsx).
function interpretacion(u: UltimoCheck) {
  if (!u.anterior) return u.ocasionLabel ? 'Tu punto de partida para esta ocasión' : 'Tu primer puntaje: la base para medir tu avance';
  const d = Math.round((u.puntaje - u.anterior.puntaje) * 10) / 10;
  if (d > 0) return `↑ ${d.toFixed(1)} vs tu Check del ${fechaCorta(u.anterior.created_at)}`;
  if (d < 0) return `↓ ${Math.abs(d).toFixed(1)} vs tu Check del ${fechaCorta(u.anterior.created_at)}`;
  return `Igual que tu Check del ${fechaCorta(u.anterior.created_at)}`;
}

const BOTON_PRIMARIO =
  'flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] disabled:opacity-40';

export function HoyInicio({
  cargado,
  errorCarga,
  reintentar,
  usadosHoy,
  restantes,
  ultimo,
  racha,
  hoy,
  empezarCheck,
  abrirCheck,
}: {
  cargado: boolean;
  errorCarga: boolean;
  reintentar: () => void;
  usadosHoy: number | null;
  restantes: number | null;
  ultimo: UltimoCheck | null;
  racha: EstadoRacha | null;
  hoy: string;
  empezarCheck: () => void;
  abrirCheck: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const hechoHoy = (usadosHoy ?? 0) > 0;
  const ejeMasBajo = ultimo
    ? (['outfit', 'postura', 'actitud'] as const).reduce((a, b) => (ultimo.resultado[b].nota < ultimo.resultado[a].nota ? b : a))
    : null;
  const NOMBRE_EJE = { outfit: 'Outfit', postura: 'Postura', actitud: 'Actitud' } as const;
  const aparece = (i: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28, delay: 0.05 + i * 0.07 } };

  if (errorCarga) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center pt-8 text-center" role="alert">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <WifiOff size={26} color="var(--accent)" aria-hidden="true" />
        </span>
        <h1 className="mt-6 max-w-xs text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          No pudimos cargar tu día
        </h1>
        <p className="mt-3 max-w-xs text-[15px] leading-[1.5] text-[var(--text-primary)]">
          Revisa tu conexión a internet y vuelve a intentarlo. Tu racha y tus Checks están a salvo.
        </p>
        <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={reintentar} className={`mt-8 max-w-xs ${BOTON_PRIMARIO}`}>
          Reintentar
        </motion.button>
      </div>
    );
  }

  if (!cargado) {
    return (
      <div className="flex flex-1 flex-col items-center pt-4" aria-busy="true" aria-label="Cargando tu día">
        <div className="h-7 w-56 animate-pulse rounded-full bg-[var(--surface-2)]" />
        <div className="mt-4 size-40 animate-pulse rounded-full bg-[var(--surface-2)]" />
        <div className="mt-6 h-14 w-full animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="mt-6 h-48 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="mt-4 h-20 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center pt-4 text-center">
      <motion.h1
        {...aparece(0)}
        className="text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]"
      >
        {restantes === 0 ? 'Ya hiciste tus 3 Checks de hoy' : hechoHoy ? 'Hoy ya cuidaste tu presencia' : 'Tu Check de hoy te espera'}
      </motion.h1>

      {ultimo ? (
        <motion.div {...aparece(1)} className="mt-4 flex flex-col items-center">
          <AnilloPuntaje puntaje={ultimo.puntaje} />
          <p className="mt-2 text-[12px] font-medium text-[var(--text-primary)]">
            Tu último puntaje · {ultimo.ocasionLabel ? `${ultimo.ocasionLabel} · ` : ''}{fechaCorta(ultimo.created_at)}
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[var(--text-primary)]">{interpretacion(ultimo)}</p>
        </motion.div>
      ) : (
        <motion.p {...aparece(1)} className="mt-2 max-w-xs text-[15px] leading-[1.45] text-[var(--text-primary)]">
          Sube tu foto y en segundos ves tu puntaje de presencia y tu ajuste clave.
        </motion.p>
      )}

      <motion.button
        {...aparece(2)}
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={empezarCheck}
        className={`mt-6 ${BOTON_PRIMARIO}`}
      >
        <Camera size={20} aria-hidden="true" />
        {restantes === 0 ? 'Ver mi último resultado' : hechoHoy ? 'Hacer otro Check' : 'Hacer mi Check de Presencia'}
      </motion.button>
      {restantes !== null && restantes > 0 && (
        <p className="mt-3 text-[12px] font-medium text-[var(--text-primary)]">
          {restantes === LIMITE_CHECKS_DIA
            ? 'Tienes 3 Checks disponibles hoy'
            : `Te ${restantes === 1 ? 'queda 1 Check' : `quedan ${restantes} Checks`} hoy`}
        </p>
      )}


      {ultimo && ejeMasBajo ? (
        <motion.a
          {...aparece(3)}
          href={`/app/historial/${ultimo.id}`}
          onClick={(e) => {
            e.preventDefault();
            abrirCheck(ultimo.id);
          }}
          className="mt-6 flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)] active:scale-[0.98]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--chip-bg)]">
            <Target size={18} color="var(--accent)" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
              Pendiente · {NOMBRE_EJE[ejeMasBajo]} {ultimo.resultado[ejeMasBajo].nota}/10
            </p>
            <p className="mt-1 text-[15px] font-semibold leading-[1.4] text-[var(--text-primary)]">{ultimo.resultado.ajuste_clave}</p>
          </div>
          <ChevronRight size={18} color="var(--text-tertiary)" aria-hidden="true" />
        </motion.a>
      ) : (
        <motion.div
          {...aparece(3)}
          className="mt-6 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]"
        >
          <p className="text-[15px] leading-[1.45] text-[var(--text-primary)]">
            Con tu primer Check, Niki empieza a conocer tu estilo: cada foto afina un poco más tus consejos.
          </p>
        </motion.div>
      )}
      {racha && (
        <motion.div {...aparece(5)} className="mt-4 w-full">
          <RachaGlowUp estado={racha} hoy={hoy} />
        </motion.div>
      )}
    </div>
  );
}
