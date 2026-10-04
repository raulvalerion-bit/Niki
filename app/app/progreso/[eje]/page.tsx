'use client';

// DETALLE DE UN EJE — Ruta de Presencia (2026-10-04): nivel, cuánto falta para el
// siguiente, la evolución de sus últimos Checks y "Lo que más te sube" (lo que Niki
// le marcó más veces, en orden). Nada inventado: todo sale de sus Checks.

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useChecksProgreso } from '@/components/app/useChecksProgreso';
import { EJES, NIVEL_MAX, progresoEje, TITULO_EJE } from '@/lib/progreso';
import type { ClaveEje } from '@/lib/ia/resultado';

const CARD = 'mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]';

export default function DetalleEje() {
  const reduce = useReducedMotion();
  const { eje: param } = useParams<{ eje: string }>();
  const eje = (EJES as string[]).includes(param) ? (param as ClaveEje) : null;
  const { checks, error, reintentar } = useChecksProgreso();

  const volver = (
    <Link href="/app/progreso" className="-ml-2 flex w-fit items-center gap-1 px-2 py-3 text-[14px] font-semibold text-[var(--text-primary)]">
      <ChevronLeft size={18} aria-hidden="true" />
      Progreso
    </Link>
  );

  if (!eje) {
    return (
      <div className="flex flex-1 flex-col pt-2">
        {volver}
        <p className="mt-6 text-[15px] text-[var(--text-primary)]">Esta sección no existe. Vuelve a tu Ruta de Presencia.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col pt-2">
        {volver}
        <p className="mt-6 text-[15px] text-[var(--text-primary)]">No pudimos cargar tu progreso. Revisa tu conexión.</p>
        <button type="button" onClick={reintentar} className="mt-4 h-12 w-fit rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-[16px] font-semibold text-[var(--bg)]">
          Reintentar
        </button>
      </div>
    );
  }

  if (checks === null) {
    return (
      <div className="flex flex-1 flex-col gap-3 pt-2" aria-busy="true">
        {volver}
        <div className="h-16 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="h-48 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const p = progresoEje(checks, eje);
  const titulo = TITULO_EJE[eje];
  const max = Math.max(10, ...p.serie);
  // Un trazo mínimo para que la barra no parezca rota cuando el avance es 0.
  const barra = Math.max(4, Math.round(p.avance * 100));

  return (
    <div className="flex flex-1 flex-col pt-2">
      {volver}
      <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">{titulo}</p>
      <h1 className="mt-1 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Nivel {p.nivel} de {NIVEL_MAX}
      </h1>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]" role="img" aria-label={`Avance al siguiente nivel: ${Math.round(p.avance * 100)}%`}>
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          initial={{ width: reduce ? `${barra}%` : '0%' }}
          animate={{ width: `${barra}%` }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="mt-2 text-[14px] leading-[1.45] text-[var(--text-secondary)]">
        {p.metaSiguiente === null ? (
          'Llegaste al nivel máximo. Ahora el reto es sostenerlo en ocasiones nuevas.'
        ) : checks.length < 3 ? (
          <>
            Con <b className="text-[var(--text-primary)]">3 Checks</b> Niki calcula tu nivel real. Llevas {checks.length}.
          </>
        ) : (
          <>
            Para el nivel {p.nivel + 1}: promedia <b className="text-[var(--text-primary)]">{p.metaSiguiente.toFixed(1)}+</b> en tus próximos Checks
            {p.actual !== null && ` (vas en ${p.actual.toFixed(1)})`}.
          </>
        )}
      </p>

      {p.serie.length > 0 && (
        <section className={CARD} aria-label={`Tus últimos ${p.serie.length} Checks de ${titulo.toLowerCase()}`}>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
            {p.serie.length === 1 ? 'Tu primer Check' : `Tus últimos ${p.serie.length} Checks`}
          </p>
          <div className="mt-3 flex h-24 items-end gap-2">
            {p.serie.map((nota, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <motion.span
                  className={`w-full rounded-t-[6px] rounded-b-[3px] ${i === p.serie.length - 1 ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--accent)_35%,transparent)]'}`}
                  initial={{ height: reduce ? `${(nota / max) * 72}px` : 0 }}
                  animate={{ height: `${(nota / max) * 72}px` }}
                  transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="text-[11px] font-semibold tabular-nums text-[var(--text-secondary)]">{nota}</span>
              </div>
            ))}
          </div>
          {p.desdeInicio !== null && (
            <p className="mt-3 text-[14px] leading-[1.45] text-[var(--text-secondary)]">
              {p.desdeInicio > 0 ? (
                <>
                  <b className="text-[var(--text-primary)]">↑ {p.desdeInicio} desde tu primer Check.</b> Lo estás logrando.
                </>
              ) : p.desdeInicio === 0 ? (
                'Igual que en tu primer Check: el siguiente paso de abajo es el que más te sube.'
              ) : (
                'Un poco abajo de tu primer Check: es normal entre ocasiones distintas. El siguiente paso de abajo te ayuda.'
              )}
            </p>
          )}
        </section>
      )}

      <section className={CARD} aria-label="Lo que más te sube">
        <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Lo que más te sube</p>
        {p.recomendaciones.length > 0 ? (
          <ol className="mt-1">
            {p.recomendaciones.slice(0, 3).map((r, i) => (
              <li key={r.tema} className={`flex items-start gap-3 py-3 ${i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]' : ''}`}>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[12px] font-bold text-[var(--accent)]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[15px] leading-[1.4] text-[var(--text-primary)]">{r.texto}</p>
                  <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
                    Niki te lo marcó en {r.veces} de tus {r.de} Checks
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-[15px] leading-[1.45] text-[var(--text-primary)]">{p.siguientePaso}</p>
        )}
      </section>

      <Link
        href="/app"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] active:scale-[0.98]"
      >
        Practicarlo en mi próximo Check
      </Link>
    </div>
  );
}
