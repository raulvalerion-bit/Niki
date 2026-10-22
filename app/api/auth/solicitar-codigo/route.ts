import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

// Puerta de entrada ÚNICA para pedir el código de acceso por correo. Antes
// app/login/page.tsx llamaba a supabase.auth.signInWithOtp directo desde el
// navegador — sin ningún freno, cualquiera podía usar el formulario para
// mandar correos de "tu código es..." a una lista larga de direcciones al
// azar (shouldCreateUser:true crea la cuenta en auth.users apenas se PIDE el
// código, antes de verificarlo — hallazgo 2026-10-22, ver ESTADO.md).
// Esta ruta pasa primero por solicitar_otp_permitido (máx 5 solicitudes por
// IP cada 15 min, supabase/migrations/20261022000000_rate_limit_otp.sql)
// antes de pedirle a Supabase que mande el correo.

const Body = z.object({ correo: z.string().email().max(254) });

function ipDe(req: NextRequest): string {
  const reenviado = req.headers.get('x-forwarded-for');
  if (reenviado) return reenviado.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'desconocida';
}

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'datos' }, { status: 400 });

  const admin = crearClienteSupabaseAdmin();
  const ip = ipDe(req);

  const { data: permitido, error: errorLimite } = await admin.rpc('solicitar_otp_permitido', {
    p_ip: ip,
  });
  if (errorLimite) return NextResponse.json({ error: 'servidor' }, { status: 500 });
  if (!permitido) return NextResponse.json({ error: 'limite' }, { status: 429 });

  const { error: errorEnvio } = await admin.auth.signInWithOtp({
    email: parsed.data.correo,
    options: { shouldCreateUser: true },
  });
  if (errorEnvio) return NextResponse.json({ error: 'envio' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
