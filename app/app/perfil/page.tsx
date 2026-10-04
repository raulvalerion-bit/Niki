'use client';

// PANTALLA "PERFIL" — cuenta y plan. CONECTADO a Supabase (2026-09-19): el
// correo viene de la sesión real, el plan del profile (todavía "ninguno"
// para todos hasta conectar Hotmart). Enlaces a las páginas legales que ya
// existen (privacidad/términos/reembolsos/aviso-ia). Cerrar sesión llama a
// supabase.auth.signOut() de verdad.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, FileText, RotateCcw, Sparkles, LogOut, ChevronRight, ExternalLink, Mail, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
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
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState<string | null>(null);

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

  async function eliminarCuenta() {
    setBorrando(true);
    setErrorBorrado(null);
    try {
      const res = await fetch('/api/cuenta/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmacion: 'ELIMINAR' }),
      });
      if (!res.ok) throw new Error('fallo');
      router.push('/');
      router.refresh();
    } catch {
      setErrorBorrado('No pudimos eliminar tu cuenta. Revisa tu conexión e inténtalo otra vez, o escríbenos a hola@holaniki.com.');
      setBorrando(false);
    }
  }

  const planInfo = PLAN_LABEL[plan] ?? PLAN_LABEL.ninguno;
  const tieneSuscripcion = plan === 'trial' || plan === 'anual' || plan === 'mensual';

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

      <div className="mt-4 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]">
        <a
          href="https://app.hotmart.com/comprador"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5"
        >
          <CreditCard size={17} color="var(--text-secondary)" aria-hidden="true" />
          <span className="flex-1 text-[14px] font-medium text-[var(--text-primary)]">
            {tieneSuscripcion ? 'Administrar o cancelar mi suscripción' : 'Mis compras en Hotmart'}
          </span>
          <ExternalLink size={16} color="var(--text-tertiary)" aria-hidden="true" />
        </a>
        <a
          href="mailto:hola@holaniki.com"
          className="flex items-center gap-3 border-t border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] px-4 py-3.5"
        >
          <Mail size={17} color="var(--text-secondary)" aria-hidden="true" />
          <span className="flex-1 text-[14px] font-medium text-[var(--text-primary)]">¿Necesitas ayuda? Escríbenos</span>
          <ChevronRight size={16} color="var(--text-tertiary)" aria-hidden="true" />
        </a>
      </div>

      <button
        type="button"
        onClick={() => void cerrarSesion()}
        className="mx-auto mt-6 flex items-center gap-1.5 text-[14px] font-medium text-[var(--text-secondary)]"
      >
        <LogOut size={16} aria-hidden="true" />
        Cerrar sesión
      </button>

      {confirmarBorrado ? (
        <div
          role="alertdialog"
          aria-labelledby="borrar-titulo"
          className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--error)_40%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
        >
          <p id="borrar-titulo" className="text-[15px] font-bold text-[var(--text-primary)]">
            ¿Eliminar tu cuenta para siempre?
          </p>
          <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-primary)]">
            Se borran tus fotos, tus Checks, tus gemas y tu historial. No se puede deshacer.
            {tieneSuscripcion && ' Tu suscripción de Hotmart NO se cancela sola: cancélala primero desde "Administrar o cancelar mi suscripción" para que no te sigan cobrando.'}
          </p>
          <div className="mt-4 flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setConfirmarBorrado(false)}
              disabled={borrando}
              className="h-11 flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[14px] font-semibold text-[var(--text-primary)]"
            >
              No, mantenerla
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => void eliminarCuenta()}
              disabled={borrando}
              className="h-11 flex-1 rounded-[var(--radius-button)] bg-[var(--error)] text-[14px] font-semibold text-white disabled:opacity-60"
            >
              {borrando ? 'Eliminando…' : 'Sí, eliminar'}
            </motion.button>
          </div>
          {errorBorrado && (
            <p role="alert" className="mt-3 text-[13px] font-medium text-[var(--error)]">
              {errorBorrado}
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmarBorrado(true)}
          className="mx-auto mt-4 flex h-11 items-center gap-1.5 px-4 text-[13px] font-medium text-[var(--text-secondary)]"
        >
          <Trash2 size={15} aria-hidden="true" />
          Eliminar mi cuenta
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iconos/banner-despedida-v2.png"
        alt="¡Me complace haberte ayudado hoy, te espero pronto!"
        className="mx-auto mt-6 w-full max-w-[360px] rounded-[var(--radius-card)] shadow-[var(--shadow-2)]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/iconos/carita-resultado.png" alt="" aria-hidden="true" className="mx-auto mt-3 size-20" />
    </div>
  );
}
