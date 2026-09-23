// RESUMEN — /admin. Lo primero que ve el dueño: el banner de avisos
// automáticos (21-BACKOFFICE) y los números clave que YA existen de verdad.

import { AlertTriangle, Users, UserCheck, Camera } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { contarPorPlan, contarErroresRecientes, metricasDeUso } from '@/lib/admin/queries';
import { AdminCard, BannerAvisos, SectionTitle, StatCard, type Aviso } from '@/components/admin/ui';
import { Reveal } from '@/components/admin/reveal';

export default async function AdminResumen() {
  const supabase = await crearClienteSupabaseServidor();
  const [{ total, activos }, erroresRecientes, uso] = await Promise.all([
    contarPorPlan(supabase),
    contarErroresRecientes(supabase, 24),
    metricasDeUso(supabase),
  ]);

  const avisos: Aviso[] = [];
  if (erroresRecientes > 0) {
    avisos.push({
      id: 'errores',
      icono: AlertTriangle,
      severidad: erroresRecientes >= 5 ? 'alerta' : 'atencion',
      titulo: `${erroresRecientes} error${erroresRecientes === 1 ? '' : 'es'} en las últimas 24 horas`,
      detalle: 'Algo falló para algún usuario y ya quedó anotado. Revisa la sección Salud para ver el detalle.',
    });
  }

  return (
    <div>
      <SectionTitle subtitulo="Lo más importante de tu app, de un vistazo">Resumen</SectionTitle>
      <BannerAvisos avisos={avisos} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Reveal delay={0}>
          <StatCard label="Usuarios totales" value={String(total)} icon={<Users size={20} strokeWidth={2} color="var(--accent)" />} destacada />
        </Reveal>
        <Reveal delay={0.06}>
          <StatCard
            label="Con un plan activo"
            value={String(activos)}
            icon={<UserCheck size={20} strokeWidth={2} color="var(--accent)" />}
            insight={total > 0 ? `${Math.round((activos / total) * 100)}% del total` : undefined}
          />
        </Reveal>
        <Reveal delay={0.12}>
          <StatCard label="Checks de Presencia creados" value={String(uso.checksCreados)} icon={<Camera size={20} strokeWidth={2} color="var(--accent)" />} />
        </Reveal>
      </div>

      <Reveal delay={0.18} className="mt-6">
        <AdminCard>
          <p className="text-sm text-[var(--text-secondary)]">
            Todavía no hay ventas ni IA conectadas — en cuanto lo estén, aquí vas a ver tus ingresos, tu ganancia real y el costo de
            la IA sin que tengas que hacer nada más.
          </p>
        </AdminCard>
      </Reveal>
    </div>
  );
}
