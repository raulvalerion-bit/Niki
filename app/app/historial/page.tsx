'use client';

// PANTALLA "HISTORIAL" — lista de Checks de Presencia pasados. Usuario recién
// registrado: sin scans todavía (real, no fabricado) — empty state que
// enseña + CTA dominante (regla de 15-PATRONES-UX.md).

import Link from 'next/link';
import { CalendarClock } from 'lucide-react';

export default function Historial() {
  return (
    <div className="flex flex-1 flex-col pt-4">
      <h1 className="text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu historial
      </h1>

      <div className="mt-10 flex flex-1 flex-col items-center justify-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <CalendarClock size={28} color="var(--accent)" aria-hidden="true" />
        </span>
        <h2 className="mt-5 max-w-[260px] text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          Aún no tienes ningún Check de Presencia guardado
        </h2>
        <p className="mt-2 max-w-[280px] text-[14px] leading-[1.5] text-[var(--text-secondary)]">
          Cada Check que hagas queda acá, para que veas cómo evoluciona tu presencia con el tiempo.
        </p>
        <Link
          href="/app"
          className="mt-6 flex h-14 w-full max-w-[280px] items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
        >
          Hacer mi primer Check
        </Link>
      </div>
    </div>
  );
}
