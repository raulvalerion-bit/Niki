// Uso local: MSYS_NO_PATHCONV=1 node scripts/captura-sesion.mjs "/app/progreso=docs/revisiones/x-375.png" (requiere next start -p 3124).
// Captura local con sesión del dueño (no envía correo; no imprime secretos).
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { chromium } from '@playwright/test';
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]));
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const { data: link, error: e1 } = await admin.auth.admin.generateLink({ type: 'magiclink', email: 'raulvalerion@gmail.com' });
if (e1) throw new Error('generateLink: ' + e1.message);
const jar = new Map();
const ssr = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
  cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: (cs) => cs.forEach((c) => jar.set(c.name, c.value)) },
});
const { error: e2 } = await ssr.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'magiclink' });
if (e2) throw new Error('verifyOtp: ' + e2.message);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 } });
await ctx.addCookies([...jar].map(([name, value]) => ({ name, value, domain: 'localhost', path: '/' })));
const p = await ctx.newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)));
const rutas = process.argv.slice(2);
for (const r of rutas) {
  const [ruta, archivo] = r.split('=');
  await p.goto('http://localhost:3124' + ruta, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: archivo, fullPage: true });
  console.log('OK', ruta, '->', archivo, p.url());
}
console.log('errores', errs.length, errs.slice(0, 3));
await b.close();
