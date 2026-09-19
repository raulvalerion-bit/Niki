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
// El botón principal lleva a /login (siguiente paso de la secuencia: Paywall
// → Login/Auth → App interna). El cobro real vía Hotmart se conecta recién en
// la Sesión de servicios externos (ESTADO.md: "Servicios externos: bloqueados") —
// por ahora este botón NO cobra nada, solo continúa el camino de registro.

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, Check, X, Sparkles, CalendarClock, Flame, Unlock, Bell, CreditCard } from 'lucide-react';

type PlanId = 'anual' | 'mensual';

const PLANES: Record<
  PlanId,
  { nombre: string; precio: string; badge?: string; nota: string }
> = {
  anual: {
    nombre: 'Vip Pro Anual',
    precio: '$8.99',
    badge: '3 días gratis',
    nota: 'Equivale a $0.30 al día · facturado una vez al año · cancela cuando quieras.',
  },
  mensual: {
    nombre: 'Vip Pro Mensual',
    precio: '$14.99',
    nota: 'Se cobra hoy, sin prueba gratis · se renueva cada mes · cancela cuando quieras.',
  },
};

const PASOS_TRIAL = [
  { dia: 'Hoy', texto: 'Acceso completo, $0.00', icon: Unlock },
  { dia: 'Día 2', texto: 'Te avisamos antes de cualquier cobro', icon: Bell },
  { dia: 'Día 3', texto: 'Empieza tu plan Anual, solo si decides quedarte', icon: CreditCard },
];

const BENEFICIOS = [
  { texto: 'Análisis ilimitados', icon: Sparkles },
  { texto: 'Preparación para eventos específicos', icon: CalendarClock },
  { texto: 'Revisar tu racha Glow-Up completa', icon: Flame },
];

/** Logo confirmado en FICHA-ARTE.md: el Anillo Niki sobre su chip con degradé
    atardecer (no el trazo suelto que se usaba antes) + la línea de qué es Niki. */
function MarcaNiki() {
  return (
    <div className="flex items-center gap-2 pt-[max(16px,env(safe-area-inset-top))]">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: 'linear-gradient(160deg, #FF9457 0%, #FFD98A 100%)' }}
      >
        <svg width="16" height="16" viewBox="0 0 52 52" fill="none" aria-hidden="true">
          <circle
            cx="26"
            cy="26"
            r="19"
            stroke="#3C2412"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="119.4"
            strokeDashoffset="28"
            transform="rotate(-90 26 26)"
          />
          <circle cx="26" cy="7.2" r="5" fill="#3C2412" />
        </svg>
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[15px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">niki</span>
        <span className="text-[10px] font-medium text-[var(--text-secondary)]">Tus ejes de Presencia e Imagen</span>
      </div>
    </div>
  );
}

function TarjetaPlan({
  id,
  seleccionado,
  onSeleccionar,
}: {
  id: PlanId;
  seleccionado: boolean;
  onSeleccionar: () => void;
}) {
  const plan = PLANES[id];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={seleccionado}
      onClick={onSeleccionar}
      className={`relative flex w-full flex-col rounded-[var(--radius-card)] border-2 bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)] transition-colors ${
        seleccionado ? 'border-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--bg)]">
          {plan.badge}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <span
            className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
              seleccionado ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)]'
            }`}
          >
            {seleccionado && <Check size={12} strokeWidth={3} color="var(--bg)" aria-hidden="true" />}
          </span>
          <span className="text-[16px] font-semibold text-[var(--text-primary)]">{plan.nombre}</span>
        </span>
        <span className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          {plan.precio}
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">/mes</span>
        </span>
      </div>
      <p className="mt-2 pl-[30px] text-[13px] text-[var(--text-secondary)]">{plan.nota}</p>
    </button>
  );
}

export default function Paywall() {
  const [plan, setPlan] = useState<PlanId>('anual');

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden px-5 pb-10 text-[var(--text-primary)] [font-family:var(--font-body)]"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full border-[3px] border-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 size-72 rounded-full border-[3px] border-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
      />

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

      <div className="mt-4 flex flex-col items-center pt-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <Lock size={26} color="var(--accent)" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¡Desbloquea tus tres ajustes de presencia e imagen!
        </h1>
        <p className="mt-3 max-w-[320px] text-[15px] leading-[1.5] text-[var(--text-primary)]">
          Con VIP Pro accedes a análisis ilimitados, preparación para eventos específicos y revisar tu racha Glow-Up completa.
        </p>
      </div>

      <ul className="mx-auto mt-6 flex w-full max-w-[340px] flex-col gap-2.5">
        {BENEFICIOS.map(({ texto, icon: Icono }) => (
          <li key={texto} className="flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-1)]">
            <Icono size={18} color="var(--accent)" aria-hidden="true" />
            <span className="text-[14px] font-medium text-[var(--text-primary)]">{texto}</span>
          </li>
        ))}
      </ul>

      <div role="radiogroup" aria-label="Elige tu plan" className="mt-8 flex flex-col gap-4">
        <TarjetaPlan id="anual" seleccionado={plan === 'anual'} onSeleccionar={() => setPlan('anual')} />
        <TarjetaPlan id="mensual" seleccionado={plan === 'mensual'} onSeleccionar={() => setPlan('mensual')} />
      </div>

      {plan === 'anual' ? (
        <div className="mx-auto mt-6 w-full max-w-[340px] rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
          {PASOS_TRIAL.map(({ dia, texto, icon: Icono }, i) => (
            <div key={dia} className={`flex items-start gap-3 ${i === 0 ? '' : 'mt-3'}`}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                <Icono size={15} color="var(--accent)" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">{dia}</p>
                <p className="text-[13px] text-[var(--text-secondary)]">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mx-auto mt-6 max-w-[320px] text-center text-[13px] leading-[1.5] text-[var(--text-primary)]">
          El plan Mensual se cobra hoy mismo — la prueba de 3 días gratis es solo para el plan Anual.
        </p>
      )}

      <motion.div initial={false} whileTap={{ scale: 0.97 }}>
        <Link
          href="/login"
          className="mt-8 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-center text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
        >
          {plan === 'anual' ? '¡Comienzo mi prueba de tres días gratis!' : 'Confirmar mi plan Mensual — $14.99'}
        </Link>
      </motion.div>

      <p className="mx-auto mt-4 max-w-[320px] text-center text-[12px] leading-[1.5] text-[var(--text-primary)]">
        {plan === 'anual' ? 'Sin cobro hoy' : 'Se cobra hoy'} · cancela cuando quieras · Niki nunca comparte tus fotos
      </p>
    </main>
  );
}
