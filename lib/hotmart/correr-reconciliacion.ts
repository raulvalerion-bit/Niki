import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarCorreo } from '@/lib/email/enviar';
import { FaltanCredencialesHotmart, listarSuscripcionesHotmart } from '@/lib/hotmart/api';
import { reconciliar, type Diferencia } from '@/lib/hotmart/reconciliar';

// Corre la reconciliación (cron semanal o botón del panel), guarda la corrida
// en reconciliacion_hotmart y avisa por correo a los admins SOLO si hay
// diferencias o falló. Si faltan las credenciales no manda correo: lo muestra
// el panel (Salud).

const escapar = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const TITULO: Record<Diferencia['tipo'], string> = {
  pagando_sin_acceso: 'Paga y no puede entrar',
  acceso_sin_pago: 'Entra sin estar pagando',
};

export async function correrReconciliacion(origen: 'cron' | 'manual') {
  const admin = crearClienteSupabaseAdmin();
  let resumen: { ok: boolean; error: string | null; diferencias: Diferencia[]; totalHotmart: number; totalConAcceso: number; manuales: number };

  try {
    const [suscripciones, { data: perfiles, error }] = await Promise.all([
      listarSuscripcionesHotmart(),
      admin
        .from('profiles')
        .select('email, nombre, plan, plan_activo_hasta, suscripcion_estado, hotmart_subscriber_code, creado_via')
        .limit(10000),
    ]);
    if (error) throw new Error('lectura_profiles');
    resumen = { ok: true, error: null, ...reconciliar(suscripciones, perfiles ?? []) };
  } catch (e) {
    const motivo = e instanceof FaltanCredencialesHotmart ? 'faltan_credenciales' : e instanceof Error ? e.message : 'desconocido';
    resumen = { ok: false, error: motivo, diferencias: [], totalHotmart: 0, totalConAcceso: 0, manuales: 0 };
  }

  await admin.from('reconciliacion_hotmart').insert({
    origen,
    ok: resumen.ok,
    error: resumen.error,
    total_hotmart: resumen.totalHotmart,
    total_con_acceso: resumen.totalConAcceso,
    manuales: resumen.manuales,
    diferencias: resumen.diferencias,
  });

  const avisar = resumen.diferencias.length > 0 || (!resumen.ok && resumen.error !== 'faltan_credenciales');
  if (avisar) {
    try {
      const { data: admins } = await admin.from('profiles').select('email').eq('role', 'admin');
      const correo = armarCorreo(resumen.ok, resumen.error, resumen.diferencias);
      for (const a of admins ?? []) await enviarCorreo({ para: a.email, ...correo });
    } catch (e) {
      await admin.from('error_log').insert({ context: 'reconciliacion_correo', message: e instanceof Error ? e.message : 'desconocido' });
    }
  }
  return resumen;
}

function armarCorreo(ok: boolean, error: string | null, diferencias: Diferencia[]) {
  if (!ok) {
    return {
      asunto: 'Niki no pudo revisar las suscripciones de Hotmart',
      texto: `La revisión semanal de accesos falló (${error}). Revisa tu panel → Salud y vuelve a intentarlo con "Revisar ahora".`,
      html: `<p>La revisión semanal de accesos falló (<code>${escapar(error ?? '')}</code>).</p><p>Revisa tu panel → <b>Salud</b> y vuelve a intentarlo con "Revisar ahora".</p>`,
    };
  }
  const lineas = diferencias.map((d) => `${TITULO[d.tipo]} — ${d.nombre ?? 'sin nombre'} <${d.email ?? 'sin correo'}>: ${d.detalle}`);
  return {
    asunto: `Niki: ${diferencias.length} ${diferencias.length === 1 ? 'acceso no cuadra' : 'accesos no cuadran'} con Hotmart`,
    texto: `La revisión semanal encontró diferencias entre Hotmart y Niki:\n\n${lineas.join('\n')}\n\nCorrígelas desde tu panel → Usuarios.`,
    html: `<p>La revisión semanal encontró diferencias entre Hotmart y Niki:</p><ul>${diferencias
      .map((d) => `<li><b>${TITULO[d.tipo]}</b> — ${escapar(d.nombre ?? 'sin nombre')} &lt;${escapar(d.email ?? 'sin correo')}&gt;: ${escapar(d.detalle)}</li>`)
      .join('')}</ul><p>Corrígelas desde tu panel → <b>Usuarios</b>.</p>`,
  };
}
