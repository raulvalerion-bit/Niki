'use client';

// APP INTERNA DE NIKI — Paso 5 de la secuencia maestra (ESTADO.md).
// 4 secciones (aprobadas en el Tour, vista-previa-app.html): Hoy / Historial /
// Hábitos / Perfil. Este layout comparte el fondo degradé y la barra de
// pestañas de abajo entre las 4 pantallas — mismo patrón de tokens que
// onboarding/paywall/login.
//
// SIN BACKEND todavía (ESTADO.md: "Servicios externos: bloqueados"): no hay
// Supabase ni proveedor de IA conectados. Estas pantallas muestran el ESTADO
// REAL de un usuario recién registrado (día 1, sin historial) — NUNCA se
// fabrica un scan, una racha o una calificación que el usuario no generó de
// verdad (misma regla que en onboarding/page.tsx). El botón "Hacer mi Check
// de Presencia" abre el flujo de foto pero la IA responde con un aviso
// honesto ("se conecta en la próxima sesión") en vez de inventar un análisis.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, ListChecks, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/app', label: 'Hoy', icon: Home },
  { href: '/app/historial', label: 'Historial', icon: History },
  { href: '/app/habitos', label: 'Hábitos', icon: ListChecks },
  { href: '/app/perfil', label: 'Perfil', icon: User },
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

function BarraPestanas() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 mt-auto -mx-5 flex items-center justify-around border-t border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--surface)] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2"
    >
      {TABS.map(({ href, label, icon: Icono }) => {
        const activa = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={activa ? 'page' : undefined}
            className="flex min-w-[64px] flex-col items-center gap-1 py-1.5"
          >
            <span
              className={`flex h-8 w-12 items-center justify-center rounded-full ${
                activa ? 'bg-[var(--chip-bg)]' : ''
              }`}
            >
              <Icono size={20} color={activa ? 'var(--accent)' : 'var(--text-tertiary)'} aria-hidden="true" />
            </span>
            <span className={`text-[11px] font-medium ${activa ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppInternaLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden px-5 text-[var(--text-primary)] [font-family:var(--font-body)]"
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

      <MarcaNiki />

      <div className="flex flex-1 flex-col pb-6 pt-4">{children}</div>

      <BarraPestanas />
    </main>
  );
}
