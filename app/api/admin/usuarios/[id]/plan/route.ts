import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verificarAdmin } from '@/lib/admin/verificar';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

// Cambia el plan de un usuario a mano (21-BACKOFFICE: "activar/desactivar un
// usuario, por si el webhook falla"). Nunca pasa por el cliente autenticado
// normal: la columna `plan` está fuera de sus GRANT (ver migración del
// backoffice) — solo la clave de servicio puede escribirla.
const Body = z.object({ plan: z.enum(['ninguno', 'trial', 'anual', 'mensual', 'cancelado']) });

const DIAS_POR_PLAN: Record<string, number | null> = { ninguno: null, trial: 3, anual: 365, mensual: 30, cancelado: null };

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { esAdmin } = await verificarAdmin();
  if (!esAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const dias = DIAS_POR_PLAN[parsed.data.plan];
  const plan_activo_hasta = dias ? new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString() : null;

  const admin = crearClienteSupabaseAdmin();
  const { error } = await admin.from('profiles').update({ plan: parsed.data.plan, plan_activo_hasta }).eq('id', id);
  if (error) return NextResponse.json({ error: 'No se pudo actualizar el plan.' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
