import { NextResponse } from 'next/server';
import { verificarAdmin } from '@/lib/admin/verificar';
import { correrReconciliacion } from '@/lib/hotmart/correr-reconciliacion';

// Botón "Revisar ahora" del panel (Salud). Solo admin, verificado en el servidor.
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST() {
  const { esAdmin } = await verificarAdmin();
  if (!esAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const r = await correrReconciliacion('manual');
  return NextResponse.json({ ok: r.ok, error: r.error, diferencias: r.diferencias.length });
}
