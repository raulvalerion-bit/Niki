// Exporta las piezas del aviso previo desde contenido/aviso-previo/aviso-previo.html.
// Uso: node scripts/exportar-aviso.mjs dia3 historia3
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const nombres = {
  dia1: 'publicacion-dia1',
  dia2: 'publicacion-dia2',
  dia3: 'publicacion-dia3',
  historia1: 'historia-dia1',
  historia2: 'historia-dia2',
  historia3: 'historia-dia3',
};
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 2000 } });
await p.goto(pathToFileURL(path.resolve('contenido/aviso-previo/aviso-previo.html')).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
for (const id of process.argv.slice(2)) {
  await p.locator('#' + id).screenshot({ path: `contenido/aviso-previo/${nombres[id]}.png` });
  console.log('OK', id);
}
await b.close();
