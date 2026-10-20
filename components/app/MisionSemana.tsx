'use client';

// MISIÓN DE LA SEMANA (Ruta de Presencia, 2026-10-04). El servidor la fija desde el eje más
// débil (mision_semana) y es el único que otorga las +3 gemas (reclamar_mision, 61 Gate 5).
// Aquí solo se muestra el avance, el tip que más le sirve y el botón de reclamar.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Check, ChevronRight, Gem, Loader2, Target } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { progresoEje, TITULO_EJE } from '@/lib/progreso';
import type { ClaveEje } from '@/lib/ia/resultado';
import { useChecksProgreso } from '@/components/app/useChecksProgreso';

type Mision = { semana: string; eje: ClaveEje; meta: number; hechos: number; objetivo: number; reclamada: boolean };

export function MisionSemana({ hoy }: { hoy: string }) {
  const reduce = useReducedMotion();
  const { checks } = useChecksProgreso();
  const [mision, setMision] = useState<Mision | null | undefined>(undefined);
  const [error, setError] = useState(false);
  const [reclamando, setReclamando] = useState(false);
  const [recienCumplida, setRecienCumplida] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    (async () => {
      const { data, error: fallo } = await crearClienteSupabase().rpc('mision_semana', { p_hoy: hoy });
      if (!activo) return;
      if (fallo) setError(true);
      else setMision((data as Mision | null) ?? null);
    })();
    return () => {
      activo = false;
    };
  }, [hoy, intento]);

  async function reclamar() {
    if (reclamando || !mision) return;
    setReclamando(true);
    const { data, error: fallo } = await crearClienteSupabase().rpc('reclamar_mision', { p_hoy: hoy });
    setReclamando(false);
    const r = data as { ok: boolean; motivo?: string } | null;
    if (fallo || !r) {
      setError(true);
      return;
    }
    if (r.ok || r.motivo === 'ya_reclamada') {
      setMision({ ...mision, reclamada: true });
      setRecienCumplida(r.ok);
    }
  }

  if (error) {
    return (
      <div className="w-full rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-[14px] text-[var(--text-secondary)] shadow-[var(--shadow-1)]">
        No pudimos cargar tu misión de la semana.{' '}
        <button
          type="button"
          onClick={() => {
            setError(false);
            setIntento((n) => n + 1);
          }}
          className="font-semibold text-[var(--accent)] underline underline-offset-4"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (mision === undefined) {
    return <div aria-hidden="true" className="h-32 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />;
  }
  if (mision === null) return null; // sin Checks todavía: la tarjeta de arriba invita al primero

  const eje = TITULO_EJE[mision.eje];
  const tip = checks ? progresoEje(checks, mision.eje).siguientePaso : null;
  const cumplida = mision.hechos >= mision.objetivo;
  const faltan = mision.objetivo - mision.hechos;

  return (
    <div className="w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)]">
          {mision.reclamada ? (
            <Check size={20} color="var(--bg)" strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Target size={20} color="var(--bg)" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Misión de la semana · {eje}</p>
          <p className="mt-1 text-[17px] font-semibold leading-[1.3] text-[var(--text-primary)]">
            {mision.reclamada ? `¡Cumplida! Tu ${eje.toLowerCase()} subió esta semana` : `Saca ${mision.meta}+ en ${eje.toLowerCase()} en 3 Checks`}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3" role="img" aria-label={`${mision.hechos} de ${mision.objetivo} Checks logrados`}>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: reduce ? `${(mision.hechos / mision.objetivo) * 100}%` : '0%' }}
            animate={{ width: `${(mision.hechos / mision.objetivo) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="shrink-0 text-[13px] font-bold tabular-nums text-[var(--text-secondary)]">
          {mision.hechos}/{mision.objetivo}
        </span>
      </div>

      {mision.reclamada ? (
        <p className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary)]">
          <Gem size={16} color="var(--accent)" aria-hidden="true" />
          {recienCumplida ? '+3 gemas para ti. ¡Así se avanza!' : 'Ya sumaste tus +3 gemas. El lunes llega una nueva.'}
        </p>
      ) : cumplida ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={reclamar}
          disabled={reclamando}
          aria-busy={reclamando || undefined}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] disabled:opacity-80"
        >
          {reclamando ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Gem size={18} aria-hidden="true" />}
          Reclamar mis 3 gemas
        </motion.button>
      ) : (
        <p className="mt-3 text-[13px] leading-[1.45] text-[var(--text-secondary)]">
          {mision.hechos} de 3 · Te {faltan === 1 ? 'falta 1' : `faltan ${faltan}`} para sumar <b className="text-[var(--text-primary)]">+3 gemas</b>.
          {tip && (
            <>
              {' '}
              Tip: {tip}
            </>
          )}
        </p>
      )}

      <Link
        href={`/app/progreso/${mision.eje}`}
        className="mt-2 -mb-2 flex min-h-11 items-center gap-1 text-[13px] font-semibold text-[var(--accent)]"
      >
        Ver mi ruta de {eje.toLowerCase()}
        <ChevronRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
