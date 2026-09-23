// SALUD — errores agrupados por frecuencia y estado del webhook de Hotmart
// (21-BACKOFFICE). Los errores vienen de error_log (app/error.tsx,
// app/app/error.tsx, app/admin/error.tsx → /api/log-error).

import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { listarErroresAgrupados } from '@/lib/admin/queries';
import { Badge, SectionTitle, SinDatos, TablaContenedor } from '@/components/admin/ui';

export default async function AdminSalud() {
  const supabase = await crearClienteSupabaseServidor();
  const { recientes, agrupado } = await listarErroresAgrupados(supabase);

  return (
    <div>
      <SectionTitle subtitulo="Errores de la app y si los avisos de pago de Hotmart siguen llegando">Salud</SectionTitle>

      <div className="mb-8">
        <SectionTitle>Webhook de Hotmart</SectionTitle>
        <SinDatos motivo="Hotmart no está conectado todavía — en cuanto lo esté, aquí vas a ver si los avisos de pago siguen llegando con normalidad." />
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
