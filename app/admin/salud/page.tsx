// SALUD — errores agrupados por frecuencia y estado del webhook de Hotmart
// (21-BACKOFFICE). Los errores vienen de error_log (app/error.tsx,
// app/app/error.tsx, app/admin/error.tsx → /api/log-error).

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { listarAvisosHotmart, listarErroresAgrupados } from '@/lib/admin/queries';
import { Badge, SectionTitle, SinDatos, TablaContenedor } from '@/components/admin/ui';

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
  const [{ recientes, agrupado }, avisos] = await Promise.all([listarErroresAgrupados(supabase), listarAvisosHotmart(supabase)]);

  return (
    <div>
      <SectionTitle subtitulo="Errores de la app y si los avisos de pago de Hotmart siguen llegando">Salud</SectionTitle>

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
