// Prueba del aviso de cookies + píxel de Meta: sin aceptar no se carga nada de Meta;
// al aceptar se carga y manda PageView; en páginas legales no aparece el aviso.
// Uso: node scripts/prueba-pixel.mjs [url-base]  (por defecto http://localhost:3123)
import { chromium } from '@playwright/test';

const BASE = process.argv[2] ?? 'http://localhost:3123';
const b = await chromium.launch();
// Meta descarta a propósito los navegadores automáticos: se simula un celular real.
const ctx = await b.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-A145M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
});
await ctx.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
const p = await ctx.newPage();
const meta = [];
const erroresCsp = [];
p.on('request', (r) => { if (/facebook\.(net|com)/.test(r.url())) meta.push(r.url()); });
p.on('console', (m) => { if (/Content Security Policy/i.test(m.text())) erroresCsp.push(m.text()); });

const ok = (c, msg) => { console.log((c ? 'OK   ' : 'FALLA') + ' ' + msg); if (!c) process.exitCode = 1; };

await p.goto(BASE + '/', { waitUntil: 'load' });
const aviso = p.getByRole('region', { name: 'Aviso de cookies' });
await aviso.waitFor({ timeout: 8000 });
await p.waitForTimeout(800);
await p.screenshot({ path: 'docs/revisiones/aviso-cookies-375.png' });
ok(meta.length === 0, 'antes de decidir no se contacta a Meta');

await aviso.getByRole('button', { name: 'Rechazar' }).click();
await p.waitForTimeout(600);
ok(!(await aviso.isVisible()), 'Rechazar oculta el aviso');
await p.reload({ waitUntil: 'load' });
await p.waitForTimeout(1500);
ok(meta.length === 0 && !(await aviso.isVisible()), 'tras rechazar y recargar: sin aviso y sin Meta');

await p.evaluate(() => localStorage.removeItem('niki_cookies'));
await p.reload({ waitUntil: 'load' });
await aviso.getByRole('button', { name: 'Aceptar' }).click();
await p.waitForTimeout(4000);
ok(meta.some((u) => u.includes('connect.facebook.net')), 'al aceptar se carga el script de Meta');
ok(meta.some((u) => u.includes('facebook.com/tr') && u.includes('ev=PageView') && u.includes('1634146378098022')), 'al aceptar se envía PageView con el ID del píxel');

const antes = meta.length;
await p.goto(BASE + '/onboarding', { waitUntil: 'load' });
await p.waitForTimeout(4000);
ok(meta.slice(antes).some((u) => u.includes('ev=PageView')), 'el onboarding también registra la visita');
ok(!(await p.evaluate(() => JSON.stringify(window.fbq?.getState?.() ?? {}).includes('"em"'))), 'Meta no toma emails de la página (sin coincidencia automática)');

await p.evaluate(() => localStorage.removeItem('niki_cookies'));
await p.goto(BASE + '/privacidad', { waitUntil: 'load' });
await p.waitForTimeout(1000);
ok(!(await aviso.isVisible()), 'en páginas legales no aparece el aviso');
ok(erroresCsp.length === 0, 'sin bloqueos de la política de seguridad' + (erroresCsp[0] ? ': ' + erroresCsp[0] : ''));
await b.close();
