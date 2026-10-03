import crypto from 'node:crypto';

/** Vercel Cron manda `Authorization: Bearer <CRON_SECRET>`. Comparación en tiempo constante. */
export function cronAutorizado(header: string | null): boolean {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || !header) return false;
  const a = crypto.createHash('sha256').update(header).digest();
  const b = crypto.createHash('sha256').update(`Bearer ${secreto}`).digest();
  return crypto.timingSafeEqual(a, b);
}
