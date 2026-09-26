'use client';

// ONBOARDING DE NIKI — Paso 2 de la secuencia maestra.
// Estrategia: 02B-ONBOARDING-Y-PAYWALL.md (5 trabajos + 7 reglas) · Blueprints
// visuales: 50-DISENO-ONBOARDING-PAYWALL.md (A1-A6, B). Preguntas derivadas de
// FICHA-AVATAR.md (nunca inventadas) — trazabilidad en cada bloque de abajo.
//
// v2 (2026-09-17): rediseñado tras comparar contra benchmark de mercado
// (Umax/StyleDNA, Fabulous, apps de proyección) que trajo el usuario. Cambios
// de fondo respecto a v1:
//   - Se comprime a 4 preguntas núcleo (antes 5) siguiendo el benchmark de
//     Umax/StyleDNA (4-6 preguntas) — se retira "qué ya intentaste" (queda
//     cubierto en la landing/FAQ) y "hora del día" (se mueve a Ajustes, ya
//     suscrito, no es núcleo de conversión).
//   - Se retira la pantalla de SUBIR FOTO del onboarding. Regla de oro del
//     benchmark: pedir la foto ANTES del paywall agrega fricción de cámara/
//     galería justo antes de la decisión de pago. La foto pasa a ser la
//     PRIMERA ACCIÓN dentro de la app, ya suscrito (pendiente: Sesión de app
//     interna + IA — ver ESTADO.md).
//   - La pantalla de resultado YA NO muestra un puntaje/score inventado (antes
//     "82%" de ejemplo): mostrar un número que parece un análisis real de una
//     foto que nunca se subió es literalmente lo que Mateo (FICHA-AVATAR)
//     castiga en Umax ("me destroza con un número cruel"/"puntuaciones que no
//     son mías"). En su lugar se muestra el PLAN real (hecho con SUS 4
//     respuestas — regla a de LA ESCALERA, Arkes & Blumer 1985) y los 3 ejes
//     que se desbloquean, sin fingir una puntuación.
//   - Se agrega una pantalla de apertura (hook) antes del quiz — patrón Cal AI
//     (demostrar la promesa antes de pedir nada, peldaño 1 de LA ESCALERA).
//   - NO se agregó prueba social con cifras ("el 91% de los usuarios...") que
//     sugirió el benchmark externo: Niki no tiene usuarios todavía y el SO
//     prohíbe inventar prueba social (19 "PRUEBA SOCIAL EN FRÍO" + 47 "claims
//     publicitarios") — un dato así, sin fuente, quema cuentas de ads y viola
//     la ética del proyecto. Se documenta la decisión aquí a propósito.
//
// Modelo 2 (onboarding-first, variante anónima — ESTADO.md): sin registro aquí.

import { useMemo, useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Hairline } from '@/components/landing/ui';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
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
  Search,
  HelpCircle,
  Sunrise,
  CalendarClock,
  Sparkles,
  Compass,
  Flame,
  Rocket,
  Lock,
  Check,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
   DATOS DE LAS PREGUNTAS — cada una trazada a un campo de FICHA-AVATAR.md
   ──────────────────────────────────────────────────────────────────────── */

type Opcion = { valor: string; label: string; icon: LucideIcon };

// Q1 — objetivo (identidad/deseo): deseo #2 "lucir atractivo y proyectar
// confianza" + deseo #5 "transformación Glow-Up" de FICHA-AVATAR.md.
const OBJETIVOS: Opcion[] = [
  { valor: 'social', label: 'Causar buena impresión en citas y vida social', icon: Heart },
  { valor: 'autoridad', label: 'Proyectar autoridad y confianza en el trabajo', icon: Briefcase },
  { valor: 'glowup', label: 'Un Glow-Up general: estilo, mirada y postura', icon: Sparkles },
  { valor: 'habito', label: 'Mejorar mi imagen personal día con día', icon: Flame },
];

// Q2 — dolor #1, #2 y #4 de FICHA-AVATAR.md, en sus palabras literales.
const DOLORES: Opcion[] = [
  { valor: 'outfit', label: 'No sé si mi outfit combina o parece disfraz', icon: Shirt },
  { valor: 'postura', label: 'Me encorvo sin darme cuenta o me veo nervioso', icon: Move },
  { valor: 'actitud', label: 'Nadie es 100% sincero cuando pregunto cómo me veo', icon: Eye },
  { valor: 'todo', label: 'No saber cómo mejorar mi imagen', icon: HelpCircle },
];

