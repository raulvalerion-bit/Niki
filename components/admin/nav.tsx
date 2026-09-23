'use client';

// Navegación del backoffice — pieza cliente aparte del layout (servidor)
// porque necesita usePathname para resaltar la sección activa (mismo patrón
// de app/app/layout.tsx → BarraPestanas: sin esto, el usuario no sabe dónde
// está parado dentro del panel).

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** `icon` llega ya renderizado (`<LayoutDashboard size={17} />`, sin color
    fijo → hereda `currentColor` del Link) — un componente de ícono sin
    renderizar no puede cruzar desde el layout (servidor) hacia esta pieza
    de cliente (Next.js RSC). Ver la misma nota en components/admin/ui.tsx. */
export function NavAdmin({ secciones }: { secciones: { href: string; label: string; icon: React.ReactNode }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Secciones del panel" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {secciones.map(({ href, label, icon }) => {
        const activa = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={activa ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium transition-colors ${
              activa ? 'bg-[var(--chip-bg)] text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--chip-bg)] hover:text-[var(--accent)]'
            }`}
          >
            {icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
