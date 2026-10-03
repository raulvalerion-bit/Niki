// SALUD — errores agrupados por frecuencia y estado del webhook de Hotmart
// (21-BACKOFFICE). Los errores vienen de error_log (app/error.tsx,
// app/app/error.tsx, app/admin/error.tsx → /api/log-error).

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { listarAvisosHotmart, listarErroresAgrupados, ultimaReconciliacion } from '@/lib/admin/queries';
import { AdminCard, Badge, SectionTitle, SinDatos, TablaContenedor } from '@/components/admin/ui';
import { BotonReconciliar } from '@/components/admin/reconciliar-client';

const LABEL_AVISO: Record<string, string> = {
  applied: 'Aplicado',
  duplicate: 'Repetido (ya aplicado)',
  illegal: 'Bloqueado',
  unauthorized: 'Rechazado: no vino de Hotmart',
  ignored: 'Sin efecto',
  error: 'Falló — Hotmart reintenta',
};
const TONO_AVISO: Record<string, 'neutral' | 'positivo' | 'negativo' | 'atencion'> = {
  applied: 'positivo',
  duplicate: 'neutral',
  illegal: 'atencion',
  unauthorized: 'negativo',
  ignored: 'neutral',
  error: 'negativo',
};

export default async function AdminSalud() {
  const supabase = await crearClienteSupabaseServidor();
  const [{ recientes, agrupado }, avisos, reconciliacion] = await Promise.all([
    listarErroresAgrupados(supabase),
    listarAvisosHotmart(supabase),
    ultimaReconciliacion(supabase),
  ]);

  return (
    <div>
      <SectionTitle subtitulo="Errores de la app y si los avisos de pago de Hotmart siguen llegando">Salud</SectionTitle>

      <div className="mb-8">
        <SectionTitle subtitulo="Cada lunes Niki compara quién paga en Hotmart contra quién puede entrar. Lo sano es 0 diferencias.">
          Accesos vs. Hotmart
        </SectionTitle>
        <AdminCard destacada>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {!reconciliacion ? (
                <p className="text-sm text-[var(--text-secondary)]">Todavía no se ha corrido ninguna revisión.</p>
              ) : reconciliacion.error === 'faltan_credenciales' ? (
                <>
                  <Badge tono="atencion">Falta conectar</Badge>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Faltan las credenciales de Hotmart (HOTMART_CLIENT_ID y HOTMART_CLIENT_SECRET en Vercel). Sin ellas no se puede revisar.
                  </p>
                </>
              ) : !reconciliacion.ok ? (
                <>
                  <Badge tono="negativo">Falló</Badge>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Hotmart no respondió bien ({reconciliacion.error}). Vuelve a intentarlo; si se repite, revisa las credenciales.
                  </p>
                </>
              ) : (
                <>
                  <Badge tono={reconciliacion.diferencias.length ? 'negativo' : 'positivo'}>
                    {reconciliacion.diferencias.length === 0
                      ? 'Todo cuadra'
                      : `${reconciliacion.diferencias.length} ${reconciliacion.diferencias.length === 1 ? 'diferencia' : 'diferencias'}`}
                  </Badge>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {reconciliacion.total_hotmart} suscripciones en Hotmart · {reconciliacion.total_con_acceso} con acceso en Niki
                    {reconciliacion.manuales > 0 && ` (${reconciliacion.manuales} dados a mano)`}
                  </p>
                </>
              )}
              {reconciliacion && (
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  Última revisión: {new Date(reconciliacion.ran_at).toLocaleString('es-MX')} ({reconciliacion.origen === 'cron' ? 'automática' : 'manual'})
                </p>
              )}
            </div>
            <BotonReconciliar />
          </div>
          {reconciliacion && reconciliacion.diferencias.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2 border-t border-[var(--border-default)] pt-4">
              {reconciliacion.diferencias.map((d, i) => (
                <li key={`${d.email}-${i}`} className="text-sm">
                  <Badge tono={d.tipo === 'pagando_sin_acceso' ? 'negativo' : 'atencion'}>
                    {d.tipo === 'pagando_sin_acceso' ? 'Paga y no puede entrar' : 'Entra sin estar pagando'}
                  </Badge>
                  <span className="ml-2 font-medium text-[var(--text-primary)]">{d.nombre ?? 'Sin nombre'}</span>
                  <span className="ml-1 text-[var(--text-tertiary)]">{d.email}</span>
                  <p className="mt-1 text-[var(--text-secondary)]">{d.detalle}</p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      <div className="mb-8">
        <SectionTitle>Webhook de Hotmart</SectionTitle>
        {avisos.length === 0 ? (
          <SinDatos motivo="Todavía no llega ningún aviso de Hotmart. En cuanto alguien compre (o mandes una prueba desde Hotmart), aparece aquí." />
        ) : (
          <TablaContenedor>
            <thead>
              <tr className="border-b border-[var(--border-default)] text-xs text-[var(--text-tertiary)]">
                <th scope="col" className="px-4 py-3 font-medium">
                  Cuándo
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Aviso
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody>
              {avisos.map((a) => (
                <tr key={a.id} className="border-b border-[var(--border-default)] last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--text-tertiary)]">
                    {new Date(a.received_at).toLocaleString('es-MX')}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{a.tipo ?? 'Sin tipo'}</td>
                  <td className="px-4 py-3">
                    <Badge tono={TONO_AVISO[a.resultado] ?? 'neutral'}>{LABEL_AVISO[a.resultado] ?? a.resultado}</Badge>
                    {a.motivo && <span className="ml-2 text-xs text-[var(--text-tertiary)]">{a.motivo}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaContenedor>
        )}
      </div>

      <div>
        <SectionTitle subtitulo="Los más frecuentes primero — son los que más urge revisar">Errores agrupados</SectionTitle>
        {agrupado.length === 0 ? (
          <SinDatos motivo="No se ha registrado ningún error todavía — buena señal." />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {agrupado.map((g) => (
                <Badge key={g.context} tono={g.veces >= 5 ? 'negativo' : 'atencion'}>
                  {g.context} · {g.veces}
                </Badge>
              ))}
            </div>
            <TablaContenedor>
              <thead>
                <tr className="border-b border-[var(--border-default)] text-xs text-[var(--text-tertiary)]">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Cuándo
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Dónde
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Mensaje
                  </th>
                </tr>
              </thead>
              <tbody>
                {recientes.map((e) => (
                  <tr key={e.id} className="border-b border-[var(--border-default)] last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--text-tertiary)]">
                      {new Date(e.created_at).toLocaleString('es-MX')}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{e.context}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{e.message}</td>
                  </tr>
                ))}
              </tbody>
            </TablaContenedor>
          </>
        )}
      </div>
    </div>
  );
}
