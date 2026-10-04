'use client';

// TU MES CON NIKI — Ruta de Presencia (2026-10-04, momento emocional del 56):
// cómo le fue en cada eje contra el mes anterior, niveles nuevos, su mejor momento
// y el reto del mes que empieza. Al tocar "Empezar mi mes" se marca como visto.

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Star } from 'lucide-react';
import { useChecksProgreso } from '@/components/app/useChecksProgreso';
import { EJES, OCASIONES_RETO, ejeFoco, mesAnterior, mesDe, nombreMes, progresoEje, resumenMes, TITULO_EJE } from '@/lib/progreso';

const OCASION: Record<string, string> = {
  entrevista: 'entrevista',
  cita: 'cita',
  negocios: 'reunión de negocios',
  amigos: 'salida con amigos',
  cena: 'cena formal',
  vacaciones: 'día de vacaciones',
};

const CARD = 'mt-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]';

function mesSiguiente(mes: string): string {
  const [a, m] = mes.split('-').map(Number);
  return m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, '0')}`;
}

export default function MesConNiki() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const { mes } = useParams<{ mes: string }>();
  const valido = /^\d{4}-\d{2}$/.test(mes);
  const { checks, error, reintentar } = useChecksProgreso();

  const volver = (
    <Link href="/app/progreso" className="-ml-2 flex w-fit items-center gap-1 px-2 py-3 text-[14px] font-semibold text-[var(--text-primary)]">
      <ChevronLeft size={18} aria-hidden="true" />
      Progreso
    </Link>
  );

  if (error) {
    return (
      <div className="flex flex-1 flex-col pt-2">
        {volver}
        <p className="mt-6 text-[15px] text-[var(--text-primary)]">No pudimos cargar tu resumen. Revisa tu conexión.</p>
        <button type="button" onClick={reintentar} className="mt-4 h-12 w-fit rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-[16px] font-semibold text-[var(--bg)]">
          Reintentar
        </button>
      </div>
    );
  }

  if (checks === null) {
    return (
      <div className="flex flex-1 flex-col items-center gap-3 pt-8" aria-busy="true">
        <div className="size-24 animate-pulse rounded-full bg-[var(--surface-2)]" />
        <div className="h-40 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="h-24 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const r = valido ? resumenMes(checks, mes) : null;
  if (!r) {
    return (
      <div className="flex flex-1 flex-col pt-2">
        {volver}
        <p className="mt-6 text-[15px] text-[var(--text-primary)]">No hay Checks en ese mes, así que todavía no hay resumen.</p>
      </div>
    );
  }

  const nombre = nombreMes(mes);
  const siguiente = nombreMes(mesSiguiente(mes)).toLowerCase();
  const hayComparacion = r.porEje.some((e) => e.antes !== null);
  const titulo = hayComparacion
    ? r.subio > 0
      ? `${nombre}: subiste en ${r.subio} de 3`
      : `${nombre}: sostuviste tu nivel`
    : `${nombre}: tu primer mes`;
  // Del mes que acaba de cerrar, el foco es el de HOY (el mismo de Progreso y de la misión).
  const esUltimoCerrado = mes === mesAnterior(mesDe(new Date().toISOString()));
  const foco = esUltimoCerrado ? ejeFoco(EJES.map((e) => progresoEje(checks, e))) : r.foco;
  const nivelFoco = foco ? progresoEje(checks, foco).nivel : null;
  const probadas = new Set(checks.map((c) => c.ocasion));
  const ocasionNueva = esUltimoCerrado ? (OCASIONES_RETO.find((o) => !probadas.has(o)) ?? null) : r.ocasionNueva;

  function empezar() {
    try {
      localStorage.setItem(`niki_resumen_visto_${mes}`, '1');
    } catch {
      // Storage bloqueado: el aviso puede volver a salir, no pasa nada más.
    }
    router.push('/app');
  }

  const aparece = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="flex flex-1 flex-col pt-2">
      {volver}
      <motion.img
        src="/iconos/niki-celebrando.webp"
        alt=""
        aria-hidden="true"
        width={104}
        height={104}
        className="mx-auto size-26 drop-shadow-[0_6px_12px_rgba(60,36,18,0.22)]"
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 16 }}
      />
      <motion.h1 {...aparece(1)} className="mt-2 text-balance text-center text-[24px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {titulo}
      </motion.h1>
      <motion.p {...aparece(1)} className="mt-1 text-center text-[14px] text-[var(--text-secondary)]">
        {r.total === 1 ? '1 Check este mes' : `${r.total} Checks este mes`}
      </motion.p>

      <motion.section {...aparece(2)} className={CARD} aria-label="Tus ejes este mes">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-2 text-[15px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">Eje</span>
          <span className="text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">{hayComparacion ? 'Antes' : ''}</span>
          <span className="text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">{nombre.slice(0, 3)}</span>
          {r.porEje.map((e) => (
            <div key={e.eje} className="contents">
              <span className="text-[var(--text-primary)]">{TITULO_EJE[e.eje]}</span>
              <span className="text-right tabular-nums text-[var(--text-secondary)] [font-family:var(--font-display)]">{e.antes?.toFixed(1) ?? ''}</span>
              <span
                className={`text-right font-bold tabular-nums [font-family:var(--font-display)] ${e.antes !== null && e.ahora > e.antes ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}
              >
                {e.ahora.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
        {r.nivelesNuevos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {r.nivelesNuevos.map((n) => (
              <span
                key={n.eje}
                className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--accent-2)_30%,var(--surface))] px-3 py-1 text-[12px] font-bold text-[var(--text-primary)]"
              >
                <Star size={14} aria-hidden="true" />
                Nuevo nivel: {TITULO_EJE[n.eje]} {n.nivel}
              </span>
            ))}
          </div>
        )}
      </motion.section>

      {r.mejor && (
        <motion.section {...aparece(3)} className={CARD} aria-label="Tu mejor momento">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu mejor momento</p>
          <p className="mt-1 text-[16px] font-semibold text-[var(--text-primary)]">
            {r.mejor.puntaje.toFixed(1)} en tu {OCASION[r.mejor.ocasion] ?? r.mejor.ocasion} del{' '}
            {new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(r.mejor.created_at))}
          </p>
        </motion.section>
      )}

      {foco && (
        <motion.section {...aparece(4)} className="mt-3 rounded-[var(--radius-card)] border-2 border-[var(--accent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]" aria-label={`Tu foco de ${siguiente}`}>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Tu foco de {siguiente}</p>
          <p className="mt-1 text-[16px] font-semibold leading-[1.35] text-[var(--text-primary)]">
            {TITULO_EJE[foco]} nivel {Math.min(10, (nivelFoco ?? 1) + 1)}
            {ocasionNueva && ` + tu primer Check de ${OCASION[ocasionNueva]}`}
          </p>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Un reto nuevo para que tu progreso no se detenga.</p>
        </motion.section>
      )}

      <motion.button
        {...aparece(5)}
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={empezar}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
      >
        Empezar mi mes
      </motion.button>
    </div>
  );
}
