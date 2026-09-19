'use client';

// PANTALLA "PERFIL" — cuenta y plan. Sin backend real todavía: el correo y
// el plan mostrados son placeholders honestos (se conectan a la sesión real
// de Supabase en Servicios externos). Enlaces a las páginas legales que ya
// existen (privacidad/términos/reembolsos/aviso-ia).

import Link from 'next/link';
import { CreditCard, ShieldCheck, FileText, RotateCcw, Sparkles, LogOut, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ENLACES: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Privacidad', href: '/privacidad', icon: ShieldCheck },
  { label: 'Términos', href: '/terminos', icon: FileText },
  { label: 'Reembolsos', href: '/reembolsos', icon: RotateCcw },
  { label: 'Aviso de IA', href: '/aviso-ia', icon: Sparkles },
];

export default function Perfil() {
  return (
    <div className="flex flex-1 flex-col pt-4">
      <h1 className="text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu cuenta
      </h1>

      <div className="mt-5 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[16px] font-bold text-[var(--accent)] [font-family:var(--font-display)]">
          N
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">Tu correo de acceso</p>
          <p className="text-[13px] text-[var(--text-secondary)]">Se conecta al iniciar sesión de verdad</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--chip-bg)] p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)]">
          <CreditCard size={18} color="var(--accent)" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">Plan VIP Pro</p>
          <p className="text-[13px] text-[var(--text-secondary)]">Se activa al conectar el cobro</p>
        </div>
        <Link href="/paywall" className="text-[13px] font-semibold text-[var(--accent)]">
          Ver plan
        </Link>
      </div>

      <div className="mt-6 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]">
        {ENLACES.map(({ label, href, icon: Icono }, i) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3.5 ${
              i === 0 ? '' : 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)]'
            }`}
          >
            <Icono size={17} color="var(--text-secondary)" aria-hidden="true" />
            <span className="flex-1 text-[14px] font-medium text-[var(--text-primary)]">{label}</span>
            <ChevronRight size={16} color="var(--text-tertiary)" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mx-auto mt-6 flex items-center gap-1.5 text-[14px] font-medium text-[var(--text-secondary)]"
      >
        <LogOut size={16} aria-hidden="true" />
        Cerrar sesión
      </Link>
    </div>
  );
}
