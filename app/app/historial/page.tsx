'use client';

// PANTALLA "HISTORIAL" — lista de Checks de Presencia pasados, leída de
// verdad de la tabla `checks` (2026-09-19). Empty state real de día 1 si
// todavía no hay ninguno (regla de 15-PATRONES-UX.md).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarClock, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';

type Check = { id: string; ocasion: string; estado: string; puntaje: number | null; created_at: string };

const ESTADO_LABEL: Record<string, string> = {
  procesando: 'Analizando',
  invalida: 'Foto no válida',
  error: 'No se analizó',
  pendiente: 'Sin resultado',
};

const OCASION_LABEL: Record<string, string> = {
  entrevista: 'Entrevista',
  cita: 'Cita',
  negocios: 'Negocios',
  amigos: 'Amigos',
  cena: 'Cena formal',
  vacaciones: 'Vacaciones',
};

function fechaCorta(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(iso));
}

/** Fila tocable solo si tiene resultado (un elemento que parece tocable siempre hace algo). */
function Fila({ href, className, children }: { href: string | null; className: string; children: React.ReactNode }) {
  return href ? (
    <Link href={href} className={`${className} transition-transform duration-100 active:scale-[0.98]`}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export default function Historial() {
  const supabase = crearClienteSupabase();
  const [checks, setChecks] = useState<Check[] | null>(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('checks')
        .select('id, ocasion, estado, puntaje, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (activo) setChecks(data ?? []);
    })();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hayChecks = checks && checks.length > 0;

  return (
    <div className="flex flex-1 flex-col pt-4">
      <h1 className="text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu historial
      </h1>

      {hayChecks ? (
        <div className="mt-5 flex flex-col gap-2.5">
          {checks!.map((c) => (
            <Fila
              key={c.id}
              href={c.estado === 'listo' ? `/app/historial/${c.id}` : null}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                {c.estado === 'listo' ? (
                  <Sparkles size={18} color="var(--accent)" aria-hidden="true" />
                ) : (
                  <Clock size={18} color="var(--accent)" aria-hidden="true" />
                )}
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {OCASION_LABEL[c.ocasion] ?? c.ocasion}
                </p>
                <p className="text-[13px] text-[var(--text-secondary)]">{fechaCorta(c.created_at)}</p>
              </div>
              {c.estado === 'listo' && c.puntaje !== null ? (
                <span className="flex items-center gap-1 text-[16px] font-bold tabular-nums text-[var(--accent)] [font-family:var(--font-display)]">
                  {Number(c.puntaje).toFixed(1)}
                  <ChevronRight size={16} aria-hidden="true" />
                </span>
              ) : (
                <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{ESTADO_LABEL[c.estado] ?? 'Sin resultado'}</span>
              )}
            </Fila>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
