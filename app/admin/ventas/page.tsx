// VENTAS — ingresos, MRR, compras, cancelaciones, churn, GANANCIA REAL y
// costo de IA (21-BACKOFFICE). Hotmart y la IA no están conectados todavía
// (ESTADO.md) — se muestra honestamente "Sin datos", nunca un número
// inventado. Lo único real hoy es la distribución de planes en profiles.

import { DollarSign, PiggyBank, Sparkles, Zap } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { contarPorPlan, costoIA } from '@/lib/admin/queries';
import { AdminCard, SectionTitle, SinDatos, StatCard } from '@/components/admin/ui';
import { GraficoBarras } from '@/components/admin/chart';
import { Reveal } from '@/components/admin/reveal';

const LABEL_PLAN: Record<string, string> = {
  ninguno: 'Sin plan',
  trial: 'En prueba gratis',
  anual: 'VIP Pro anual',
  mensual: 'VIP Pro mensual',
  cancelado: 'Cancelado',
};

export default async function AdminVentas() {
  const supabase = await crearClienteSupabaseServidor();
  const [{ conteo, total }, ia] = await Promise.all([contarPorPlan(supabase), costoIA(supabase)]);

  return (
    <div>
      <SectionTitle subtitulo="Ingresos, ganancia real y estado de las cuentas">Ventas</SectionTitle>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Reveal delay={0}>
          <StatCard label="Ingresos del mes" value="Sin datos" icon={<DollarSign size={20} strokeWidth={2} color="var(--accent)" />} destacada />
        </Reveal>
        <Reveal delay={0.06}>
          <StatCard
            label="Ganancia real (lo que te queda limpio)"
            value="Sin datos"
            icon={<PiggyBank size={20} strokeWidth={2} color="var(--accent)" />}
            destacada
          />
        </Reveal>
      </div>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Estos dos números necesitan a Hotmart conectado (para saber cuánto entra) — se activan solos en cuanto esa sesión quede
        lista, sin que tengas que tocar nada aquí.
      </p>

      <div className="mt-8">
        <SectionTitle subtitulo="Cuánto entra mes a mes, en cuanto haya ventas">Evolución de ingresos</SectionTitle>
        <AdminCard>
          <GraficoBarras titulo="Ingresos por mes" datos={[]} unidad="USD" />
        </AdminCard>
      </div>

      <div className="mt-8">
        <SectionTitle>Estado de las cuentas hoy</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(LABEL_PLAN).map(([clave, label], i) => (
            <Reveal key={clave} delay={i * 0.04}>
              <AdminCard className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{conteo[clave] ?? 0}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{label}</p>
              </AdminCard>
            </Reveal>
          ))}
        </div>
        {total === 0 && (
          <div className="mt-4">
            <SinDatos motivo="Todavía no hay ninguna cuenta registrada." />
          </div>
        )}
      </div>

      <div className="mt-8">
        <SectionTitle subtitulo="Compras, cancelaciones y el desglose de por qué se van (se fue por su cuenta vs. se le venció la tarjeta)">
          Compras y cancelaciones
        </SectionTitle>
        <SinDatos motivo="Se activa cuando conectemos Hotmart — ahí es de donde sale esta información." />
      </div>

      <div className="mt-8">
        <SectionTitle subtitulo="Lo que cuesta cada análisis de la IA, por función y por usuario">Costo de la inteligencia artificial</SectionTitle>
        {ia.totalLlamadas === 0 ? (
          <SinDatos motivo="La IA todavía no está conectada — en cuanto lo esté, vas a ver aquí cuánto cuesta cada Check de Presencia." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Gasto de hoy" value={`$${ia.gastoHoy.toFixed(2)}`} icon={<Zap size={20} strokeWidth={2} color="var(--accent)" />} />
            <StatCard
              label="Gasto total registrado"
              value={`$${ia.totalUsd.toFixed(2)}`}
              icon={<Sparkles size={20} strokeWidth={2} color="var(--accent)" />}
              insight={`${ia.totalLlamadas} llamadas a la IA`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