// Q3 — las 6 ocasiones ya validadas en la landing/tour de FICHA-ARTE (pedido
// explícito del usuario: mantener las 6, iguales al tour aprobado).
const OCASIONES: Opcion[] = [
  { valor: 'entrevista', label: 'Entrevista de trabajo', icon: Briefcase },
  { valor: 'cita', label: 'Primera cita', icon: Heart },
  { valor: 'negocios', label: 'Reunión de negocios', icon: Handshake },
  { valor: 'amigos', label: 'Salida con amigos', icon: Users },
  { valor: 'cena', label: 'Cena formal', icon: UtensilsCrossed },
  { valor: 'vacaciones', label: 'Vacaciones', icon: Palmtree },
];

// Q4 — pledge de compromiso (peldaño 7 de LA ESCALERA, 02B): un tiempo que la
// app va a usar después, no solo un dato decorativo.
const TIEMPOS: Opcion[] = [
  { valor: 'express', label: '2 minutos cada mañana', icon: Sunrise },
  { valor: 'eventos', label: '5 minutos antes de eventos importantes', icon: CalendarClock },
];

// Mismo mapeo que RECONOCIMIENTO_DOLOR pero para el ícono del badge — antes quedaba
// fijo en Shirt sin importar el dolor elegido, mientras el texto SÍ se personalizaba.
const DOLOR_ICONO: Record<string, LucideIcon> = {
  outfit: Shirt,
  postura: Move,
  actitud: Eye,
  todo: HelpCircle,
};

const RECONOCIMIENTO_DOLOR: Record<string, string> = {
  outfit: 'Nadie te enseñó a leer tu propio armario, y tus amigos solo dicen "te ves bien" por compromiso. El Check de Presencia te lo dice claro.',
  postura: 'La postura es difícil de corregir por tu cuenta: no te ves desde afuera en el momento. El Check de Presencia te muestra exactamente qué ajustar.',
  actitud: 'La mirada es lo que menos feedback recibe — nadie te dice "baja los hombros" en el espejo. Eso es justo lo que el Check de Presencia sí te dice.',
  todo: 'Cuando es "un poco de todo", el problema no es tu ropa: es no tener una retroalimentación honesta. Eso es lo que hace el Check de Presencia.',
};

// Ejemplo del TONO del feedback (objeción #3 de FICHA-AVATAR: "consejos genéricos
// de robot"; #4: "nota cruel"). Se rotula como ejemplo: no es un análisis del
// usuario ni un puntaje — solo muestra cómo habla Niki para la ocasión elegida.
const EJEMPLO_AJUSTE: Record<string, string> = {
  entrevista: 'Tu outfit se ve profesional, pero los hombros caen hacia adelante. Llévalos atrás antes de entrar y tu presencia sube al instante.',
  cita: 'Ese color te ilumina la cara, buena elección. Suelta un botón o remanga la prenda: se verá relajado sin perder estilo.',
  negocios: 'Los tonos neutros te dan autoridad. Mantén la barbilla paralela al piso cuando hables: transmite seguridad sin esfuerzo.',
  amigos: 'Tu look se ve cómodo y actual. Unos tenis limpios de color claro lo suben un nivel sin cambiar nada más.',
  cena: 'El corte te queda bien de hombros. Si el pantalón arruga en el tobillo, acórtalo un poco: se verá hecho a tu medida.',
  vacaciones: 'Los colores claros te favorecen con sol. Una camisa ligera abierta sobre la playera se ve más pensada y fresca.',
};

const CLAVE_BORRADOR = 'niki_onboarding_borrador';

// Lee el borrador sin romper la hidratación: en el servidor no hay borrador.
function suscribirStorage(avisar: () => void) {
  window.addEventListener('storage', avisar);
  return () => window.removeEventListener('storage', avisar);
}
function leerBorradorCrudo(): string | null {
  try {
    return localStorage.getItem(CLAVE_BORRADOR);
  } catch {
    return null;
  }
}

// Versiones cortas para la pantalla de carga (la respuesta completa no cabe en una línea).
const OBJETIVO_CORTO: Record<string, string> = {
  social: 'citas y vida social',
  autoridad: 'autoridad en el trabajo',
  glowup: 'Glow-Up general',
  habito: 'mejorar día a día',
};
const DOLOR_CORTO: Record<string, string> = {
  outfit: 'combinar tu outfit',
  postura: 'la postura',
  actitud: 'nadie te dice la verdad',
  todo: 'no saber por dónde empezar',
};

const TIEMPO_LABEL_CORTO: Record<string, string> = {
  express: '2 minutos cada mañana',
  eventos: '5 minutos antes de tus eventos',
};

