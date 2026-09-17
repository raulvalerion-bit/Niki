import { chromium } from '@playwright/test';

const [,, url, outPath] = process.argv;
if (!url || !outPath) {
  console.error('Uso: node screenshot-375.mjs <url> <outPath>');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 375, height: 812 },
  reducedMotion: 'reduce', // gates deben verse con contenido visible siempre
});
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(400); // deja terminar el fade-in del hero

// Scroll incremental para disparar TODOS los whileInView antes de capturar
// (fullPage screenshot no dispara IntersectionObserver de secciones no vistas).
const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 400;
for (let y = 0; y <= scrollHeight; y += step) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log('OK', outPath);
