import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

// Endpoint que alimenta la sección "Salud" del backoffice (21-BACKOFFICE):
// el Error Boundary del cliente llama aquí en vez de insertar directo a
// `error_log` — así no hace falta abrir una política de INSERT pública en
// esa tabla (patrón "más robusto" del 21). Usa la clave de servicio porque
// un error puede ocurrir ANTES de tener sesión (landing, onboarding).
const Body = z.object({
  message: z.string().trim().min(1).max(500),
  context: z.string().trim().min(1).max(120),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Input inválido' }, { status: 400 });

  const supabaseSesion = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabaseSesion.auth.getUser();

  const admin = crearClienteSupabaseAdmin();
  await admin.from('error_log').insert({
    message: parsed.data.message,
    context: parsed.data.context,
    user_id: user?.id ?? null,
  });

  return NextResponse.json({ ok: true });
}