/* ────────────────────────────────────────────────────────────────────────
   PIEZAS COMPARTIDAS
   ──────────────────────────────────────────────────────────────────────── */

/** Marca "Anillo Niki" (FICHA-ARTE: arco abierto + punto de luz en su extremo) +
    wordmark — misma marca confirmada del logo, visible arriba a la izquierda en
    todo el recorrido para dar identidad de marca (antes solo aparecía en el Tour). */
/** Logo confirmado en FICHA-ARTE.md: el Anillo Niki sobre su chip con degradé
    atardecer (no el trazo suelto que se usaba antes) + la línea de qué es Niki. */
function MarcaNiki({ conLema = true }: { conLema?: boolean }) {
  return (
    <div className="flex items-center gap-2 pt-[max(16px,env(safe-area-inset-top))]">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-[8px]"
        style={{ background: 'linear-gradient(160deg, var(--sunset-1) 0%, var(--sunset-2) 100%)' }}
      >
        <svg width="16" height="16" viewBox="0 0 52 52" fill="none" aria-hidden="true">
          <circle
            cx="26"
            cy="26"
            r="19"
            stroke="var(--gold-text)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="119.4"
            strokeDashoffset="28"
            transform="rotate(-90 26 26)"
          />
          <circle cx="26" cy="7.2" r="5" fill="var(--gold-text)" />
        </svg>
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[16px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">niki</span>
        {conLema && <span className="text-[12px] font-medium text-[var(--text-primary)]">Tu Check de Presencia antes de salir</span>}
      </div>
    </div>
  );
}

function BarraProgreso({ pct }: { pct: number }) {
  const reduce = useReducedMotion();
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
        transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/** Porcentaje héroe que cuenta en vez de saltar (baseline #2). */
function ConteoPct({ valor, reduce }: { valor: number; reduce: boolean }) {
  const mv = useMotionValue(0);
  const texto = useTransform(mv, (v) => `${Math.round(v)}%`);
  useEffect(() => {
    if (reduce) {
      mv.set(valor);
      return;
    }
    const control = animate(mv, valor, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    return () => control.stop();
  }, [valor, reduce, mv]);
  return <motion.span>{texto}</motion.span>;
}

/** Hoja de confirmación al salir: el borrador queda guardado para retomar. */
function HojaSalida({ onSeguir }: { onSeguir: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-end justify-center bg-[color-mix(in_oklab,var(--text-primary)_40%,transparent)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
      onClick={onSeguir}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-salida"
        className="w-full max-w-[480px] rounded-t-[var(--radius-card)] bg-[var(--surface)] px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 text-center shadow-[var(--shadow-2)]"
        initial={{ y: reduce ? 0 : 40 }}
        animate={{ y: 0 }}
        exit={{ y: reduce ? 0 : 40 }}
        transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Escape cierra; Tab queda atrapado entre los controles de la hoja.
          if (e.key === 'Escape') {
            onSeguir();
            return;
          }
          if (e.key !== 'Tab') return;
          const focos = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, a[href]'));
          const primero = focos[0];
          const ultimo = focos[focos.length - 1];
          if (e.shiftKey && document.activeElement === primero) {
            e.preventDefault();
            ultimo?.focus();
          } else if (!e.shiftKey && document.activeElement === ultimo) {
            e.preventDefault();
            primero?.focus();
          }
        }}
      >
        <h2 id="titulo-salida" className="text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿Salir de tu Check de Presencia?
        </h2>
        <p className="mt-2 text-[14px] text-[var(--text-primary)]">Guardamos tus respuestas en este celular: cuando vuelvas, sigues donde te quedaste.</p>
        <motion.button
          type="button"
          autoFocus
          whileTap={{ scale: 0.97 }}
          onClick={onSeguir}
          className="mt-6 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)]"
        >
          Seguir con mi Check
        </motion.button>
        <Link href="/" className="mt-2 flex h-12 w-full items-center justify-center text-[14px] font-semibold text-[var(--text-primary)] underline underline-offset-2">
          Salir
        </Link>
      </motion.div>
    </motion.div>
  );
}

function Encabezado({
  pct,
  onAtras,
  mostrarAtras,
  onSalir,
}: {
  pct: number;
  onAtras: () => void;
  mostrarAtras: boolean;
  onSalir: () => void;
}) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <button
        type="button"
        onClick={onAtras}
        aria-label="Volver a la pregunta anterior"
        className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)] ${
          mostrarAtras ? '' : 'invisible'
        }`}
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <BarraProgreso pct={pct} />
      <button
        type="button"
        onClick={onSalir}
        aria-label="Salir del Check de Presencia"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)]"
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

function ChipOpcion({
  opcion,
  seleccionado,
  onSeleccionar,
  apilado = false,
}: {
  opcion: Opcion;
  seleccionado: boolean;
  onSeleccionar: () => void;
  /** true = ícono arriba del texto, para grids de 2 columnas con label corto. */
  apilado?: boolean;
}) {
  const Icono = opcion.icon;

  if (apilado) {
    return (
      <motion.button
        type="button"
        role="radio"
        aria-checked={seleccionado}
        whileTap={{ scale: 0.97, y: 2 }}
        onClick={onSeleccionar}
        className={`relative flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-button)] border border-b-4 px-2 text-center shadow-[var(--shadow-1)] transition-[border-bottom-width,background-color,border-color] duration-150 ${
          seleccionado
            ? 'border-b-2 border-[var(--accent)] bg-[var(--chip-bg)]'
            : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] border-b-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-[var(--surface)]'
        }`}
      >
        <Icono size={22} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
        <span className="text-[13px] font-medium leading-[1.25] text-pretty text-[var(--text-primary)]">{opcion.label}</span>
        {seleccionado && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-2 top-2 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
          >
            <Check size={13} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
          </motion.span>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={seleccionado}
      whileTap={{ scale: 0.97 }}
      onClick={onSeleccionar}
      className={`flex h-14 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left shadow-[var(--shadow-1)] transition-colors ${
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

/** Pantalla de apertura (hook, peldaño 1 de LA ESCALERA — 02B): demuestra la
    promesa antes de pedir nada, mismo patrón que Cal AI. */
function PantallaApertura({
  onIniciar,
  textoRetomar,
  onEmpezarDeNuevo,
}: {
  onIniciar: () => void;
  /** Texto del botón cuando hay un recorrido a medias; null si no hay. */
  textoRetomar: string | null;
  onEmpezarDeNuevo: () => void;
}) {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center pt-8 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iconos/banner-bienvenidos.png"
        alt="¡Bienvenidos!"
        className="w-full max-w-[280px] rounded-[var(--radius-card)] shadow-[var(--shadow-2)]"
      />
      <h1 className="mt-6 text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
¡Tu <span className="text-[var(--accent)]">Check de Presencia</span> antes de salir!
      </h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/iconos/icono-7-carita-apertura.gif" alt="" aria-hidden="true" className="mt-4 size-20" />
      <p className="mt-4 max-w-[320px] text-balance text-[16px] leading-[1.5] text-[var(--text-primary)]">
        Nadie te dice la verdad por pena. En 4 preguntas armamos tu Check; después, cada foto te dice en 30 segundos qué ajustar.
      </p>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onIniciar}
        className="mt-10 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)]"
      >
        {textoRetomar ?? 'Iniciar mi Check de Presencia'}
      </motion.button>
      {textoRetomar && (
        <button
          type="button"
          onClick={onEmpezarDeNuevo}
          className="mt-2 flex min-h-11 items-center text-[14px] font-semibold text-[var(--text-primary)] underline underline-offset-2"
        >
          Empezar de nuevo
        </button>
      )}
      <p className="mt-3 text-[12px] text-[var(--text-primary)]">Tus fotos son privadas: solo tú las ves.</p>
    </div>
  );
}

