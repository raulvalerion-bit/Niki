'use client';

// Envoltorio canónico de gráficos del backoffice (17-VISUALIZACION-DATOS):
// tokens de la app (nunca los defaults de Recharts), tooltip tematizado,
// tabla sr-only con los mismos datos (accesibilidad), skeleton al cargar.

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Punto {
  etiqueta: string;
  valor: number;
}

interface GraficoBarrasProps {
  titulo: string;
  datos: Punto[] | null;
  unidad?: string;
  altura?: number;
}

const NUM = new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 });

function TooltipCard({ active, label, payload }: { active?: boolean; label?: string; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 py-2 shadow-[var(--shadow-1)]">
      <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">{NUM.format(payload[0].value)}</p>
    </div>
  );
}

export function GraficoBarras({ titulo, datos, unidad = '', altura = 200 }: GraficoBarrasProps) {
  if (!datos) {
    return <div className="w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" style={{ height: altura }} />;
  }
  if (datos.length === 0) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] text-xs text-[var(--text-tertiary)]"
        style={{ height: altura }}
      >
        Sin datos todavía
      </div>
    );
  }
  return (
    <figure aria-label={titulo}>
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart data={datos} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 3" />
          <XAxis dataKey="etiqueta" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
          <YAxis
            width={36}
            axisLine={false}
            tickLine={false}
            tickCount={4}
            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
            tickFormatter={(v: number) => NUM.format(v)}
          />
          <Tooltip content={<TooltipCard />} cursor={{ fill: 'var(--chip-bg)' }} />
          <Bar dataKey="valor" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">
        <table>
          <caption>{titulo}</caption>
          <thead>
            <tr>
              <th scope="col">Período</th>
              <th scope="col">Valor{unidad && ` (${unidad})`}</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((p, i) => (
              <tr key={`${p.etiqueta}-${i}`}>
                <th scope="row">{p.etiqueta}</th>
                <td>{p.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
