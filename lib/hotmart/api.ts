import { z } from 'zod';
import { HOTMART_PRODUCT_ID } from '@/lib/hotmart/evento';
import type { SuscripcionHotmart } from '@/lib/hotmart/reconciliar';

// Cliente MÍNIMO de la API de Hotmart (solo lectura de suscripciones) para la
// reconciliación semanal. Credenciales del panel de Hotmart → Herramientas →
// Credenciales: HOTMART_CLIENT_ID y HOTMART_CLIENT_SECRET, solo en el servidor
// (Vercel, Sensitive). El "Basic" que muestra Hotmart es base64(id:secret): se
// calcula aquí para no pedir una tercera variable.

const URL_TOKEN = 'https://api-sec-vlc.hotmart.com/security/oauth/token';
const URL_SUSCRIPCIONES = 'https://developers.hotmart.com/payments/api/v1/subscriptions';
/** Sin esta fecha Hotmart devuelve solo los últimos 30 días. Niki empezó a vender en sep-2026. */
const DESDE_MS = Date.UTC(2026, 8, 1);
const MAX_PAGINAS = 50;
const TIMEOUT_MS = 20_000;

export class FaltanCredencialesHotmart extends Error {
  constructor() {
    super('faltan_credenciales_hotmart');
  }
}

const Token = z.object({ access_token: z.string().min(1) });

const Pagina = z.object({
  items: z
    .array(
      z.object({
        subscriber_code: z.string().optional(),
        status: z.string().optional(),
        product: z.object({ id: z.union([z.number(), z.string()]).optional() }).partial().optional(),
        subscriber: z.object({ email: z.string().optional(), name: z.string().optional() }).partial().optional(),
      })
    )
    .default([]),
  page_info: z.object({ next_page_token: z.string().optional() }).partial().optional(),
});

async function obtenerToken(): Promise<string> {
  const id = process.env.HOTMART_CLIENT_ID;
  const secreto = process.env.HOTMART_CLIENT_SECRET;
  if (!id || !secreto) throw new FaltanCredencialesHotmart();

  const url = `${URL_TOKEN}?${new URLSearchParams({ grant_type: 'client_credentials', client_id: id, client_secret: secreto })}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secreto}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`hotmart_token_${res.status}`);
  const datos = Token.safeParse(await res.json().catch(() => null));
  if (!datos.success) throw new Error('hotmart_token_formato');
  return datos.data.access_token;
}

/** Todas las suscripciones del producto Niki, en cualquier estado. */
export async function listarSuscripcionesHotmart(): Promise<SuscripcionHotmart[]> {
  const token = await obtenerToken();
  const resultado: SuscripcionHotmart[] = [];
  let pageToken: string | undefined;

  for (let i = 0; i < MAX_PAGINAS; i++) {
    const params = new URLSearchParams({ product_id: HOTMART_PRODUCT_ID, max_results: '500', accession_date: String(DESDE_MS) });
    if (pageToken) params.set('page_token', pageToken);
    const res = await fetch(`${URL_SUSCRIPCIONES}?${params}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`hotmart_suscripciones_${res.status}`);
    const pagina = Pagina.safeParse(await res.json().catch(() => null));
    if (!pagina.success) throw new Error('hotmart_suscripciones_formato');

    for (const it of pagina.data.items) {
      if (!it.subscriber_code || !it.status) continue;
      resultado.push({
        codigo: it.subscriber_code,
        estado: it.status,
        email: it.subscriber?.email?.toLowerCase() ?? null,
        nombre: it.subscriber?.name ?? null,
        productoId: String(it.product?.id ?? HOTMART_PRODUCT_ID),
      });
    }
    pageToken = pagina.data.page_info?.next_page_token;
    if (!pageToken) return resultado;
  }
  throw new Error('hotmart_suscripciones_demasiadas_paginas');
}
