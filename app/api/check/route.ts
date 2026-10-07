import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';
import { tieneAcceso } from '@/lib/acceso';
import { analizarFoto, ErrorAnalisis, MODELO, normalizarNota } from '@/lib/ia/check-presencia';
import { LIMITE_CHECKS_DIA, OCASIONES_ALTO_IMPACTO, puntajeDe, type ResultadoCheck } from '@/lib/ia/resultado';
import { enviarCorreo } from '@/lib/email/enviar';

// Check de Presencia con IA real (BFF — 09/30). El navegador ya subió la foto
// a Storage (carpeta = su user_id); aquí se valida TODO en el servidor:
// sesión, plan vigente, límite de 3 al día y tope de gasto, y recién ahí se
// llama a la IA. La clave de la IA nunca sale de este archivo.

export const maxDuration = 60;

const OCASIONES = ['entrevista', 'cita', 'negocios', 'amigos', 'cena', 'vacaciones'] as const;

const Body = z.object({
  ocasion: z.enum(OCASIONES),
  foto: z.string().min(10).max(200),
  zonaHoraria: z.string().max(64).optional(),
});

const MAX_INTENTOS_DIA = 6; // incluye fotos que no sirvieron (anti-abuso)
const COSTO_RESERVA_USD = 0.05; // techo por análisis (~2x el costo esperado)
// "0" es válido: es el interruptor para pausar todos los análisis (kill-switch).
function topeUsd(valor: string | undefined, porDefecto: number): number {
  const n = Number(valor);
  return valor?.trim() && Number.isFinite(n) && n >= 0 ? n : porDefecto;
}
const TOPE_DIA_USD = topeUsd(process.env.AI_DAILY_BUDGET_USD, 5);
const TOPE_MES_USD = topeUsd(process.env.AI_MONTHLY_BUDGET_USD, TOPE_DIA_USD * 10);
const MAX_BYTES_FOTO = 5 * 1024 * 1024;

function zonaValida(z: string | undefined | null): string | null {
  if (!z) return null;
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: z });
    return z;
  } catch {
    return null;
  }
}

function fechaEn(zona: string) {
  // en-CA da el formato YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date()
  );
}

