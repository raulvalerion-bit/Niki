import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { crearClienteSupabaseAdmin } from '@/lib/supabase/admin';

// Borrado de cuenta por el propio usuario (47 LEGAL + 61 Gate 4). Borra sus
// fotos de Storage y su usuario de Auth; profiles, checks y hábitos se van en
// cascada (FK on delete cascade). El registro de pagos queda sin vínculo
// personal (user_id → null) porque es un respaldo contable.
// La suscripción de Hotmart NO se cancela desde aquí: se cancela en Hotmart
// (la pantalla se lo pide antes de confirmar).

const Body = z.object({ confirmacion: z.literal('ELIMINAR') });

export async function POST(req: NextRequest) {
  const supabase = await crearClienteSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'sesion' }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'confirmacion' }, { status: 400 });

  const admin = crearClienteSupabaseAdmin();

  // 1) Fotos: todo lo que haya en su carpeta del bucket privado.
  const carpeta = user.id;
  for (;;) {
    const { data: archivos, error } = await admin.storage.from('checks-fotos').list(carpeta, { limit: 100 });
    if (error) return NextResponse.json({ error: 'fotos' }, { status: 500 });
    if (!archivos || archivos.length === 0) break;
    const { error: errorBorrar } = await admin.storage
      .from('checks-fotos')
      .remove(archivos.map((a) => `${carpeta}/${a.name}`));
    if (errorBorrar) return NextResponse.json({ error: 'fotos' }, { status: 500 });
    if (archivos.length < 100) break;
  }

  // 2) Usuario de Auth → cascada a profiles, checks, habito_registros.
  const { error: errorUsuario } = await admin.auth.admin.deleteUser(user.id);
  if (errorUsuario) return NextResponse.json({ error: 'cuenta' }, { status: 500 });

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