/** Pantalla de pregunta de selección única (A1-A3 de 50): auto-avanza a los 300ms.
    `columnas=2` se usa cuando hay >4 opciones (gate de carga cognitiva del SO: listas
    largas se agrupan en grid en vez de forzar scroll de una columna). */
function PantallaPregunta({
  pregunta,
  microCopy,
  opciones,
  onElegir,
  columnas = 1,
  icon: Icono,
  notaAyuda,
}: {
  pregunta: string;
  microCopy?: string;
  opciones: Opcion[];
  onElegir: (valor: string) => void;
  columnas?: 1 | 2;
  /** Ícono temático sobre el título — mismo patrón de badge que apertura/reconocimiento,
      da consistencia entre pantallas y llena el tope de las preguntas cortas. */
  icon?: LucideIcon;
  /** Ayuda contextual bajo las opciones (heurística 10) — contenido real, no relleno,
      para las preguntas con pocas opciones (2-3) que dejan espacio libre debajo. */
  notaAyuda?: string;
}) {
  const [elegido, setElegido] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const grupoRef = useRef<HTMLDivElement>(null);

  function elegir(valor: string) {
    if (elegido) return; // bloquea doble-tap durante la pausa
    setElegido(valor);
    setTimeout(() => onElegir(valor), reduce ? 0 : 300);
  }

  // Navegación por teclado (flechas + Home/End) entre las opciones — heurística 7.
  function onKeyDownGrupo(e: React.KeyboardEvent<HTMLDivElement>) {
    const botones = Array.from(grupoRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const actual = botones.indexOf(document.activeElement as HTMLButtonElement);
    if (actual === -1) return;
    const avanza = ['ArrowDown', 'ArrowRight'].includes(e.key);
    const retrocede = ['ArrowUp', 'ArrowLeft'].includes(e.key);
    if (avanza || retrocede) {
      e.preventDefault();
      const siguiente = avanza ? (actual + 1) % botones.length : (actual - 1 + botones.length) % botones.length;
      botones[siguiente]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      botones[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      botones[botones.length - 1]?.focus();
    }
  }

  return (
    <div className="pt-8">
      <div className="flex flex-col items-center text-center">
        {Icono && (
          <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <Icono size={22} color="var(--accent)" aria-hidden="true" />
          </span>
        )}
        <h1 className={`text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]`}>
          {pregunta}
        </h1>
        {microCopy && <p className="mt-2 text-[14px] text-[var(--text-primary)]">{microCopy}</p>}
      </div>
      <div
        ref={grupoRef}
        role="radiogroup"
        onKeyDown={onKeyDownGrupo}
        className={
          columnas === 2
            ? 'mt-8 grid grid-cols-2 gap-3 [&>*:last-child:nth-child(odd)]:col-span-2'
            : 'mt-8 flex flex-col gap-3'
        }
      >
        {opciones.map((op, i) => (
          <motion.div
            key={op.valor}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.06 }}
          >
            <ChipOpcion
              opcion={op}
              seleccionado={elegido === op.valor}
              onSeleccionar={() => elegir(op.valor)}
              apilado={columnas === 2}
            />
          </motion.div>
        ))}
      </div>
      {notaAyuda && (
        <p className="mx-auto mt-8 max-w-[280px] text-center text-[13px] leading-[1.5] text-[var(--text-primary)]">
          {notaAyuda}
        </p>
      )}
    </div>
  );
}

