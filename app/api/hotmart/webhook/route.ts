import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { decidir, parsearPayload, resumenSinDatosPersonales } from '@/lib/hotmart/evento';

// WEBHOOK DE HOTMART — Hotmart avisa aquí cada compra, prueba, cobro,
// cancelación y reembolso (URL registrada en su panel: Herramientas → Webhook,
// versión 2.0.0). Pipeline de 18-VENTA-HOTMART.md / 61-INTEGRIDAD:
// hottok en tiempo constante → parseo → catálogo + frescura → cuenta de auth
// (ANTES de marcar procesado: si falla, Hotmart reintenta) → RPC atómica
// (dedupe + ledger + plan) → 200. Nunca se registra el correo ni el nombre.

export const runtime = 'nodejs';

type Resultado = 'applied' | 'duplicate' | 'illegal' | 'unauthorized' | 'ignored' | 'error';

function hottokValido(recibido: string | null, esperado: string): boolean {
  if (!recibido) return false;
  // Se comparan los hash (misma longitud) para no filtrar ni el largo del token.
  const a = crypto.createHash('sha256').update(recibido).digest();
  const b = crypto.createHash('sha256').update(esperado).digest();
  return crypto.timingSafeEqual(a, b);
}

async function registrar(
  admin: SupabaseClient,
  fila: { event_id?: string | null; tipo?: string | null; resultado: Resultado; motivo?: string | null; resumen?: unknown },
) {
  const { error } = await admin.from('webhook_log').insert(fila);
  if (error) console.error('webhook hotmart: no se pudo registrar en webhook_log', { code: error.code });
}

async function buscarPerfil(admin: SupabaseClient, subscriberCode: string | null, email: string | null) {
  if (subscriberCode) {
    const { data } = await admin.from('profiles').select('id').eq('hotmart_subscriber_code', subscriberCode).limit(1).maybeSingle();
    if (data) return data.id as string;
  }
  if (email) {
    const { data } = await admin.from('profiles').select('id').eq('email', email).limit(1).maybeSingle();
    if (data) return data.id as string;
  }
  return null;
}

/** Crea la cuenta sin contraseña del comprador. El trigger on_auth_user_created
    crea su profile; el comprador entra en /login con el código por correo. */
async function crearCuenta(admin: SupabaseClient, email: string, nombre: string): Promise<string | null> {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: nombre ? { name: nombre } : undefined,
  });
  if (error || !data.user) {
    // Puede que un reintento simultáneo ya la haya creado: se vuelve a buscar.
    return buscarPerfil(admin, null, email);
  }
  await admin.from('profiles').update({ creado_via: 'hotmart' }).eq('id', data.user.id);
  return data.user.id;
}

export async function POST(req: NextRequest) {
  const esperado = process.env.HOTMART_HOTTOK;
  const admin = crearClienteSupabaseAdmin();

  // Fail-secure: sin el hottok configurado no se acepta NINGÚN aviso.
  if (!esperado) {
    console.error('webhook hotmart: falta HOTMART_HOTTOK');
    await registrar(admin, { resultado: 'error', motivo: 'falta_hottok_en_servidor' });
    return NextResponse.json({ error: 'not configured' }, { status: 503 });
  }

  const rawBody = await req.text();
  let json: unknown = null;
  try {
    json = JSON.parse(rawBody);
  } catch {
    json = null;
  }

  // El hottok llega en el encabezado (versión 2.0.0); algunos envíos lo traen en el cuerpo.
  const hottokCuerpo =
    json && typeof json === 'object' && 'hottok' in json && typeof (json as { hottok: unknown }).hottok === 'string'
      ? (json as { hottok: string }).hottok
      : null;
  if (!hottokValido(req.headers.get('x-hotmart-hottok') ?? hottokCuerpo, esperado)) {
    await registrar(admin, { resultado: 'unauthorized' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const payload = parsearPayload(json);
  if (!payload) {
    await registrar(admin, { resultado: 'ignored', motivo: 'cuerpo_invalido' });
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  const resumen = resumenSinDatosPersonales(payload);
  const decision = decidir(payload);
  if (decision.tipo === 'ignorar') {
    await registrar(admin, { event_id: payload.id ?? null, tipo: payload.event, resultado: 'ignored', motivo: decision.motivo, resumen });
    return NextResponse.json({ received: true, result: 'ignored' });
  }

  try {
    let userId = await buscarPerfil(admin, decision.subscriberCode, decision.email);
    if (!userId && decision.creaCuenta && decision.email) {
      userId = await crearCuenta(admin, decision.email, decision.nombre);
      if (!userId) throw new Error('no_se_pudo_crear_la_cuenta');
    }

    const { data, error } = await admin.rpc('apply_hotmart_event', {
      p_event_id: decision.eventId,
      p_event_type: decision.evento,
      p_payload_hash: crypto.createHash('sha256').update(rawBody).digest('hex'),
      p_user_id: userId,
      p_nombre: decision.nombre,
      p_nuevo_estado: decision.nuevoEstado,
      p_plan: decision.plan,
      p_hasta: decision.hasta?.toISOString() ?? null,
      p_trial_hasta: decision.trialHasta?.toISOString() ?? null,
      p_subscriber_code: decision.subscriberCode,
      p_transaction: decision.transaction,
      p_sck: decision.sck,
      p_ledger_kind: decision.ledger?.kind ?? null,
      p_amount_minor: decision.ledger?.amountMinor ?? null,
      p_currency: decision.ledger?.currency ?? null,
      p_product_id: decision.productId,
      p_occurred_at: decision.ocurrio?.toISOString() ?? null,
    });
    if (error) throw new Error(`rpc_${error.code ?? 'sin_codigo'}`);

    const status = (data as { status?: string } | null)?.status;
    if (status === 'error') throw new Error('rpc_sin_perfil');
    const resultado: Resultado = status === 'duplicate' ? 'duplicate' : status === 'illegal_transition' ? 'illegal' : 'applied';
    await registrar(admin, {
      event_id: decision.eventId,
      tipo: decision.evento,
      resultado,
      motivo: userId ? null : 'sin_cuenta',
      resumen,
    });
    // 200 también en duplicado/ilegal: la decisión está tomada, Hotmart deja de reintentar.
    return NextResponse.json({ received: true, result: resultado });
  } catch (e) {
    const motivo = e instanceof Error ? e.message : 'desconocido';
    console.error('webhook hotmart: fallo al procesar', { evento: decision.evento, motivo });
    await registrar(admin, { event_id: decision.eventId, tipo: decision.evento, resultado: 'error', motivo, resumen });
    // 5xx: Hotmart reintenta y el evento NO quedó marcado como procesado.
    return NextResponse.json({ error: 'processing failed' }, { status: 500 });
  }
}
