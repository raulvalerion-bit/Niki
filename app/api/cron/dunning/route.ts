import { NextRequest, NextResponse } from 'next/server';
import { cronAutorizado } from '@/lib/cron';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { enviarCorreo } from '@/lib/email/enviar';
import { correoDunning } from '@/lib/email/dunning';
import { DIAS_GRACIA_ATRASO, diaLimite, pasoQueToca, tipoDeCobro } from '@/lib/dunning';

// COBROS FALLIDOS (dunning, 58) — lo llama el cron diario de Vercel (vercel.json). Recorre a
// quien está en past_due y le manda el correo de la cadencia (días 1/3/5/7) que le toque.
// dunning_paso evita repetir un correo si el cron se reintenta. El trigger dunning_marcar
// registra inicio y final del atraso en event_log; aquí se registra cada correo enviado.

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!cronAutorizado(req.headers.get('authorization'))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = crearClienteSupabaseAdmin();
  const ahora = new Date();
  const { data: atrasados, error } = await admin
    .from('profiles')
    .select('id, email, nombre, past_due_desde, dunning_paso, pago_metodo')
    .eq('suscripcion_estado', 'past_due')
    .not('past_due_desde', 'is', null)
    .lt('dunning_paso', 4)
    .limit(500);
  if (error) {
    console.error('cron dunning: no se pudo leer', { code: error.code });
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  let enviados = 0;
  let fallidos = 0;
  for (const p of atrasados ?? []) {
    const desde = new Date(p.past_due_desde);
    const paso = pasoQueToca(desde, p.dunning_paso, ahora);
    if (!paso || !p.email) continue;
    try {
      const tipo = tipoDeCobro(p.pago_metodo);
      const correo = correoDunning({ paso, tipo, nombre: p.nombre, limite: diaLimite(desde, DIAS_GRACIA_ATRASO) });
      await enviarCorreo({ para: p.email, ...correo });
      await admin.from('profiles').update({ dunning_paso: paso }).eq('id', p.id);
      await admin.from('event_log').insert({ tipo: 'dunning_correo', user_id: p.id, metadata: { paso, tipo } });
      enviados++;
    } catch (e) {
      fallidos++;
      const motivo = e instanceof Error ? e.message : 'desconocido';
      console.error('cron dunning: fallo un envío', { motivo });
      await admin.from('error_log').insert({ context: 'cron_dunning', message: motivo });
    }
  }

  return NextResponse.json({ ok: true, enviados, fallidos });
}
