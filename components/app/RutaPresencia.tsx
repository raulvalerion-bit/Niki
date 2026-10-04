'use client';

// Piezas de la Ruta de Presencia (2026-10-04): anillo de nivel por eje y tarjeta de eje.
// El anillo se dibuja al entrar (baseline de animación #3) y respeta reduced-motion.

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { NIVEL_MAX, TITULO_EJE, type ProgresoEje } from '@/lib/progreso';

export function AnilloNivel({ nivel, tam = 56 }: { nivel: number; tam?: number }) {
  const reduce = useReducedMotion();
  const r = 24;
  const c = 2 * Math.PI * r;
  const final = c * (1 - nivel / NIVEL_MAX);
  return (
    <span className="relative flex shrink-0 items-center justify-center" style={{ width: tam, height: tam }}>
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="5" />
        <motion.circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? final : c }}
          animate={{ strokeDashoffset: final }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="relative text-[18px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
        {nivel}
      </span>
    </span>
  );
}

export function Tendencia({ valor }: { valor: number | null }) {
  if (valor === null) return null;
  if (Math.abs(valor) < 0.2) return <span className="text-[12px] font-semibold text-[var(--text-secondary)]">Estable</span>;
  return (
    <span className={`text-[12px] font-bold tabular-nums ${valor > 0 ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
      {valor > 0 ? '↑' : '↓'} {Math.abs(valor).toFixed(1)}
    </span>
  );
}

export function TarjetaEje({ p, foco }: { p: ProgresoEje; foco: boolean }) {
  return (
    <Link
      href={`/app/progreso/${p.eje}`}
      className={`block w-full rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] transition-transform duration-100 active:scale-[0.98] ${
        foco ? 'border-2 border-[var(--accent)]' : 'border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <AnilloNivel nivel={p.nivel} />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
            {TITULO_EJE[p.eje]} · Nivel {p.nivel}/{NIVEL_MAX}
            {foco && ' · Tu foco'}
          </p>
          <p className="mt-1 text-[15px] font-semibold leading-[1.3] text-[var(--text-primary)]">{p.frase}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Tendencia valor={p.tendencia} />
          <ChevronRight size={16} color="var(--text-tertiary)" aria-hidden="true" />
        </div>
      </div>
      {p.metaSiguiente !== null && p.actual !== null && (
        <div className="mt-3">
          <div className="h-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.max(4, Math.round(p.avance * 100))}%` }} />
          </div>
          <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
            Nivel {p.nivel + 1} al promediar {p.metaSiguiente.toFixed(1)} · vas en {p.actual.toFixed(1)}
          </p>
        </div>
      )}
      <p className="mt-3 text-[14px] leading-[1.45] text-[var(--text-secondary)]">
        <b className="font-semibold text-[var(--text-primary)]">Siguiente paso:</b> {p.siguientePaso}
      </p>
    </Link>
  );
}
