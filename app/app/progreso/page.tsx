'use client';

// PANTALLA "PROGRESO" — Tu Ruta de Presencia (2026-10-04, reemplaza a "Historial").
// Dato héroe: el nivel de presencia (suma de los 3 niveles, nunca baja). Debajo, un nivel
// por eje con su siguiente paso y una acción en el eje foco; los resúmenes de cada mes; y la
// lista de todos sus Checks (lo que era Historial). Todo sale de sus Checks reales (24).

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { animate, motion, useReducedMotion } from 'motion/react';
import {
  Briefcase,
  CalendarClock,
  Camera,
  ChevronRight,
  Handshake,
  Heart,
  Palmtree,
  Sparkles,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useChecksProgreso } from '@/components/app/useChecksProgreso';
import { TarjetaEje } from '@/components/app/RutaPresencia';
import { EJES, ejeFoco, mesAnterior, mesDe, NIVEL_MAX, nombreMes, progresoEje, TITULO_EJE } from '@/lib/progreso';

const OCASION: Record<string, { label: string; icon: LucideIcon }> = {
  entrevista: { label: 'Entrevista', icon: Briefcase },
  cita: { label: 'Cita', icon: Heart },
  negocios: { label: 'Negocios', icon: Handshake },
  amigos: { label: 'Amigos', icon: Users },
  cena: { label: 'Cena formal', icon: UtensilsCrossed },
  vacaciones: { label: 'Vacaciones', icon: Palmtree },
};

const fechaCorta = (iso: string) => new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(iso));

const claveVisto = (mes: string) => `niki_resumen_visto_${mes}`;
const sinSuscripcion = () => () => {};
function leerVisto(mes: string): boolean {
  try {
    return localStorage.getItem(claveVisto(mes)) === '1';
  } catch {
    return false;
  }
}

/** Número que cuenta de 0 al valor al aparecer (baseline de animación #2). */
function Cuenta({ valor }: { valor: number }) {
  const reduce = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduce ? valor : 0);
  useEffect(() => {
    if (reduce) return;
    const control = animate(0, valor, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setMostrado(Math.round(v)) });
    return () => control.stop();
  }, [valor, reduce]);
  return <>{reduce ? valor : mostrado}</>;
}

const CORTE_CHECKS = 15;
const CORTE_MESES = 4; // mismo patrón que CORTE_CHECKS (regla UX #14): nunca una lista sin tope.
const TECHO_CHIPS = 3; // gate de carga cognitiva: ≤4 opciones por decisión ("Todas" + 3 + "Otras").
const OTRAS = '__otras__';

