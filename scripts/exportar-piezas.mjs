// Exporta a PNG cada <section id="..."> de un HTML de contenido (carruseles, escenas de video, historias).
// Cada pieza se guarda junto al HTML como <id>.png.
// Uso: node scripts/exportar-piezas.mjs contenido/semana-02/carruseles.html [id1 id2 ...]
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [archivo, ...ids] = process.argv.slice(2);
if (!archivo) {
  console.error('Uso: node scripts/exportar-piezas.mjs <archivo.html> [ids...]');
  process.exit(1);
}
const ruta = path.resolve(archivo);
const carpeta = path.dirname(ruta);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 2000 } });
await p.goto(pathToFileURL(ruta).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
const todos = await p.locator('section[id]').evaluateAll((els) => els.map((e) => e.id));
for (const id of ids.length ? ids : todos) {
  await p.locator('#' + id).screenshot({ path: path.join(carpeta, `${id}.png`) });
  console.log('OK', id);
}
await b.close();
