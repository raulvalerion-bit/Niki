// NEGOCIO — LTV, CAC por canal, ratio y payback (21-BACKOFFICE). El LTV/CAC
// real necesita datos de ventas (Hotmart) — hoy solo se puede anotar el
// GASTO por canal (lo que Hotmart no sabe), listo para cuando haya ingresos
// con los que cruzarlo. El gasto por canal SÍ es real hoy: se grafica.

import { Target, Coins, TrendingUp as IconoRatio } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { listarGastoAdquisicion } from '@/lib/admin/queries';
import { AdminCard, SectionTitle, SinDatos, StatCard, TablaContenedor } from '@/components/admin/ui';
import { GraficoBarras } from '@/components/admin/chart';
import { Reveal } from '@/components/admin/reveal';
import { FormularioGasto } from '@/components/admin/negocio-client';

export default async function AdminNegocio() {
  const supabase = await crearClienteSupabaseServidor();
  const gastos = await listarGastoAdquisicion(supabase);

  // Nunca se suman monedas distintas (21-BACKOFFICE, "dinero multimoneda") —
  // se grafica solo la moneda dominante (USD, la única que hoy ofrece el formulario).
  const gastosUsd = gastos.filter((g) => g.currency === 'USD');
  const porCanal = new Map<string, number>();
  for (const g of gastosUsd) porCanal.set(g.channel, (porCanal.get(g.channel) ?? 0) + Number(g.amount));
  const datosGrafico = [...porCanal.entries()].map(([etiqueta, valor]) => ({ etiqueta, valor }));

  return (
    <div>
      <SectionTitle subtitulo="Cuánto cuesta conseguir un cliente vs. cuánto te deja">Negocio</SectionTitle>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Reveal delay={0}>
          <StatCard label="Valor de vida del cliente (LTV)" value="Sin datos" icon={<Coins size={20} strokeWidth={2} color="var(--accent)" />} />
        </Reveal>
        <Reveal delay={0.06}>
          <StatCard label="Costo de conseguir un cliente (CAC)" value="Sin datos" icon={<Target size={20} strokeWidth={2} color="var(--accent)" />} />
        </Reveal>
        <Reveal delay={0.12}>
          <StatCard
            label="Por cada $1 invertido, recuperas"
            value="Sin datos"
            icon={<IconoRatio size={20} strokeWidth={2} color="var(--accent)" />}
            destacada
          />
        </Reveal>
      </div>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Estos números se calculan cruzando tus ventas de Hotmart con el gasto que anotes abajo — hoy no hay ventas todavía.
      </p>

      <div className="mt-8">
        <SectionTitle subtitulo="Lo que gastas en publicidad o afiliados, por canal y período">Gasto de adquisición</SectionTitle>
        <FormularioGasto />

        {datosGrafico.length > 0 && (
          <AdminCard className="mb-4">
            <GraficoBarras titulo="Gasto por canal (USD)" datos={datosGrafico} unidad="USD" altura={180} />
          </AdminCard>
        )}

        {gastos.length === 0 ? (
          <SinDatos motivo="Todavía no anotaste ningún gasto." />
        ) : (
          <TablaContenedor>
            <thead>
              <tr className="border-b border-[var(--border-default)] text-xs text-[var(--text-tertiary)]">
                <th scope="col" className="px-4 py-3 font-medium">
                  Canal
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Período
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Gasto
                </th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((g) => (
                <tr key={g.id} className="border-b border-[var(--border-default)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{g.channel}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {new Date(g.period_start).toLocaleDateString('es-MX')} – {new Date(g.period_end).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-[var(--text-primary)]">
                    {g.currency} ${Number(g.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaContenedor>
        )}
      </div>
    </div>
  );
}