export default function Progreso() {
  const reduce = useReducedMotion();
  const { checks, error, reintentar } = useChecksProgreso();
  const [mesActual] = useState(() => mesDe(new Date().toISOString()));
  const [filtro, setFiltro] = useState<string | null>(null);
  const [verTodos, setVerTodos] = useState(false);
  const [verTodosMeses, setVerTodosMeses] = useState(false);

  const ejes = useMemo(() => (checks ? EJES.map((e) => progresoEje(checks, e)) : []), [checks]);
  const foco = useMemo(() => ejeFoco(ejes), [ejes]);
  const mesCerrado = mesAnterior(mesActual);
  // Meses ya cerrados con Checks (el más reciente primero): cada uno tiene su resumen.
  const mesesConResumen = useMemo(
    () => (checks ? [...new Set(checks.map((c) => mesDe(c.created_at)))].filter((m) => m < mesActual).sort().reverse() : []),
    [checks, mesActual],
  );
  const delMes = checks?.filter((c) => mesDe(c.created_at) === mesActual).length ?? 0;
  // Ocasiones que de verdad tiene este usuario (nunca las 6 completas si no las usó), ordenadas
  // por frecuencia de uso (la más repetida primero — heurística "reconocer", más predecible) —
  // regla de UX #14: toda lista de más de 8-10 ítems necesita filtro.
  const ocasionesPresentes = useMemo(() => {
    if (!checks) return [];
    const conteo = new Map<string, number>();
    for (const c of checks) if (OCASION[c.ocasion]) conteo.set(c.ocasion, (conteo.get(c.ocasion) ?? 0) + 1);
    return [...conteo.entries()].sort((a, b) => b[1] - a[1]).map(([o]) => o);
  }, [checks]);
  // Gate de carga cognitiva (≤4 opciones por decisión): como máximo 3 chips propias + "Otras".
  const ocasionesChip = ocasionesPresentes.slice(0, TECHO_CHIPS);
  const ocasionesOtras = ocasionesPresentes.slice(TECHO_CHIPS);
  const checksOrdenados = useMemo(() => (checks ? [...checks].reverse() : []), [checks]);
  const checksFiltrados = useMemo(() => {
    if (!filtro) return checksOrdenados;
    if (filtro === OTRAS) return checksOrdenados.filter((c) => ocasionesOtras.includes(c.ocasion));
    return checksOrdenados.filter((c) => c.ocasion === filtro);
  }, [checksOrdenados, filtro, ocasionesOtras]);
  const checksVisibles = verTodos ? checksFiltrados : checksFiltrados.slice(0, CORTE_CHECKS);
  // En el servidor se asume "visto" para no pintar un aviso que luego desaparece.
  const resumenVisto = useSyncExternalStore(sinSuscripcion, () => leerVisto(mesCerrado), () => true);
  const avisoNuevo = mesesConResumen[0] === mesCerrado && !resumenVisto;

  const aparece = (i: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.06 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } };

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="max-w-72 text-[15px] text-[var(--text-primary)]">No pudimos cargar tu progreso. Revisa tu conexión.</p>
        <button
          type="button"
          onClick={reintentar}
          className="mt-4 h-12 rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-[16px] font-semibold text-[var(--bg)]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (checks === null) {
    return (
      <div className="flex flex-1 flex-col gap-3 pt-4" aria-busy="true">
        <div className="h-8 w-48 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="h-24 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        ))}
      </div>
    );
  }

  if (checks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <CalendarClock size={28} color="var(--accent)" aria-hidden="true" />
        </span>
        <h1 className="mt-5 max-w-72 text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          Tu Ruta de Presencia empieza con tu primer Check
        </h1>
        <p className="mt-2 max-w-72 text-[15px] leading-[1.5] text-[var(--text-secondary)]">
          Con cada foto, Niki mide tu outfit, tu postura y tu actitud, y te dice qué ajustar para subir de nivel.
        </p>
        <Link
          href="/app"
          className="mt-6 flex h-12 w-full max-w-72 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
        >
          Hacer mi primer Check
        </Link>
      </div>
    );
  }

  const total = ejes.reduce((s, e) => s + e.nivel, 0);
  const maxTotal = NIVEL_MAX * EJES.length;

  return (
    <div className="flex flex-1 flex-col pt-4">
      <motion.h1 {...aparece(0)} className="text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu Ruta de Presencia
      </motion.h1>
      <motion.p {...aparece(0)} className="mt-1 text-[13px] text-[var(--text-secondary)]">
        {nombreMes(mesActual)} · {delMes === 1 ? '1 Check este mes' : `${delMes} Checks este mes`}
      </motion.p>

      {/* Dato héroe: nivel de presencia (suma de los 3 niveles; nunca baja). */}
      <motion.section
        {...aparece(1)}
        aria-label={`Nivel de presencia: ${total} de ${maxTotal}`}
        className="mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
      >
        <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu nivel de presencia</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-[40px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
            <Cuenta valor={total} />
          </span>
          <span className="text-[15px] font-semibold text-[var(--text-secondary)]">de {maxTotal}</span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: reduce ? `${(total / maxTotal) * 100}%` : '0%' }}
            animate={{ width: `${(total / maxTotal) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-2 text-[13px] leading-[1.45] text-[var(--text-secondary)]">
          Suma tus 3 niveles. Sube con cada Check bueno y nunca baja.
        </p>
      </motion.section>

      {avisoNuevo && (
        <motion.div {...aparece(2)}>
          <Link
            href={`/app/progreso/mes/${mesCerrado}`}
            className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] transition-transform duration-100 active:scale-[0.98]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/iconos/niki-celebrando.webp"
              alt=""
              aria-hidden="true"
              className="size-12 shrink-0"
              initial={reduce ? false : { scale: 0.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.3, type: 'spring', stiffness: 260, damping: 14 }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Nuevo · Tu mes con Niki</p>
              <p className="mt-1 text-[15px] font-semibold text-[var(--text-primary)]">Mira cómo te fue en {nombreMes(mesCerrado).toLowerCase()}</p>
            </div>
            <ChevronRight size={18} color="var(--text-tertiary)" aria-hidden="true" />
          </Link>
        </motion.div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {ejes.map((p, i) => (
          <motion.div key={p.eje} {...aparece(i + 3)}>
            <TarjetaEje p={p} foco={p.eje === foco} />
            {p.eje === foco && (
              <Link
                href="/app"
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] transition-transform duration-100 active:scale-[0.98]"
              >
                <Camera size={18} aria-hidden="true" />
                Hacer un Check para subir {TITULO_EJE[p.eje].toLowerCase()}
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {mesesConResumen.length > 0 && (
        <section aria-label="Resúmenes de cada mes" className="mt-8">
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Tus meses con Niki</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(verTodosMeses ? mesesConResumen : mesesConResumen.slice(0, CORTE_MESES)).map((m) => (
              <Link
                key={m}
                href={`/app/progreso/mes/${m}`}
                className="flex h-11 items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] px-4 text-[13px] font-semibold text-[var(--accent)] transition-transform duration-100 active:scale-[0.97]"
              >
                {nombreMes(m)}
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            ))}
            {!verTodosMeses && mesesConResumen.length > CORTE_MESES && (
              <button
                type="button"
                onClick={() => setVerTodosMeses(true)}
                className="flex h-11 items-center gap-1 rounded-full bg-[var(--chip-bg)] px-4 text-[13px] font-semibold text-[var(--text-secondary)] transition-transform duration-100 active:scale-[0.97]"
              >
                Ver los {mesesConResumen.length - CORTE_MESES} meses restantes
              </button>
            )}
          </div>
        </section>
      )}

      <h2 className="mt-8 text-[17px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Tus Checks</h2>

      {ocasionesPresentes.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por ocasión">
          <button
            type="button"
            onClick={() => setFiltro(null)}
            aria-pressed={filtro === null}
            className={`h-11 rounded-full px-3 text-[13px] font-semibold transition-colors ${
              filtro === null ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--chip-bg)] text-[var(--text-secondary)]'
            }`}
          >
            Todas
          </button>
          {ocasionesChip.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFiltro(key)}
              aria-pressed={filtro === key}
              className={`h-11 rounded-full px-3 text-[13px] font-semibold transition-colors ${
                filtro === key ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--chip-bg)] text-[var(--text-secondary)]'
              }`}
            >
              {OCASION[key].label}
            </button>
          ))}
          {ocasionesOtras.length > 0 && (
            <button
              type="button"
              onClick={() => setFiltro(OTRAS)}
              aria-pressed={filtro === OTRAS}
              className={`h-11 rounded-full px-3 text-[13px] font-semibold transition-colors ${
                filtro === OTRAS ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--chip-bg)] text-[var(--text-secondary)]'
              }`}
            >
              Otras
            </button>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {checksVisibles.map((c) => {
          const o = OCASION[c.ocasion];
          const Icono = o?.icon ?? Sparkles;
          return (
            <Link
              key={c.id}
              href={`/app/historial/${c.id}`}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] transition-transform duration-100 active:scale-[0.98]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                <Icono size={18} color="var(--accent)" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[var(--text-primary)]">{o?.label ?? c.ocasion}</p>
                <p className="text-[13px] text-[var(--text-secondary)]">{fechaCorta(c.created_at)}</p>
              </div>
              {c.puntaje !== null && (
                <span className="flex items-center gap-1 text-[16px] font-bold tabular-nums text-[var(--accent)] [font-family:var(--font-display)]">
                  {Number(c.puntaje).toFixed(1)}
                  <ChevronRight size={16} aria-hidden="true" />
                </span>
              )}
            </Link>
          );
        })}
        {!verTodos && checksFiltrados.length > CORTE_CHECKS && (
          <button
            type="button"
            onClick={() => setVerTodos(true)}
            className="mt-1 flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--chip-bg)] text-[15px] font-semibold text-[var(--accent)]"
          >
            Ver los {checksFiltrados.length - CORTE_CHECKS} Checks restantes
          </button>
        )}
      </div>
    </div>
  );
}
