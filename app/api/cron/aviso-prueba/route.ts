import { NextRequest, NextResponse } from 'next/server';
import { cronAutorizado } from '@/lib/cron';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarCorreo } from '@/lib/email/enviar';
import { correoAvisoFinPrueba } from '@/lib/email/aviso-fin-prueba';
import { correoReenganchePrueba } from '@/lib/email/reenganche-prueba';
import { tocaReenganche } from '@/lib/prueba';

// AVISO "TU PRUEBA TERMINA MAÑANA" — lo llama el cron diario de Vercel
// (vercel.json). Busca pruebas que terminan entre 12 y 36 h desde ahora: con
// una corrida al día, cada prueba cae exactamente una vez en esa ventana.
// Marca aviso_fin_prueba_at para no repetir el correo si el cron se reintenta.

export const runtime = 'nodejs';

const HORA_MS = 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  if (!cronAutorizado(req.headers.get('authorization'))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = crearClienteSupabaseAdmin();
  const ahora = Date.now();
  const { data: pruebas, error } = await admin
    .from('profiles')
    .select('id, email, nombre, trial_ends_at')
    .eq('suscripcion_estado', 'trialing')
    .is('aviso_fin_prueba_at', null)
    .gte('trial_ends_at', new Date(ahora + 12 * HORA_MS).toISOString())
    .lte('trial_ends_at', new Date(ahora + 36 * HORA_MS).toISOString())
    .limit(200);
  if (error) {
    console.error('cron aviso-prueba: no se pudo leer', { code: error.code });
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  let enviados = 0;
  let fallidos = 0;
  for (const p of pruebas ?? []) {
    try {
      const correo = correoAvisoFinPrueba({ nombre: p.nombre, finPrueba: new Date(p.trial_ends_at) });
      await enviarCorreo({ para: p.email, ...correo });
      await admin.from('profiles').update({ aviso_fin_prueba_at: new Date().toISOString() }).eq('id', p.id);
      enviados++;
    } catch (e) {
      fallidos++;
      const motivo = e instanceof Error ? e.message : 'desconocido';
      console.error('cron aviso-prueba: fallo un envío', { motivo });
      await admin.from('error_log').insert({ context: 'cron_aviso_prueba', message: motivo });
    }
  }

  // D1 del puente (02C): quien activó la prueba y no ha hecho ningún Check recibe un recordatorio
  // con el dolor #1 del avatar. Una sola vez (aviso_reenganche_at), nunca el mismo día del aviso de fin.
  let reenganches = 0;
  const { data: sinUso, error: errorSinUso } = await admin
    .from('profiles')
    .select('id, email, nombre, trial_ends_at')
    .eq('suscripcion_estado', 'trialing')
    .is('aviso_reenganche_at', null)
    .gte('trial_ends_at', new Date(ahora + 12 * HORA_MS).toISOString())
    .limit(200);
  if (errorSinUso) console.error('cron aviso-prueba: no se pudo leer reenganche', { code: errorSinUso.code });
  for (const p of sinUso ?? []) {
    const fin = new Date(p.trial_ends_at);
    if (!p.email || !tocaReenganche(fin, new Date(ahora))) continue;
    const { count } = await admin.from('checks').select('id', { count: 'exact', head: true }).eq('user_id', p.id).eq('estado', 'listo');
    if ((count ?? 0) > 0) continue;
    try {
      await enviarCorreo({ para: p.email, ...correoReenganchePrueba({ nombre: p.nombre, finPrueba: fin }) });
      await admin.from('profiles').update({ aviso_reenganche_at: new Date().toISOString() }).eq('id', p.id);
      await admin.from('event_log').insert({ tipo: 'prueba_reenganche_correo', user_id: p.id });
      reenganches++;
    } catch (e) {
      fallidos++;
      const motivo = e instanceof Error ? e.message : 'desconocido';
      console.error('cron aviso-prueba: fallo un reenganche', { motivo });
      await admin.from('error_log').insert({ context: 'cron_reenganche_prueba', message: motivo });
    }
  }

  return NextResponse.json({ ok: true, enviados, reenganches, fallidos });
}