/** Pantalla de reconocimiento (A5 de 50): un solo CTA, recompensa, no decisión. */
function PantallaReconocimiento({
  icon: Icono,
  iconoSrc,
  titulo,
  texto,
  ctaLabel = 'Seguir con mi Check',
  extra,
  onContinuar,
}: {
  icon: LucideIcon;
  /** Ícono propio del usuario (gif/png) — si se pasa, reemplaza al ícono de librería. */
  iconoSrc?: string;
  titulo: string;
  texto: string;
  ctaLabel?: string;
  /** Contenido extra entre el texto y el botón (p. ej. el ejemplo de ajuste). */
  extra?: React.ReactNode;
  onContinuar: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col justify-center pb-16 pt-8">
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18 }}
          className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-[var(--chip-bg)]"
        >
          {iconoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconoSrc} alt="" aria-hidden="true" className="size-7" />
          ) : (
            <Icono size={22} color="var(--accent)" aria-hidden="true" />
          )}
        </motion.span>
        <h1 className="mt-6 text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {titulo}
        </h1>
        <p className="mt-4 max-w-[320px] text-[16px] leading-[1.5] text-[var(--text-primary)]">{texto}</p>
        {extra}
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
            transition={{ duration: reduce ? 0 : 0.4 }}
          />
        </svg>
        <span className="absolute text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          <ConteoPct valor={pct} reduce={!!reduce} />
        </span>
      </div>
      <h2 className="mt-6 text-balance text-center text-[28px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Construyendo tu <span className="text-[var(--accent)]">Check de Presencia</span>…
      </h2>
      <ul className="mt-8 flex w-full flex-col gap-3">
        {lineas.map((l, i) => (
          <li key={i} className={`flex items-center gap-3 text-[15px] ${i <= activo ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
            {i < activo ? (
              <Check size={18} color="var(--accent)" aria-hidden="true" className="shrink-0" />
            ) : i === activo ? (
              <motion.span
                animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mx-[5px] size-2 shrink-0 rounded-full bg-[var(--accent)]"
              />
            ) : (
              <span className="mx-[5px] size-2 shrink-0 rounded-full border border-[var(--text-tertiary)]" />
            )}
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pantalla de resultado: el PLAN real (hecho con sus 4 respuestas — regla a de
    LA ESCALERA), sin puntaje inventado. Los 3 ejes se muestran como lo que
    VA a analizar (honesto), no como un resultado ya calculado de una foto que
    nunca se subió. La foto llega DESPUÉS, ya suscrito (ver nota al inicio). */
function PantallaResultado({
  objetivoLabel,
  ocasionLabel,
  dolorLabel,
  tiempoValor,
}: {
  objetivoLabel: string;
  ocasionLabel: string;
  dolorLabel: string;
  tiempoValor: string;
}) {
  const tiempoLabel = TIEMPO_LABEL_CORTO[tiempoValor] ?? 'tu ritmo';
  const reduce = useReducedMotion();
  return (
    <div className="pb-24 pt-2 text-center">
      <span className="inline-block rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
        Hecho con tus 4 respuestas
      </span>
      <h1 className="mt-4 text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¡Tu <span className="text-[var(--accent)]">Check de Presencia</span> está listo!
      </h1>
      {/* Celebración del hito (baseline #7): la carita entra con un rebote único. */}
      <motion.img
        src="/iconos/carita-resultado.png"
        alt=""
        aria-hidden="true"
        className="mx-auto mt-2 size-12"
        initial={reduce ? false : { scale: 0.5, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 14, delay: 0.15 }}
      />

      <motion.div
        initial={reduce ? false : { scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="mt-5"
      >
        <Hairline emphasis className="px-5 py-3 text-left shadow-[var(--shadow-2)]">
          <FilaPlan label="Tu objetivo" valor={objetivoLabel} />
          <FilaPlan label="Lo que te frena" valor={dolorLabel} />
          <FilaPlan label="Enfocado en" valor={ocasionLabel} />
          <FilaPlan label="Tu hábito" valor={tiempoLabel} ultimo />
        </Hairline>
      </motion.div>

      <p className="mt-6 text-[14px] font-semibold text-[var(--text-primary)]">
        Lo que Niki va a revisar en tu foto:
      </p>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {['Outfit', 'Postura', 'Actitud'].map((eje) => {
          return (
            <li
              key={eje}
              className="flex flex-col items-center gap-2 px-2 py-1"
            >
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-primary)]">
                {eje}
              </span>
              <span className="flex size-8 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                <Lock size={14} color="var(--accent)" aria-label="Se desbloquea al activar tu plan" />
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-center text-[13px] text-[var(--text-primary)]">
        <Flame size={14} color="var(--accent)" aria-hidden="true" className="mr-1 inline-block align-[-2px]" />
        <span>
          Sin notas crueles: cada foto te da 3 ajustes que puedes hacer hoy. Con el plan Anual lo pruebas 3 días gratis y arranca tu racha <span className="font-semibold">Glow-Up</span>.
        </span>
      </p>

      {/* CTA fijo abajo: el paso al plan siempre visible, también en pantallas de 667px. */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[480px] bg-[linear-gradient(to_top,color-mix(in_oklab,var(--sunset-2)_40%,var(--bg))_55%,transparent)] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-6">
      <motion.div whileTap={{ scale: 0.97 }}>
        <Link
          href="/paywall"
          onClick={() => {
            try {
              localStorage.removeItem(CLAVE_BORRADOR);
            } catch {
              // Storage bloqueado: no afecta el paso al plan.
            }
          }}
          className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
        >
          Desbloquear mi Check de Presencia
        </Link>
      </motion.div>
      </div>
    </div>
  );
}

function FilaPlan({ label, valor, ultimo = false }: { label: string; valor: string; ultimo?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${ultimo ? '' : 'border-b border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]'}`}>
      <span className="text-[13px] text-[var(--text-tertiary)]">{label}</span>
      <span className="max-w-[65%] text-right text-[13px] font-semibold text-[var(--text-primary)]">{valor}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   MÁQUINA DE PASOS
   ──────────────────────────────────────────────────────────────────────── */

type PasoId = 'apertura' | 'objetivo' | 'dolor' | 'reconocimiento1' | 'ocasion' | 'tiempo' | 'reconocimiento2' | 'cargando' | 'resultado';

const ORDEN: PasoId[] = ['apertura', 'objetivo', 'dolor', 'reconocimiento1', 'ocasion', 'tiempo', 'reconocimiento2', 'cargando', 'resultado'];
// El progreso arranca en el paso 'objetivo' (índice 1) y llega a 100% en 'reconocimiento2'.
const PRIMER_PASO_CON_PROGRESO = 1;
const PASOS_CON_PROGRESO = 6; // objetivo, dolor, reconocimiento1, ocasion, tiempo, reconocimiento2 (~85%) -> resultado = 100%

export default function Onboarding() {
  const [pasoIdx, setPasoIdx] = useState(0);
  const [confirmarSalida, setConfirmarSalida] = useState(false);
  const reduce = useReducedMotion();
  const [respuestas, setRespuestas] = useState<{
    objetivo?: string;
    dolor?: string;
    ocasion?: string;
    tiempo?: string;
  }>({});

  const paso = ORDEN[pasoIdx];
  const avance = Math.max(0, pasoIdx - PRIMER_PASO_CON_PROGRESO);
  const pct = Math.min(8 + (Math.min(avance, PASOS_CON_PROGRESO) / PASOS_CON_PROGRESO) * 92, 100);

  // El flujo vive en un solo <main> que reemplaza contenido paso a paso: sin este
  // reset, un paso alto (ej. reconocimiento) deja al usuario scrolleado hacia abajo
  // y el siguiente paso (más corto) aparece con el encabezado ya fuera de la vista.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pasoIdx]);

  // Borrador del recorrido: si la persona sale a medias (X o cierra la pestaña),
  // al volver retoma en la última pregunta con sus respuestas. Se descarta al
  // llegar al resultado (ahí ya se guardan las respuestas finales, abajo).
  // Borrador de un recorrido a medias: se lee con useSyncExternalStore (sin
  // desajuste de hidratación) para ofrecer "Retomar" o "Empezar de nuevo".
  const borradorCrudo = useSyncExternalStore(suscribirStorage, leerBorradorCrudo, () => null);
  const borrador = useMemo(() => {
    if (!borradorCrudo) return null;
    try {
      const b = JSON.parse(borradorCrudo) as { pasoIdx?: number; respuestas?: typeof respuestas };
      if (!b.respuestas || typeof b.pasoIdx !== 'number' || b.pasoIdx <= 0) return null;
      return { pasoIdx: Math.min(b.pasoIdx, ORDEN.indexOf('reconocimiento2')), respuestas: b.respuestas };
    } catch {
      return null;
    }
  }, [borradorCrudo]);
  const PREGUNTAS: PasoId[] = ['objetivo', 'dolor', 'ocasion', 'tiempo'];
  const idxCasiListo = ORDEN.indexOf('reconocimiento2');
  const textoRetomar = !borrador
    ? null
    : borrador.pasoIdx >= idxCasiListo
      ? 'Ver mi Check de Presencia'
      : `Retomar mi Check · ${PREGUNTAS.filter((q) => ORDEN.indexOf(q) < borrador.pasoIdx).length} de 4 respondidas`;

  function iniciar() {
    if (borrador) {
      setRespuestas(borrador.respuestas);
      setPasoIdx(borrador.pasoIdx);
      return;
    }
    avanzar();
  }
  function empezarDeNuevo() {
    try {
      localStorage.removeItem(CLAVE_BORRADOR);
    } catch {
      // Storage bloqueado: igual se arranca desde la primera pregunta.
    }
    setRespuestas({});
    avanzar();
  }
  useEffect(() => {
    try {
      // En el resultado se guarda apuntando a "¡Ya casi está!": si sale aquí y vuelve,
      // retoma a un toque del resultado. Se borra al tocar "Desbloquear".
      if (paso === 'resultado') localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ pasoIdx: ORDEN.indexOf('reconocimiento2'), respuestas }));
      else if (pasoIdx > 0) localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ pasoIdx, respuestas }));
    } catch {
      // Navegación privada: el recorrido sigue funcionando, solo no se retoma.
    }
  }, [paso, pasoIdx, respuestas]);

  // El onboarding es anónimo (ocurre ANTES del login) — se guardan las
  // respuestas en localStorage para que el login las escriba en el profile
  // justo después del primer inicio de sesión (ver app/login/page.tsx).
  useEffect(() => {
    if (paso !== 'resultado') return;
    try {
      localStorage.setItem('niki_onboarding_respuestas', JSON.stringify(respuestas));
    } catch {
      // localStorage puede fallar en navegación privada — no bloquea el onboarding.
    }
  }, [paso, respuestas]);

  function avanzar() {
    setPasoIdx((i) => Math.min(i + 1, ORDEN.length - 1));
  }
  function retroceder() {
    // Desde el resultado se vuelve a la pantalla anterior a la carga: repetir la
    // carga simulada al ir hacia atrás no aporta nada.
    setPasoIdx((i) => (ORDEN[i] === 'resultado' ? ORDEN.indexOf('reconocimiento2') : Math.max(i - 1, 0)));
  }

  const objetivoLabel = useMemo(() => OBJETIVOS.find((o) => o.valor === respuestas.objetivo)?.label ?? 'tu presencia', [respuestas.objetivo]);
  const dolorLabel = useMemo(() => DOLORES.find((o) => o.valor === respuestas.dolor)?.label ?? '', [respuestas.dolor]);
  const ocasionLabel = useMemo(() => OCASIONES.find((o) => o.valor === respuestas.ocasion)?.label ?? 'tu evento', [respuestas.ocasion]);

  const lineasCarga = [
    `Leyendo tu objetivo: ${OBJETIVO_CORTO[respuestas.objetivo ?? ''] ?? 'tu presencia'}`,
    `Lo que te frena: ${DOLOR_CORTO[respuestas.dolor ?? ''] ?? 'tu presencia'}`,
    `Ajustando tu Check a: ${ocasionLabel}`,
    `Tu hábito: ${TIEMPO_LABEL_CORTO[respuestas.tiempo ?? 'express']}`,
  ];

  const mostrarEncabezado = paso !== 'apertura' && paso !== 'cargando';

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden px-5 pb-10 text-[var(--text-primary)] [font-family:var(--font-body)]"
      style={{ background: 'var(--bg-gradient)' }}
    >
      {/* Dispositivo ownable (FICHA-ARTE: anillo de progreso) como eco de marca en el
          fondo — da profundidad y llena el espacio libre de las preguntas cortas sin
          competir con el contenido (detrás de todo, sin z-index). */}
      {paso !== 'resultado' && (
      <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full border-[3px] border-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 size-72 rounded-full border-[3px] border-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
      />
      </>
      )}

      <MarcaNiki conLema={paso !== 'apertura'} />
      {mostrarEncabezado && (
        <Encabezado pct={pct} onAtras={retroceder} mostrarAtras={pasoIdx > 0} onSalir={() => setConfirmarSalida(true)} />
      )}
      <AnimatePresence>{confirmarSalida && <HojaSalida onSeguir={() => setConfirmarSalida(false)} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={{ opacity: 0, x: reduce ? 0 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduce ? 0 : -24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 flex-col"
        >
          {paso === 'apertura' && (
            <PantallaApertura onIniciar={iniciar} textoRetomar={textoRetomar} onEmpezarDeNuevo={empezarDeNuevo} />
          )}

          {paso === 'objetivo' && (
            <PantallaPregunta
              pregunta="¿Cuál es tu objetivo principal de presencia?"
              icon={Sparkles}
              opciones={OBJETIVOS}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, objetivo: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'dolor' && (
            <PantallaPregunta
              pregunta="¿Qué te frustra más al vestirte?"
              icon={Search}
              opciones={DOLORES}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, dolor: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'reconocimiento1' && (
            <PantallaReconocimiento
              icon={DOLOR_ICONO[respuestas.dolor ?? 'todo']}
              titulo="No es falta de estilo"
              texto={RECONOCIMIENTO_DOLOR[respuestas.dolor ?? 'todo']}
              onContinuar={avanzar}
            />
          )}

          {paso === 'ocasion' && (
            <PantallaPregunta
              pregunta="¿Para qué momento necesitas a Niki?"
              microCopy="Así ajustamos tus tres ejes de presencia e imagen."
              icon={Compass}
              opciones={OCASIONES}
              columnas={2}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, ocasion: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'tiempo' && (
            <PantallaPregunta
              pregunta="¿Cuánto tiempo quieres dedicar a tus hábitos de presencia e imagen?"
              icon={CalendarClock}
              notaAyuda="La constancia importa más que la duración: por eso elegimos ritmos cortos que sí se pueden cumplir."
              opciones={TIEMPOS}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, tiempo: v }));
                avanzar();
              }}
            />
          )}

          {paso === 'reconocimiento2' && (
            <PantallaReconocimiento
              icon={Rocket}
              iconoSrc="/iconos/icono-4-esperando.gif"
              titulo="¡Ya casi está!"
              texto={`Se acabaron los 20 minutos dudando frente al armario: tu Check para tu ${ocasionLabel.toLowerCase()} ya sabe qué te frena.`}
              ctaLabel="Ver mi Check de Presencia"
              extra={
                <div className="mt-6 w-full rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                    Así te habla Niki · ejemplo
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-primary)]">
                    “{EJEMPLO_AJUSTE[respuestas.ocasion ?? 'entrevista']}”
                  </p>
                </div>
              }
              onContinuar={avanzar}
            />
          )}

          {paso === 'cargando' && <PantallaCargando lineas={lineasCarga} onListo={avanzar} />}

          {paso === 'resultado' && (
            <PantallaResultado
              objetivoLabel={objetivoLabel}
              ocasionLabel={ocasionLabel}
              dolorLabel={dolorLabel || 'Tu presencia'}
              tiempoValor={respuestas.tiempo ?? 'express'}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
