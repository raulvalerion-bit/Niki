import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verificarAdmin } from '@/lib/admin/verificar';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

// Crea un usuario manualmente (21-BACKOFFICE, sección Usuarios) — para cuando
// el dueño quiere invitar a alguien o el acceso no le llegó por Hotmart.
// SIN contraseña (26-AUTH-MODERNO, decisión Hotmart-first): el usuario entra
// después con el código de 8 dígitos por correo, igual que un comprador real.
const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  nombre: z.string().trim().min(1).max(120),
  plan: z.enum(['ninguno', 'trial', 'anual', 'mensual']).default('ninguno'),
});

const DIAS_POR_PLAN: Record<string, number | null> = { ninguno: null, trial: 3, anual: 365, mensual: 30 };

export async function POST(req: NextRequest) {
  // 1-3: sesión + rol admin verificados EN EL SERVIDOR (nunca solo ocultar el botón).
  const { esAdmin } = await verificarAdmin();
  if (!esAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.data ?? 'Datos inválidos' }, { status: 400 });
  }
  const { email, nombre, plan } = parsed.data;

  const admin = crearClienteSupabaseAdmin();

  const { data: creado, error: errorCrear } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (errorCrear || !creado.user) {
    // Mensaje genérico — no revelar si el correo ya existía (anti-enumeración, 26-AUTH-MODERNO).
    return NextResponse.json({ error: 'No se pudo crear esa cuenta. Verifica el correo e intenta de nuevo.' }, { status: 400 });
  }

  const dias = DIAS_POR_PLAN[plan];
  const plan_activo_hasta = dias ? new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString() : null;

  // El trigger on_auth_user_created ya insertó el profile (email + defaults) —
  // aquí se completa con lo que el dueño ingresó a mano.
  const { error: errorUpdate } = await admin
    .from('profiles')
    .update({ nombre, plan, plan_activo_hasta, creado_via: 'manual' })
    .eq('id', creado.user.id);

  if (errorUpdate) {
    return NextResponse.json({ error: 'La cuenta se creó pero no se pudo completar su perfil.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: creado.user.id });
}
