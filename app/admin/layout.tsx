// LAYOUT DEL BACKOFFICE — /admin/*. Verificación de admin EN EL SERVIDOR
// (nunca solo ocultar el link — 09-SEGURIDAD.md): si no hay sesión o el rol
// no es 'admin', se redirige. El middleware (proxy.ts) ya exige sesión para
// entrar aquí; este layout agrega la segunda capa (el ROL), que el
// middleware no verifica por diseño (evita una consulta a la DB en cada
// request de la app entera).

import { redirect } from 'next/navigation';
import { LayoutDashboard, DollarSign, Users, Activity, TrendingUp, HeartPulse } from 'lucide-react';
import { verificarAdmin } from '@/lib/admin/verificar';
import { NavAdmin } from '@/components/admin/nav';

// Los íconos van YA RENDERIZADOS (sin `color` fijo → heredan currentColor del
// Link activo/inactivo en NavAdmin) — un componente de ícono sin renderizar
// no puede cruzar desde este layout (servidor) hacia NavAdmin (cliente).
const SECCIONES: { href: string; label: string; icon: React.ReactNode }[] = [
  { href: '/admin', label: 'Resumen', icon: <LayoutDashboard size={17} aria-hidden="true" /> },
  { href: '/admin/ventas', label: 'Ventas', icon: <DollarSign size={17} aria-hidden="true" /> },
  { href: '/admin/usuarios', label: 'Usuarios', icon: <Users size={17} aria-hidden="true" /> },
  { href: '/admin/uso', label: 'Uso', icon: <Activity size={17} aria-hidden="true" /> },
  { href: '/admin/negocio', label: 'Negocio', icon: <TrendingUp size={17} aria-hidden="true" /> },
  { href: '/admin/salud', label: 'Salud', icon: <HeartPulse size={17} aria-hidden="true" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, esAdmin } = await verificarAdmin();
  if (!user) redirect('/login');
  if (!esAdmin) redirect('/app');

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 900px 500px at 15% -10%, color-mix(in oklab, var(--sunset-1) 12%, transparent), transparent 60%), var(--bg)',
      }}
    >
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col lg:flex-row">
        <aside className="flex shrink-0 flex-col gap-1 border-b border-[var(--border-default)] bg-[color-mix(in_oklab,var(--surface)_55%,transparent)] px-4 py-4 lg:w-56 lg:border-b-0 lg:border-r lg:px-3 lg:py-6">
          <div className="mb-4 flex items-center gap-2 px-2">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-[8px]"
              style={{ background: 'linear-gradient(160deg, var(--sunset-1) 0%, var(--sunset-2) 100%)' }}
            >
              <svg width="14" height="14" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                <circle
                  cx="26"
                  cy="26"
                  r="19"
                  stroke="var(--text-primary)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="119.4"
                  strokeDashoffset="28"
                  transform="rotate(-90 26 26)"
                />
                <circle cx="26" cy="7.2" r="5" fill="var(--text-primary)" />
              </svg>
            </span>
            <p className="text-lg font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
              niki <span className="font-medium text-[var(--text-tertiary)]">admin</span>
            </p>
          </div>
          <NavAdmin secciones={SECCIONES} />
        </aside>
        <main className="min-h-dvh flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