export async function POST(req: NextRequest) {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'sesion' }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'datos' }, { status: 400 });
  const { ocasion, foto } = parsed.data;

  // La foto tiene que ser SUYA (su carpeta) — nunca la de otra persona.
  if (!foto.startsWith(`${user.id}/`) || foto.includes('..')) {
    return NextResponse.json({ error: 'datos' }, { status: 400 });
  }

  const admin = crearClienteSupabaseAdmin();
  const { data: perfil } = await admin
    .from('profiles')
    .select('role, plan, plan_activo_hasta, suscripcion_estado, objetivo, zona_horaria')
    .eq('id', user.id)
    .single();
  if (!tieneAcceso(perfil)) return NextResponse.json({ error: 'sin_plan' }, { status: 403 });

  let zona = zonaValida(perfil?.zona_horaria);
  if (!zona) {
    zona = zonaValida(parsed.data.zonaHoraria) ?? 'America/Mexico_City';
    await admin.from('profiles').update({ zona_horaria: zona }).eq('id', user.id);
  }

  const { data: reserva, error: errorReserva } = await admin.rpc('reservar_check', {
    p_user: user.id,
    p_ocasion: ocasion,
    p_foto: foto,
    p_fecha_local: fechaEn(zona),
    p_limite_dia: LIMITE_CHECKS_DIA,
    p_max_intentos_dia: MAX_INTENTOS_DIA,
    p_tope_dia_usd: TOPE_DIA_USD,
    p_tope_mes_usd: TOPE_MES_USD,
    p_costo_reserva_usd: COSTO_RESERVA_USD,
    p_modelo: MODELO,
  });
  if (errorReserva || !reserva) {
    console.error('reservar_check falló:', errorReserva?.message);
    return NextResponse.json({ error: 'temporal' }, { status: 503 });
  }

  if (!reserva.ok) {
    switch (reserva.motivo) {
      case 'duplicado':
        return NextResponse.json({ error: 'duplicado', checkId: reserva.check_id }, { status: 409 });
      case 'limite':
      case 'intentos':
        return NextResponse.json({ error: 'limite', motivo: reserva.motivo }, { status: 429 });
      default:
        // Tope global de gasto: se pausa el análisis y se avisa al dueño.
        await avisarTopeAlDueno(admin, reserva.motivo);
        return NextResponse.json({ error: 'pausa' }, { status: 503 });
    }
  }

  const checkId: string = reserva.check_id;
  const aiCallId: string = reserva.ai_call_id;

  const finalizar = (p: {
    estado: 'listo' | 'invalida' | 'error';
    resultado?: ResultadoCheck | null;
    puntaje?: number | null;
    motivo?: string | null;
    tokensIn?: number;
    tokensOut?: number;
    costo?: number;
    latenciaMs?: number;
    error?: string | null;
  }) =>
    admin.rpc('finalizar_check', {
      p_check: checkId,
      p_ai_call: aiCallId,
      p_estado: p.estado,
      p_resultado: p.resultado ?? null,
      p_puntaje: p.puntaje ?? null,
      p_motivo: p.motivo ?? null,
      p_tokens_in: p.tokensIn ?? 0,
      p_tokens_out: p.tokensOut ?? 0,
      p_costo_usd: p.costo ?? 0,
      p_latencia_ms: p.latenciaMs ?? 0,
      p_error: p.error ?? null,
    });

  // Descarga la foto desde Storage (servidor → servidor).
  const { data: archivo, error: errorFoto } = await admin.storage.from('checks-fotos').download(foto);
  const tipo = archivo?.type;
  if (errorFoto || !archivo || archivo.size > MAX_BYTES_FOTO || !['image/jpeg', 'image/png', 'image/webp'].includes(tipo ?? '')) {
    await finalizar({ estado: 'invalida', motivo: 'archivo', error: 'foto_no_legible' });
    return NextResponse.json({ error: 'foto', motivo: 'archivo' }, { status: 422 });
  }
  const imagenBase64 = Buffer.from(await archivo.arrayBuffer()).toString('base64');

  try {
    const salida = await analizarFoto({
      imagenBase64,
      mediaType: tipo as 'image/jpeg' | 'image/png' | 'image/webp',
      ocasion,
      objetivo: perfil?.objetivo ?? null,
    });
    const gasto = { tokensIn: salida.tokensIn, tokensOut: salida.tokensOut, costo: salida.costo, latenciaMs: salida.latenciaMs };
    const r = salida.resultado;

    if (!r.foto_valida) {
      const motivo = r.motivo_invalida ?? 'no_cuerpo_entero';
      await finalizar({ estado: 'invalida', motivo, ...gasto });
      return NextResponse.json({ error: 'foto', motivo }, { status: 422 });
    }

    const resultado: ResultadoCheck = {
      outfit: { nota: normalizarNota(r.outfit.nota), comentario: r.outfit.comentario, tema: r.outfit.tema },
      postura: { nota: normalizarNota(r.postura.nota), comentario: r.postura.comentario, tema: r.postura.tema },
      actitud: { nota: normalizarNota(r.actitud.nota), comentario: r.actitud.comentario, tema: r.actitud.tema },
      ajuste_clave: r.ajuste_clave,
      frase_cierre: r.frase_cierre,
      plan_alto_impacto: OCASIONES_ALTO_IMPACTO.includes(ocasion) ? r.plan_alto_impacto : null,
    };
    const puntaje = puntajeDe(resultado);
    const { data: racha, error: errorFin } = await finalizar({ estado: 'listo', resultado, puntaje, ...gasto });
    if (errorFin) console.error('finalizar_check falló:', errorFin.message);
    if (racha?.hito) {
      await admin.from('event_log').insert({ tipo: 'racha_hito', user_id: user.id, metadata: { dias: racha.hito } });
    }

    await admin.from('event_log').insert({ tipo: 'check_analizado', user_id: user.id, metadata: { ocasion, puntaje } });
    const { data: gemas } = await admin.from('profiles').select('gemas').eq('id', user.id).single();

    return NextResponse.json({
      checkId,
      resultado,
      puntaje,
      gemas: gemas?.gemas ?? null,
      racha: racha?.racha ? racha : null,
      restantes: Math.max(0, LIMITE_CHECKS_DIA - (reserva.usados as number)),
    });
  } catch (e) {
    const gasto = e instanceof ErrorAnalisis ? e.gasto : undefined;
    const codigo = e instanceof ErrorAnalisis ? e.codigo : e instanceof Error ? e.name : 'desconocido';
    console.error('Análisis de IA falló:', codigo);
    await finalizar({ estado: 'error', motivo: 'ia', error: codigo, ...gasto });
    return NextResponse.json({ error: 'ia' }, { status: 502 });
  }
}

async function avisarTopeAlDueno(admin: ReturnType<typeof crearClienteSupabaseAdmin>, motivo: string) {
  try {
    const hoy = new Date().toISOString().slice(0, 10);
    const { count } = await admin
      .from('event_log')
      .select('id', { count: 'exact', head: true })
      .eq('tipo', 'ia_tope_alcanzado')
      .gte('created_at', hoy);
    if (count) return; // un solo aviso por día
    await admin.from('event_log').insert({ tipo: 'ia_tope_alcanzado', metadata: { motivo } });

    const { data: admins } = await admin.from('profiles').select('email').eq('role', 'admin');
    const tope = motivo === 'tope_mes' ? `mensual (US$${TOPE_MES_USD})` : `diario (US$${TOPE_DIA_USD})`;
    for (const a of admins ?? []) {
      await enviarCorreo({
        para: a.email,
        asunto: 'Niki pausó los análisis: se alcanzó el tope de gasto de IA',
        texto: `Se alcanzó el tope ${tope} de gasto en IA y Niki pausó los Checks de Presencia para no seguir gastando. Revisa el panel (Salud → Costo de IA). Si es uso normal, sube AI_DAILY_BUDGET_USD en Vercel.`,
        html: `<p>Se alcanzó el tope <b>${tope}</b> de gasto en IA y Niki pausó los Checks de Presencia para no seguir gastando.</p><p>Revisa tu panel. Si es uso normal (más clientes), sube <code>AI_DAILY_BUDGET_USD</code> en Vercel.</p>`,
      });
    }
  } catch (e) {
    console.error('No se pudo avisar del tope de IA:', e instanceof Error ? e.message : e);
  }
}
