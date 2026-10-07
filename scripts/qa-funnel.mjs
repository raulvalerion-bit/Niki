// Auto-QA del camino de venta: landing -> onboarding (completo) -> paywall -> link de Hotmart.
// Uso: node qa-funnel.mjs <baseUrl> <outDir>
import { chromium } from '@playwright/test';
const [, , base, out] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push('pageerror ' + e.message));
p.on('console', (m) => m.type() === 'error' && errs.push('console ' + m.text().slice(0, 160)));

await p.goto(base + '/?src=tiktok', { waitUntil: 'networkidle' });
console.log('landing title:', await p.title());
const ctas = await p.locator('a[href*="onboarding"]').count();
console.log('CTAs a onboarding:', ctas);
await p.locator('a[href*="onboarding"]').first().click();
await p.waitForURL(/onboarding/);

const SKIP = /volver|salir|atr[aá]s|empezar de nuevo|^niki$/i;
for (let i = 0; i < 40; i++) {
  await p.waitForTimeout(900);
  if (/paywall/.test(p.url())) break;
  const visibles = await p.locator('button:visible, a:visible').evaluateAll((els) =>
    els.map((e, idx) => ({ idx, t: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60), dis: e.disabled || e.getAttribute('aria-disabled') === 'true', pressed: e.getAttribute('aria-pressed') ?? e.getAttribute('aria-checked'), href: e.getAttribute('href') })));
  const h = (await p.locator('h1:visible, h2:visible').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  await p.screenshot({ path: `${out}/qa-ob-${String(i).padStart(2, '0')}.png` });
  console.log(`paso ${i} | ${h.slice(0, 70)} | ${visibles.map((v) => v.t + (v.dis ? '[x]' : '')).join(' · ').slice(0, 300)}`);
  // 1) si hay opciones (aria-pressed/aria-checked) y ninguna marcada, marca la primera
  const opciones = visibles.filter((v) => v.pressed !== null && v.pressed !== undefined);
  if (opciones.length && !opciones.some((o) => o.pressed === 'true')) {
    await p.locator('button:visible, a:visible').nth(opciones[0].idx).click();
    await p.waitForTimeout(500);
    continue;
  }
  // 2) botón de avance habilitado (el último no-skip, típicamente el CTA fijo)
  const avance = visibles.filter((v) => v.t && !SKIP.test(v.t) && !v.dis && (v.pressed === null || v.pressed === undefined));
  if (!avance.length) { await p.waitForTimeout(1500); continue; }
  const elegido = avance.find((v) => v.href && /paywall/.test(v.href)) || avance[avance.length - 1];
  await p.locator('button:visible, a:visible').nth(elegido.idx).click();
}
await p.waitForTimeout(1500);
console.log('URL final:', p.url());
await p.screenshot({ path: `${out}/qa-paywall.png`, fullPage: true });
const pago = await p.locator('a[href*="hotmart"], a[href*="pay."]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
console.log('links de pago:', pago);
const ls = await p.evaluate(() => ({ src: localStorage.getItem('niki_src'), plan: localStorage.getItem('niki_plan_preferido') }));
console.log('localStorage:', JSON.stringify(ls));
await p.evaluate(() => { const a = document.querySelector('a[href*="hotmart"]'); a?.addEventListener('click', (e) => e.preventDefault()); a?.click(); });
console.log('eventos embudo:', JSON.stringify(await p.evaluate(() => (window.vaq || []).filter((x) => x[0] === 'event').map((x) => x[1]))));

// Offline: la pantalla de planes sin red
await ctx.setOffline(true);
const botonPago = p.locator('a[href*="hotmart"], a[href*="pay."], button:has-text("prueba"), button:has-text("plan")').first();
console.log('boton pago visible offline:', await botonPago.isVisible().catch(() => false));
await ctx.setOffline(false);

// Login: correo vacío
await p.goto(base + '/login', { waitUntil: 'networkidle' });
await p.locator('button[type=submit], button:has-text("acceso")').first().click().catch(() => {});
await p.waitForTimeout(600);
console.log('login vacio ->', (await p.locator('[role=alert], [role=status]').allInnerTexts()).join(' | ').slice(0, 160));
await p.screenshot({ path: `${out}/qa-login-vacio.png` });

// 404
const r404 = await p.goto(base + '/no-existe-xyz');
console.log('404 status', r404.status(), (await p.locator('h1').first().innerText().catch(() => '')).slice(0, 80));
await p.screenshot({ path: `${out}/qa-404.png` });

console.log('ERRORES', errs.length, JSON.stringify(errs.slice(0, 8)));
await b.close();
