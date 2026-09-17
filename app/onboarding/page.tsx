'use client';

// ONBOARDING DE NIKI — Paso 2 de la secuencia maestra.
// Estrategia: 02B-ONBOARDING-Y-PAYWALL.md (5 trabajos + 7 reglas) · Blueprints
// visuales: 50-DISENO-ONBOARDING-PAYWALL.md (A1-A6, B). Preguntas derivadas de
// FICHA-AVATAR.md (nunca inventadas) — trazabilidad en cada bloque de abajo.
//
// Modelo 2 (onboarding-first, variante anónima — ESTADO.md): sin registro aquí.
// El resultado al final es un MOCKUP HONESTO (19/50 §C3ter): no hay IA conectada
// todavía (pendiente, Sesión de servicios externos) — el preview se rotula como
// ejemplo, nunca se presenta como el análisis real de la foto del usuario.

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  Briefcase,
  Heart,
  Handshake,
  Users,
  UtensilsCrossed,
  Palmtree,
  Shirt,
  Move,
  Eye,
  HelpCircle,
  Smartphone,
  MessageCircleQuestion,
  ScanSearch,
  Ban,
  Sunrise,
  Sun,
  Moon,
  CalendarClock,
  Camera,
  ImageUp,
  Lock,
  Check,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
   DATOS DE LAS PREGUNTAS — cada una trazada a un campo de FICHA-AVATAR.md
   ──────────────────────────────────────────────────────────────────────── */

type Opcion = { valor: string; label: string; icon: LucideIcon };

const OCASIONES: Opcion[] = [
  { valor: 'entrevista', label: 'Entrevista de trabajo', icon: Briefcase },
  { valor: 'cita', label: 'Primera cita', icon: Heart },
  { valor: 'negocios', label: 'Reunión de negocios', icon: Handshake },
  { valor: 'amigos', label: 'Salida con amigos', icon: Users },
  { valor: 'cena', label: 'Cena formal', icon: UtensilsCrossed },
  { valor: 'vacaciones', label: 'Vacaciones', icon: Palmtree },
];

// Dolor #1 y #2 de FICHA-AVATAR.md ("mi ropa se ve rara y nadie me lo dice" /
// "no tengo idea de cómo combinar mi ropa" / dolor #4 "mi postura transmite debilidad")
const DOLORES: Opcion[] = [
  { valor: 'outfit', label: 'No sé si mi outfit combina', icon: Shirt },
  { valor: 'postura', label: 'Mi postura se ve insegura', icon: Move },
  { valor: 'actitud', label: 'No sé qué transmite mi mirada', icon: Eye },
  { valor: 'todo', label: 'Un poco de todo', icon: HelpCircle },
];

// Objeción de la ficha: "ya intentó... y lo abandonó porque" (videos genéricos,
// amigos que mienten por cortesía, apps de rating crueles tipo Umax)
const INTENTOS: Opcion[] = [
  { valor: 'redes', label: 'Videos de TikTok o Instagram', icon: Smartphone },
  { valor: 'amigos', label: 'Preguntarle a mis amigos', icon: MessageCircleQuestion },
  { valor: 'apps', label: 'Apps de rating tipo Umax', icon: ScanSearch },
  { valor: 'nada', label: 'Nada todavía', icon: Ban },
];

// Pregunta de anclaje contextual (siempre va, 02B): fija la hora de notificación.
const MOMENTOS: Opcion[] = [
  { valor: 'manana', label: 'Mañana temprano', icon: Sunrise },
  { valor: 'tarde', label: 'En la tarde', icon: Sun },
  { valor: 'antes-evento', label: 'Justo antes del evento', icon: Moon },
  { valor: 'sin-horario', label: 'No tengo horario fijo', icon: CalendarClock },
];

const RECONOCIMIENTO_DOLOR: Record<string, string> = {
  outfit: 'Nadie te enseñó a leer tu propio armario, y tus amigos solo dicen "te ves bien" por compromiso. El Check de Presencia te lo dice claro.',
  postura: 'La postura es difícil de corregir sola: no te ves desde afuera en el momento. El Check de Presencia te muestra exactamente qué ajustar.',
  actitud: 'La mirada es lo que menos feedback recibe — nadie te dice "baja los hombros" en el espejo. Eso es justo lo que el Check de Presencia sí te dice.',
  todo: 'Cuando es "un poco de todo", el problema no es tu ropa: es no tener una retroalimentación honesta. Eso es lo que hace el Check de Presencia.',
};

/* ────────────────────────────────────────────────────────────────────────
   PIEZAS COMPARTIDAS
   ──────────────────────────────────────────────────────────────────────── */

