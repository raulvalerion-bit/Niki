'use client';

// PAYWALL DE NIKI — Paso 3 de la secuencia maestra (ESTADO.md).
// Precios: decisión cerrada en FICHA-MERCADO.md/ESTADO.md, NO se tocan sin
// investigación de mercado nueva. Regla de la prueba gratis actualizada a
// pedido del usuario (2026-09-18, benchmark de paywalls de alta conversión
// que trajo el usuario vía Gemini): los 3 días gratis van SOLO en el plan
// Anual — el Mensual cobra desde el primer día, sin prueba. Se evaluaron y
// se descartaron a propósito otras 2 sugerencias del mismo benchmark: bajar
// el precio anual a $49.99 (sin respaldo de mercado propio, se mantiene el
// precio investigado) y agregar estrellas/testimonios (Niki no tiene
// usuarios reales todavía — inventar prueba social está prohibido, ver
// nota igual en app/onboarding/page.tsx).
//
// Copy trazado a FICHA-AVATAR.md: titular = deseo #1 ("saber con 100% de
// certeza que me veo impecable"); beneficios = deseos #1, #3 y #5; nota bajo
// el CTA = objeciones #5 (garantía) y #6 (pago seguro). El monto anual real
// ($107.88) se muestra SIEMPRE — nunca solo el precio mensualizado.
// Garantía de 7 días: FICHA-MERCADO.md §4 (7 > 3 días de prueba, regla del 18).
//
// El botón principal lleva a /login (siguiente paso de la secuencia: Paywall
// → Login/Auth → App interna). El cobro real vía Hotmart se conecta en la
// Sesión de servicios externos — por ahora este botón NO cobra nada.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { X, Sparkles, CalendarClock, Flame, Unlock, CreditCard, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';

type PlanId = 'anual' | 'mensual';

const PLANES: Record<PlanId, { nombre: string; precio: string; valor: number; detalle: string; badge?: string }> = {
  anual: {
    nombre: 'VIP Pro Anual',
    precio: '$8.99',
    valor: 8.99,
    detalle: '$107.88 al año · $0.30 al día · ahorras 40%',
    badge: '3 días gratis',
  },
  mensual: {
    nombre: 'VIP Pro Mensual',
    precio: '$14.99',
    valor: 14.99,
    detalle: 'Se cobra hoy, sin prueba gratis',
  },
};

const ORDEN_PLANES: PlanId[] = ['anual', 'mensual'];

const PASOS_TRIAL = [
  { dia: 'Hoy', texto: 'Acceso completo, $0.00', icon: Unlock },
  { dia: 'Hasta el final del Día 3', texto: 'Si no te convence, cancelas gratis desde Hotmart', icon: ShieldCheck },
  { dia: 'Al terminar el Día 3', texto: 'Se cobran $107.88, solo si te quedas', icon: CreditCard },
];

const BENEFICIOS = [
  { texto: 'Check de Presencia ilimitado antes de cada salida', icon: Sparkles },
  { texto: 'Modo Alto Impacto para tu cita o entrevista', icon: CalendarClock },
  { texto: 'Tu desafío Glow-Up de 21 días, completo', icon: Flame },
];

/** Logo confirmado en FICHA-ARTE.md: el Anillo Niki sobre su chip con degradé
    atardecer + la línea de qué es Niki. */
function MarcaNiki() {
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
        <span className="text-[13px] font-medium text-[var(--text-primary)]">Tus ejes de Presencia e Imagen</span>
      </div>
    </div>
  );
}

/** Precio héroe que cuenta hasta su valor (baseline #2), respetando reduced-motion. */
function ConteoPrecio({ valor }: { valor: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? valor : 0);
  const texto = useTransform(mv, (v) => `$${v.toFixed(2)}`);
  useEffect(() => {
    if (reduce) {
      mv.set(valor);
      return;
    }
    const control = animate(mv, valor, { duration: 0.3, ease: [0.16, 1, 0.3, 1] });
    return () => control.stop();
  }, [valor, reduce, mv]);
  return <motion.span className="tabular-nums">{texto}</motion.span>;
}

function TarjetaPlan({
  id,
  seleccionado,
  onSeleccionar,
  refBoton,
}: {
  id: PlanId;
  seleccionado: boolean;
  onSeleccionar: () => void;
  refBoton: (el: HTMLButtonElement | null) => void;
}) {
  const plan = PLANES[id];
  const contenido = (
    <motion.button
      ref={refBoton}
      type="button"
      role="radio"
      aria-checked={seleccionado}
      tabIndex={seleccionado ? 0 : -1}
      onClick={onSeleccionar}
      whileTap={{ scale: 0.98 }}
      className={`relative flex w-full flex-col rounded-[var(--radius-card)] p-4 text-left transition-colors duration-200 ${
        seleccionado
          ? ''
          : 'border-2 border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--surface)]'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-[var(--text-primary)] px-3 py-1 text-[13px] font-semibold text-[var(--bg)]">
          {plan.badge}
        </span>
      )}
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span
            className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
              seleccionado ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)]'
            }`}
          >
            {seleccionado && <Check size={12} strokeWidth={3} color="var(--bg)" aria-hidden="true" />}
          </span>
          <span className="text-[16px] font-semibold text-[var(--text-primary)]">{plan.nombre}</span>
        </span>
        <span className="text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          <ConteoPrecio valor={plan.valor} />
          <span className="text-[13px] font-medium text-[var(--text-secondary)] [font-family:var(--font-body)]">/mes</span>
        </span>
      </span>
      <span className="mt-1 pl-8 text-[13px] font-medium text-[var(--text-secondary)]">{plan.detalle}</span>
    </motion.button>
  );

  // Hairline degradé (55): solo en el plan elegido — marca la decisión, no decora.
  return seleccionado ? (
    <Hairline emphasis className="shadow-[var(--shadow-1)]">
      {contenido}
    </Hairline>
  ) : (
    contenido
  );
}

