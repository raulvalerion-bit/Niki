// KIT DE UI DEL BACKOFFICE — mismos tokens de FICHA-ARTE.md que el resto de
// la app (superficie/acento/radios/sombras) y las MISMAS piezas premium del
// kit de landing (IconChip, Hairline — 49-SISTEMA-DE-COMPONENTES: se
// reutilizan, no se reinventan), en un idioma más denso y utilitario: el
// dueño necesita leer muchos números de un vistazo.

import type { LucideIcon } from 'lucide-react';
import { Inbox, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';

export function AdminCard({
  children,
  className = '',
  destacada = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Borde degradado sutil (Hairline del kit) — para la card MÁS importante de la sección, no todas. */
  destacada?: boolean;
}) {
  if (!destacada) {
    return (
      <div className={`rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)] ${className}`}>
        {children}
      </div>
    );
  }
  return (
    <Hairline emphasis className={className.includes('h-full') ? 'h-full' : ''}>
      <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">{children}</div>
    </Hairline>
  );
}

export function SectionTitle({ children, subtitulo }: { children: React.ReactNode; subtitulo?: string }) {
  return (
    <div className="mb-4 flex gap-3">
      <span aria-hidden="true" className="mt-1 h-5 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{children}</h2>
        {subtitulo && <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitulo}</p>}
      </div>
    </div>
  );
}

/** Dato héroe: UN número protagonista + su insight, per 17-VISUALIZACION-DATOS.
    `icon` recibe el ELEMENTO ya renderizado (`<Users size={20} />`), no el
    componente crudo — StatCard se usa desde Server Components y un componente
    de ícono sin renderizar no puede cruzar hacia una pieza de cliente (Next.js
    RSC): se renderiza aquí mismo, en el servidor, y solo el resultado viaja. */
export function StatCard({
  label,
  value,
  insight,
  tono = 'neutral',
  icon,
  destacada = false,
}: {
  label: string;
  value: string;
  insight?: string;
  tono?: 'neutral' | 'positivo' | 'negativo';
  icon?: React.ReactNode;
  destacada?: boolean;
}) {
  const colorInsight =
    tono === 'positivo' ? 'text-[var(--chart-positivo)]' : tono === 'negativo' ? 'text-[var(--chart-negativo)]' : 'text-[var(--text-secondary)]';
  return (
    <AdminCard destacada={destacada} className="h-full">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        {icon && (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)]">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
        {value}
      </p>
      {insight && <p className={`mt-2 text-sm font-medium ${colorInsight}`}>{insight}</p>}
    </AdminCard>
  );
}

/** "Sin datos" honesto — nunca un número inventado (pedido explícito del dueño). */
export function SinDatos({ motivo }: { motivo: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] px-4 py-8 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-2)]">
        <Inbox size={20} color="var(--text-tertiary)" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-[var(--text-secondary)]">Sin datos todavía</p>
      <p className="max-w-xs text-xs text-[var(--text-tertiary)]">{motivo}</p>
    </div>
  );
}

export type Aviso = {
  id: string;
  icono: LucideIcon;
  titulo: string;
  detalle: string;
  severidad: 'alerta' | 'atencion';
};

/** Banner de avisos automáticos (21-BACKOFFICE) — qué pasó → por qué importa → qué hacer. */
export function BannerAvisos({ avisos }: { avisos: Aviso[] }) {
  if (avisos.length === 0) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--chart-positivo)_30%,transparent)] bg-[color-mix(in_oklab,var(--chart-positivo)_10%,var(--surface))] px-4 py-3.5 shadow-[var(--shadow-1)]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--chart-positivo)_16%,transparent)]">
          <CheckCircle2 size={18} color="var(--chart-positivo)" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-[var(--text-primary)]">Todo en orden este mes</p>
      </div>
    );
  }
  return (
    <div className="mb-6 flex flex-col gap-2">
      {avisos.map((a) => {
        const Icono = a.icono;
        const critico = a.severidad === 'alerta';
        return (
          <div
            key={a.id}
            className={`flex items-start gap-3 rounded-[var(--radius-card)] border px-4 py-3.5 shadow-[var(--shadow-1)] ${
              critico
                ? 'border-[color-mix(in_oklab,var(--chart-negativo)_30%,transparent)] bg-[color-mix(in_oklab,var(--chart-negativo)_8%,var(--surface))]'
                : 'border-[color-mix(in_oklab,var(--gold)_35%,transparent)] bg-[color-mix(in_oklab,var(--gold)_12%,var(--surface))]'
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                critico ? 'bg-[color-mix(in_oklab,var(--chart-negativo)_16%,transparent)]' : 'bg-[color-mix(in_oklab,var(--gold)_22%,transparent)]'
              }`}
            >
              <Icono size={18} color={critico ? 'var(--chart-negativo)' : 'var(--gold-text)'} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{a.titulo}</p>
              <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{a.detalle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Badge({ children, tono = 'neutral' }: { children: React.ReactNode; tono?: 'neutral' | 'positivo' | 'negativo' | 'atencion' }) {
  const estilos: Record<string, string> = {
    neutral: 'bg-[var(--chip-bg)] text-[var(--accent)]',
    positivo: 'bg-[color-mix(in_oklab,var(--chart-positivo)_14%,transparent)] text-[var(--chart-positivo)]',
    negativo: 'bg-[color-mix(in_oklab,var(--chart-negativo)_14%,transparent)] text-[var(--chart-negativo)]',
    atencion: 'bg-[color-mix(in_oklab,var(--gold)_20%,transparent)] text-[var(--gold-text)]',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[tono]}`}>{children}</span>;
}

export function TablaContenedor({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-1)]">
      <table className="w-full min-w-[35rem] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--chart-negativo)_30%,transparent)] bg-[color-mix(in_oklab,var(--chart-negativo)_6%,var(--surface))] px-4 py-3">
      <XCircle size={18} color="var(--chart-negativo)" aria-hidden="true" />
      <p className="text-sm font-medium text-[var(--text-primary)]">{mensaje}</p>
    </div>
  );
}

export { AlertTriangle };