function BarraProgreso({ pct }: { pct: number }) {
  return (
    <div
      className="h-[3px] w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full bg-[var(--accent)]"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function Encabezado({ pct, onAtras, mostrarAtras }: { pct: number; onAtras: () => void; mostrarAtras: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-[max(16px,env(safe-area-inset-top))]">
      <button
        type="button"
        onClick={onAtras}
        aria-label="Volver a la pregunta anterior"
        className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] ${
          mostrarAtras ? '' : 'invisible'
        }`}
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <BarraProgreso pct={pct} />
      <Link
        href="/"
        aria-label="Salir del Check de Presencia"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"
      >
        <X size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}

function ChipOpcion({
  opcion,
  seleccionado,
  onSeleccionar,
}: {
  opcion: Opcion;
  seleccionado: boolean;
  onSeleccionar: () => void;
}) {
  const Icono = opcion.icon;
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onSeleccionar}
      className={`flex h-14 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left transition-colors ${
        seleccionado
          ? 'border-[var(--accent)] bg-[var(--chip-bg)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
      }`}
    >
      <Icono size={22} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
      <span className="flex-1 text-[16px] font-medium text-[var(--text-primary)]">{opcion.label}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
        >
          <Check size={13} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
        </motion.span>
      )}
    </motion.button>
  );
}

/** Pantalla de pregunta de selección única (A1-A3 de 50): auto-avanza a los 300ms. */
function PantallaPregunta({
  pregunta,
  microCopy,
  opciones,
  onElegir,
}: {
  pregunta: string;
  microCopy?: string;
  opciones: Opcion[];
  onElegir: (valor: string) => void;
}) {
  const [elegido, setElegido] = useState<string | null>(null);
  const reduce = useReducedMotion();

  function elegir(valor: string) {
    if (elegido) return; // bloquea doble-tap durante la pausa
    setElegido(valor);
    setTimeout(() => onElegir(valor), reduce ? 0 : 300);
  }

  return (
    <div className="pt-8">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {pregunta}
      </h1>
      {microCopy && <p className="mt-2 text-[14px] text-[var(--text-secondary)]">{microCopy}</p>}
      <div className="mt-8 flex flex-col gap-3">
        {opciones.map((op, i) => (
          <motion.div
            key={op.valor}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.04 }}
          >
            <ChipOpcion opcion={op} seleccionado={elegido === op.valor} onSeleccionar={() => elegir(op.valor)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Pantalla de reconocimiento (A5 de 50): un solo CTA, recompensa, no decisión. */
function PantallaReconocimiento({
  icon: Icono,
  titulo,
  texto,
  ctaLabel = 'Continuar',
  onContinuar,
}: {
  icon: LucideIcon;
  titulo: string;
  texto: string;
  ctaLabel?: string;
  onContinuar: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col justify-between pt-8">
      <div className="flex flex-col items-center pt-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <Icono size={30} color="var(--accent)" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {titulo}
        </h1>
        <p className="mt-4 max-w-[320px] text-[16px] leading-[1.5] text-[var(--text-secondary)]">{texto}</p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onContinuar}
        className="mt-10 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)]"
      >
        {ctaLabel}
      </motion.button>
    </div>
  );
}

/** Pantalla de compromiso (A6 de 50): slider con feedback contextual. */
function PantallaFrecuencia({ valor, onFijar }: { valor: number; onFijar: (v: number) => void }) {
  const [n, setN] = useState(valor);
  const feedback = n <= 2 ? 'Para empezar suave — cualquier ritmo cuenta' : n <= 5 ? 'Un ritmo realista para ver cambios' : 'Ambicioso — te acompañamos igual';

  return (
    <div className="pt-8">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Cuántas veces por semana quieres tu <span className="text-[var(--accent)]">Check de Presencia</span>?
      </h1>
      <div className="mt-10 flex flex-col items-center">
        <span className="text-[44px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {n}
        </span>
        <span className="text-[14px] text-[var(--text-secondary)]">veces por semana</span>
        <input
          type="range"
          min={1}
          max={7}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="mt-6 w-full accent-[var(--accent)]"
          aria-label="Veces por semana"
        />
        <div className="mt-1 flex w-full justify-between text-[12px] text-[var(--text-tertiary)]">
          <span>1</span>
          <span>7</span>
        </div>
        <p className="mt-4 text-[14px] font-medium text-[var(--accent)]">{feedback}</p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => onFijar(n)}
        className="mt-10 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)]"
      >
        Fijar mi meta
      </motion.button>
    </div>
  );
}

/** Pantalla de foto (B de 50, la ACTIVACIÓN real — primera acción de valor).
    Honesto: sin IA conectada todavía (ESTADO.md), por eso hay opción de foto
    de ejemplo — nunca se finge analizar una foto real sin backend. */
function PantallaFoto({ onListo }: { onListo: (tieneFotoReal: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="pt-8">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Sube tu <span className="text-[var(--accent)]">foto de cuerpo entero</span>
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
        Tu foto nunca se guarda ni se comparte — se procesa solo para tu resultado.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-8 flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-[var(--surface)] px-8 overflow-hidden"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Tu foto seleccionada" className="h-full w-full object-cover" />
        ) : (
          <>
            <Camera size={28} color="var(--text-secondary)" aria-hidden="true" />
            <p className="max-w-[36ch] text-center text-[14px] font-medium text-[var(--text-secondary)]">
              Toca para elegir una foto de tu galería
            </p>
          </>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={onArchivo} className="hidden" />

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={!preview}
        onClick={() => onListo(true)}
        className="mt-6 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] disabled:opacity-40"
      >
        Continuar con esta foto
      </motion.button>
      <button
        type="button"
        onClick={() => onListo(false)}
        className="mt-4 flex w-full items-center justify-center gap-2 text-[14px] font-medium text-[var(--text-tertiary)]"
      >
        <ImageUp size={16} aria-hidden="true" />
        Prefiero ver un ejemplo primero
      </button>
    </div>
  );
}

/** Pantalla de loading (B de 50): labor illusion, líneas personalizadas reales. */
function PantallaCargando({ lineas, onListo }: { lineas: string[]; onListo: () => void }) {
  const [activo, setActivo] = useState(0);
  const reduce = useReducedMotion();
  const pct = Math.round(((activo + 1) / lineas.length) * 100);

  useEffect(() => {
    if (activo >= lineas.length - 1) {
      const t = setTimeout(onListo, reduce ? 300 : 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActivo((a) => a + 1), reduce ? 200 : 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center pt-8" aria-live="polite" aria-busy="true">
      <div className="relative flex size-28 items-center justify-center">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r="48" fill="none" stroke="color-mix(in oklab, var(--accent) 14%, transparent)" strokeWidth="9" />
          <motion.circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={301.6}
            animate={{ strokeDashoffset: 301.6 * (1 - pct / 100) }}
            transition={{ duration: 0.4 }}
          />
        </svg>
        <span className="absolute text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {pct}%
        </span>
      </div>
      <h2 className="mt-6 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Construyendo tu <span className="text-[var(--accent)]">Check de Presencia</span>…
      </h2>
      <ul className="mt-8 flex w-full flex-col gap-3">
        {lineas.map((l, i) => (
          <li key={i} className={`flex items-center gap-3 text-[15px] ${i <= activo ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] opacity-40'}`}>
            {i < activo ? (
              <Check size={18} color="var(--accent)" aria-hidden="true" />
            ) : i === activo ? (
              <motion.span
                animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="size-2 rounded-full bg-[var(--accent)]"
              />
            ) : (
              <span className="size-2 rounded-full border border-[var(--text-tertiary)]" />
            )}
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pantalla de resultado: MOCKUP HONESTO — sin IA conectada, se rotula como
    ejemplo (19/50 §C3ter), nunca como análisis real de la foto subida. */
function PantallaResultado({ ocasionLabel }: { ocasionLabel: string }) {
  return (
    <div className="pt-8 text-center">
      <span className="inline-block rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
        Vista previa · resultado de ejemplo
      </span>
      <h1 className="mt-4 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Así se va a ver tu <span className="text-[var(--accent)]">Check de Presencia</span>
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Para tu {ocasionLabel.toLowerCase()}</p>

      <div className="relative mx-auto mt-8 w-full max-w-[300px] rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-6">
        <div className="relative mx-auto flex size-32 items-center justify-center">
          <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
            <circle cx="64" cy="64" r="54" fill="none" stroke="color-mix(in oklab, var(--accent) 16%, transparent)" strokeWidth="10" />
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={339.3}
              strokeDashoffset={339.3 * 0.18}
            />
          </svg>
          <span className="absolute text-[30px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
            82%
          </span>
        </div>
        <p className="mt-2 text-[13px] font-semibold text-[var(--text-secondary)]">presencia (ejemplo)</p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {['Outfit', 'Postura', 'Actitud'].map((eje) => (
            <div key={eje} className="rounded-[var(--radius-button)] bg-[var(--bg)] p-3">
              <p className="text-[11px] text-[var(--text-tertiary)]">{eje}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Lock size={13} color="var(--text-tertiary)" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--surface)_35%,transparent)]" />
      </div>

      <p className="mx-auto mt-6 max-w-[320px] text-[14px] leading-[1.5] text-[var(--text-secondary)]">
        Tus 3 ajustes reales se desbloquean con tu primer Check de Presencia — hecho con tus propias respuestas, no un ejemplo genérico.
      </p>

      <Link
        href="/paywall"
        className="mt-8 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)]"
      >
        Ver mi plan completo
      </Link>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   MÁQUINA DE PASOS
   ──────────────────────────────────────────────────────────────────────── */

type PasoId =
  | 'ocasion'
  | 'dolor'
  | 'reconocimiento1'
  | 'intentos'
  | 'momento'
  | 'frecuencia'
  | 'reconocimiento2'
  | 'foto'
  | 'cargando'
  | 'resultado';

const ORDEN: PasoId[] = ['ocasion', 'dolor', 'reconocimiento1', 'intentos', 'momento', 'frecuencia', 'reconocimiento2', 'foto', 'cargando', 'resultado'];
// El paso de progreso NO cuenta cargando/resultado (barra llega a 100% al fijar la meta).
const PASOS_CON_PROGRESO = 7;

export default function Onboarding() {
  const [pasoIdx, setPasoIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<{
    ocasion?: string;
    dolor?: string;
    intentos?: string;
    momento?: string;
    frecuencia: number;
  }>({ frecuencia: 3 });

  const paso = ORDEN[pasoIdx];
  const pct = Math.min(8 + (Math.min(pasoIdx, PASOS_CON_PROGRESO) / PASOS_CON_PROGRESO) * 92, 100);

  function avanzar() {
    setPasoIdx((i) => Math.min(i + 1, ORDEN.length - 1));
  }
  function retroceder() {
    setPasoIdx((i) => Math.max(i - 1, 0));
  }

  const ocasionLabel = useMemo(() => OCASIONES.find((o) => o.valor === respuestas.ocasion)?.label ?? 'tu evento', [respuestas.ocasion]);
  const dolorLabel = useMemo(() => DOLORES.find((o) => o.valor === respuestas.dolor)?.label ?? '', [respuestas.dolor]);

  const lineasCarga = [
    `Analizando tu ocasión: ${ocasionLabel}`,
    `Registrando lo que más te frena: ${dolorLabel || 'tu presencia'}`,
    `Calculando tu ruta de ${respuestas.frecuencia} ${respuestas.frecuencia === 1 ? 'vez' : 'veces'} por semana`,
    'Preparando tus primeros 3 ajustes',
  ];

  const mostrarEncabezado = paso !== 'cargando' && paso !== 'resultado';

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden px-5 pb-10 text-[var(--text-primary)] [font-family:var(--font-body)]"
      style={{ background: 'var(--bg-gradient)' }}
    >
      {mostrarEncabezado && <Encabezado pct={pct} onAtras={retroceder} mostrarAtras={pasoIdx > 0} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 flex-col justify-center"
        >
          {paso === 'ocasion' && (
            <PantallaPregunta
              pregunta="¿Para qué ocasión es tu primer Check de Presencia?"
              microCopy="Así ajustamos tus 3 ejes al evento exacto."
              opciones={OCASIONES}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, ocasion: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'dolor' && (
            <PantallaPregunta
              pregunta="¿Qué es lo que más te frena antes de salir?"
              opciones={DOLORES}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, dolor: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'reconocimiento1' && (
            <PantallaReconocimiento
              icon={Shirt}
              titulo="Tiene sentido"
              texto={RECONOCIMIENTO_DOLOR[respuestas.dolor ?? 'todo']}
              onContinuar={avanzar}
            />
          )}

          {paso === 'intentos' && (
            <PantallaPregunta
              pregunta="¿Qué ya intentaste para mejorar tu imagen?"
              opciones={INTENTOS}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, intentos: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'momento' && (
            <PantallaPregunta
              pregunta="¿A qué hora sueles alistarte antes de salir?"
              microCopy="Usamos esto para avisarte en el momento justo."
              opciones={MOMENTOS}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, momento: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'frecuencia' && (
            <PantallaFrecuencia
              valor={respuestas.frecuencia}
              onFijar={(n) => {
                setRespuestas((r) => ({ ...r, frecuencia: n }));
                avanzar();
              }}
            />
          )}

          {paso === 'reconocimiento2' && (
            <PantallaReconocimiento
              icon={Check}
              titulo="Ya vas adelante"
              texto={`Ya identificaste lo que te frena. Tu Check de Presencia queda armado para tu ${ocasionLabel.toLowerCase()}, ${respuestas.frecuencia}x por semana.`}
              ctaLabel="Ver mi Check de Presencia"
              onContinuar={avanzar}
            />
          )}

          {paso === 'foto' && (
            <PantallaFoto
              onListo={() => {
                setPasoIdx(ORDEN.indexOf('cargando'));
              }}
            />
          )}

          {paso === 'cargando' && <PantallaCargando lineas={lineasCarga} onListo={avanzar} />}

          {paso === 'resultado' && <PantallaResultado ocasionLabel={ocasionLabel} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
