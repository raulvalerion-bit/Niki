import { NextRequest, NextResponse } from 'next/server';
import { cronAutorizado } from '@/lib/cron';
import { correrReconciliacion } from '@/lib/hotmart/correr-reconciliacion';

// RECONCILIACIÓN SEMANAL Hotmart ↔ Niki (vercel.json, lunes 14:00 UTC = 8 am CDMX).
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!cronAutorizado(req.headers.get('authorization'))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const r = await correrReconciliacion('cron');
  return NextResponse.json({ ok: r.ok, diferencias: r.diferencias.length });
}