export default function Paywall() {
  const [plan, setPlan] = useState<PlanId>('anual');
  const [yendo, setYendo] = useState(false);
  const reduce = useReducedMotion() ?? false;
  const botonesPlan = useRef<Record<PlanId, HTMLButtonElement | null>>({ anual: null, mensual: null });

  // Radiogroup accesible: flechas mueven la selección y el foco (heurística 7).
  function onKeyDownPlanes(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const i = ORDEN_PLANES.indexOf(plan);
    const avanza = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const siguiente = ORDEN_PLANES[(i + (avanza ? 1 : -1) + ORDEN_PLANES.length) % ORDEN_PLANES.length];
    setPlan(siguiente);
    botonesPlan.current[siguiente]?.focus();
  }

  const entrada = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] as const, delay: reduce ? 0 : i * 0.06 },
  });

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden px-5 pb-[calc(128px+env(safe-area-inset-bottom))] text-[var(--text-primary)] [font-family:var(--font-body)]"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <div className="flex items-center justify-between">
        <MarcaNiki />
        <Link
          href="/"
          aria-label="Salir de la pantalla de planes"
          className="mt-[max(16px,env(safe-area-inset-top))] flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)]"
        >
          <X size={20} aria-hidden="true" />
        </Link>
      </div>

      <motion.div {...entrada(0)} className="mt-4 flex flex-col items-center text-center">
        <h1 className="mt-4 text-balance text-[28px] font-bold leading-[1.12] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Sal con la <span className="text-[var(--accent)]">certeza</span> de verte impecable
        </h1>
        <p className="mt-2 max-w-[320px] text-[16px] leading-[1.5] text-[var(--text-primary)]">
          ¿20 minutos frente al armario? Nadie te dice la verdad por pena. Tu <span className="font-semibold">Check de Presencia</span> sí, en 30 segundos.
        </p>
      </motion.div>

      <motion.ul
        {...entrada(1)}
        className="mt-6 flex flex-col gap-2 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--surface)_55%,transparent)] px-4 py-3"
      >
        {BENEFICIOS.map(({ texto, icon: Icono }) => (
          <li key={texto} className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
              <Icono size={18} color="var(--accent)" aria-hidden="true" />
            </span>
            <span className="text-[13px] font-medium leading-[1.4] text-[var(--text-primary)]">{texto}</span>
          </li>
        ))}
      </motion.ul>

      <motion.div
        {...entrada(2)}
        role="radiogroup"
        aria-label="Elige tu plan"
        onKeyDown={onKeyDownPlanes}
        className="mt-6 flex flex-col gap-4"
      >
        {ORDEN_PLANES.map((id) => (
          <TarjetaPlan
            key={id}
            id={id}
            seleccionado={plan === id}
            onSeleccionar={() => setPlan(id)}
            refBoton={(el) => {
              botonesPlan.current[id] = el;
            }}
          />
        ))}
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {plan === 'anual' ? (
          <motion.div
            key="trial"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
          >
            <p className="mb-3 text-[13px] font-semibold text-[var(--text-primary)]">Cómo funciona tu prueba</p>
            {PASOS_TRIAL.map(({ dia, texto, icon: Icono }, i) => (
              <div key={dia} className={`flex items-start gap-3 ${i === 0 ? '' : 'mt-3'}`}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                  <Icono size={15} color="var(--text-primary)" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">{dia}</p>
                  <p className="text-[13px] text-[var(--text-secondary)]">{texto}</p>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            key="mensual"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-[320px] text-center text-[13px] leading-[1.5] text-[var(--text-primary)]"
          >
            Se renueva cada mes · cancelas cuando quieras desde Hotmart.
          </motion.p>
        )}
      </AnimatePresence>

      <nav aria-label="Enlaces legales y de cuenta" className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-[var(--text-primary)]">
        <Link href="/terminos" className="flex min-h-11 items-center underline underline-offset-2">Términos</Link>
        <Link href="/privacidad" className="flex min-h-11 items-center underline underline-offset-2">Privacidad</Link>
        <Link href="/login" className="flex min-h-11 items-center font-semibold text-[var(--text-primary)] underline underline-offset-2">Ya tengo cuenta</Link>
      </nav>

      {/* CTA fijo abajo: siempre visible sin importar el scroll (safe-area incluida). */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[480px] bg-[linear-gradient(to_top,var(--bg)_72%,transparent)] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-6">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            href="/login"
            onClick={() => setYendo(true)}
            aria-busy={yendo}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-center text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
          >
            {yendo ? (
              <>
                <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                Un momento…
              </>
            ) : plan === 'anual' ? (
              'Empezar mis 3 días gratis'
            ) : (
              'Empezar mi mes VIP Pro'
            )}
          </Link>
        </motion.div>
        <p className="mt-3 text-center text-[13px] leading-[1.4] text-[var(--text-primary)]">
          <ShieldCheck size={14} color="var(--text-primary)" aria-hidden="true" className="mr-1 inline-block align-[-2px]" />
          <span className="font-semibold">Garantía del Primer Ajuste Honesto:</span> 7 días, si no te sirve te devolvemos todo · pago seguro con Hotmart
        </p>
      </div>
    </main>
  );
}
