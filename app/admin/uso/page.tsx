// USO — activación, retención y la acción principal (21-BACKOFFICE). Se lee
// de event_log (36-ANALITICA), instrumentado hoy en: alta/login, onboarding
// completado y Check creado. El funnel paso-a-paso del onboarding y la
// retención D1/D7/D30 necesitan más volumen e historial para decir algo útil
// — se muestran honestamente vacíos mientras tanto.

import { Flame, Camera, Sparkle } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { metricasDeUso } from '@/lib/admin/queries';
import { GraficoBarras } from '@/components/admin/chart';
import { AdminCard, SectionTitle, SinDatos, StatCard } from '@/components/admin/ui';
import { Reveal } from '@/components/admin/reveal';

export default async function AdminUso() {
  const supabase = await crearClienteSupabaseServidor();
  const uso = await metricasDeUso(supabase);
  const activacion = uso.totalCuentas > 0 ? Math.round((uso.onboardingCompletado / uso.totalCuentas) * 100) : null;

  return (
    <div>
      <SectionTitle subtitulo="¿La gente completa el recorrido y vuelve a usar la app?">Uso</SectionTitle>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Reveal delay={0}>
          <StatCard
            label="Activación"
            value={activacion === null ? 'Sin datos' : `${activacion}%`}
            icon={<Sparkle size={20} strokeWidth={2} color="var(--accent)" />}
            insight={activacion === null ? undefined : 'Completó el recorrido de bienvenida'}
            destacada
          />
        </Reveal>
        <Reveal delay={0.06}>
          <StatCard label="Hicieron su primer Check" value={String(uso.usuariosConCheck)} icon={<Camera size={20} strokeWidth={2} color="var(--accent)" />} />
        </Reveal>
        <Reveal delay={0.12}>
          <StatCard label="Checks creados en total" value={String(uso.checksCreados)} icon={<Flame size={20} strokeWidth={2} color="var(--accent)" />} />
        </Reveal>
      </div>

      <div className="mt-8">
        <SectionTitle subtitulo="Checks de Presencia creados en los últimos 7 días">La función principal</SectionTitle>
        <AdminCard>
          <GraficoBarras titulo="Checks por día" datos={uso.serieChecks7d} />
        </AdminCard>
      </div>

      <div className="mt-8">
        <SectionTitle subtitulo="Cuánta gente vuelve al día siguiente, a la semana y al mes">Retención (D1 / D7 / D30)</SectionTitle>
        <SinDatos motivo="Hace falta más tiempo e historial de uso real para que este número signifique algo — vuelve cuando tengas tus primeras semanas de usuarios." />
      </div>

      <div className="mt-8">
        <SectionTitle subtitulo="Suscriptores pagando que llevan 14+ días sin abrir la app">Pagadores fantasma</SectionTitle>
        <SinDatos motivo="Se activa cuando haya suscripciones de pago conectadas (Hotmart)." />
      </div>
    </div>
  );
}
