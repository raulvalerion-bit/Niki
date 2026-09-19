'use client';

// PANTALLA "PERFIL" — cuenta y plan. CONECTADO a Supabase (2026-09-19): el
// correo viene de la sesión real, el plan del profile (todavía "ninguno"
// para todos hasta conectar Hotmart). Enlaces a las páginas legales que ya
// existen (privacidad/términos/reembolsos/aviso-ia). Cerrar sesión llama a
// supabase.auth.signOut() de verdad.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, FileText, RotateCcw, Sparkles, LogOut, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';

const ENLACES: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Privacidad', href: '/privacidad', icon: ShieldCheck },
  { label: 'Términos', href: '/terminos', icon: FileText },
  { label: 'Reembolsos', href: '/reembolsos', icon: RotateCcw },
  { label: 'Aviso de IA', href: '/aviso-ia', icon: Sparkles },
];

const PLAN_LABEL: Record<string, { titulo: string; nota: string }> = {
  ninguno: { titulo: 'Aún no tienes un plan activo', nota: 'Desbloquea tus análisis con VIP Pro' },
  trial: { titulo: 'Prueba gratis de VIP Pro', nota: 'Se activa el cobro al terminar tu prueba' },
  anual: { titulo: 'Plan VIP Pro Anual', nota: 'Activo' },
  mensual: { titulo: 'Plan VIP Pro Mensual', nota: 'Activo' },
  cancelado: { titulo: 'Tu plan VIP Pro está cancelado', nota: 'Puedes reactivarlo cuando quieras' },
};

export default function Perfil() {
  const router = useRouter();
  const supabase = crearClienteSupabase();
  const [correo, setCorreo] = useState('');
  const [plan, setPlan] = useState('ninguno');

  useEffect(() => {
    let activo = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      if (activo) setCorreo(user.email ?? '');
      const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
      if (activo && data) setPlan(data.plan);
    })();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const planInfo = PLAN_LABEL[plan] ?? PLAN_LABEL.ninguno;

  return (
    <div className="flex flex-1 flex-col pt-4">
      <h1 className="text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu cuenta
      </h1>

      <div className="mt-5 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[16px] font-bold text-[var(--accent)] [font-family:var(--font-display)]">
          {correo ? correo[0].toUpperCase() : 'N'}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">{correo || 'Tu correo de acceso'}</p>
          <p className="text-[13px] text-[var(--text-secondary)]">Tu correo de acceso</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--chip-bg)] p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)]">
          <CreditCard size={18} color="var(--accent)" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">{planInfo.titulo}</p>
          <p className="text-[13px] text-[var(--text-secondary)]">{planInfo.nota}</p>
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

      <button
        type="button"
        onClick={() => void cerrarSesion()}
        className="mx-auto mt-6 flex items-center gap-1.5 text-[14px] font-medium text-[var(--text-secondary)]"
      >
        <LogOut size={16} aria-hidden="true" />
        Cerrar sesión
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iconos/banner-despedida.png"
        alt="¡Me complace haberte ayudado hoy, te espero pronto!"
        className="mx-auto mt-6 w-full max-w-[320px] rounded-[var(--radius-card)] shadow-[var(--shadow-2)]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/iconos/carita-resultado.png" alt="" aria-hidden="true" className="mx-auto mt-3 size-20" />
    </div>
  );
}
