# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/repaso-2026-10-17/qa-paywall-01-arriba.png (+ 02-medio.png, 03-abajo.png)
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: ver lista

Detalle usabilidad: h1:4 h2:4 h3:4 h4:4 h5:3 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:4 profundidad:4 identidad:3 movimiento:3 encaje:4
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:4

Tipo de pasada: re-certificación independiente desde cero, con contexto limpio, sobre el código
posterior al commit ec364f0 (mismo día 2026-10-16, 9 min después del veredicto anterior).
Capturas nuevas de esta sesión: dev local, 375×812, reducedMotion activado, cookies aceptadas,
3 tramos de scroll real SIN `fullPage` (evita el artefacto de `position: fixed` del veredicto
previo). Badge rojo "2 Issues" visible en las capturas = overlay de depuración de Next.js dev
(aviso de CSP/`eval()`), ignorado por instrucción explícita — no es un defecto de Niki.

## Verificación de los 5 defectos de la pasada 2026-10-16

1. **($4.99×12≠$59.99) → CORREGIDO.** `PLANES.anual.precio` ahora es `'$5'` con `decimales: 0`
   (page.tsx:43-48). En la captura se lee "$5/mes" sin un segundo decimal que contradiga
   "$59.99/año · menos de $0.17/día". Ya no hay dos cifras que no cuadren a simple vista.
2. **("gratis" huérfano en su línea) → CORREGIDO (confirmado en captura, no solo en código).**
   En `qa-paywall-01-arriba.png` el detalle del plan Anual envuelve como "$59.99/año · menos de
   $0.17/día ·" / "~8 meses gratis" — "gratis" ya no queda solo en su propia línea, el corte cae
   en un punto distinto y la frase final queda unida.
3. **(4 tamaños de texto, máximo del sistema es 3) → CORREGIDO.** Grep de todos los
   `text-[Npx]` en el archivo confirma únicamente 28px (h1), 16px (nombre de plan, precio,
   subtítulo, beneficios, "Cómo funciona tu prueba", CTA) y 13px (badge, detalles, labels,
   legales) — 3 tamaños reales. El precio de la tarjeta (page.tsx:167, ahora 16px) se funde con
   el nombre del plan sin competir por nivel propio, tal como pedía el fix. La sub-jerarquía
   dentro de cada tamaño (bold/semibold/medium + color primario/secundario) sigue leyéndose en
   4 niveles perceptuales pese a los 3 tamaños físicos.
4. **(franja fija tapando "Cómo funciona tu prueba") → CONFIRMADO COMO NO-BUG.** Las 3 capturas
   por tramos de scroll real muestran el título "Cómo funciona tu prueba" y el paso "Hoy"
   completamente visibles y sin superposición del CTA fijo en ningún tramo. Era, como se
   anticipó, un artefacto de `fullPage: true` con `position: fixed` — no un defecto real.
5. **("$0" repetido 2 veces) → CORREGIDO.** El paso "Hoy" de `PASOS_TRIAL` (page.tsx:65) ahora
   dice "Acceso completo, sin cobro (la prueba ya viene activada en Hotmart)" — sin cifra. El
   único "$0" visible en toda la pantalla es el de la franja fija ("Hoy pagas $0", page.tsx:414),
   que es precisamente donde el sub-check binario de garantía/precio cerca del CTA lo exige.

Los 5 defectos de la lista anterior quedan resueltos (4 corregidos + 1 confirmado como artefacto
de captura, nunca un bug real). El puntaje sube de 36/40·16/20 ("sin margen") a 37/40·18/20.

## TOP DEFECTOS (ninguno baja el gate — la pantalla pasa con margen real)
1. [Movimiento — tarjeta de garantía + nav de enlaces legales + franja CTA, page.tsx:371-424]
   Estos 3 bloques NO llevan `entrada()`/`motion` como sí lo llevan la lista de beneficios
   (entrada(1)) y las tarjetas de plan (entrada(2)): aparecen de golpe, sin stagger, cortando la
   baseline de "entrada escalonada" a media pantalla. → Fix: envolver la tarjeta de garantía y el
   `<nav>` de enlaces legales en `motion.div` con `entrada(3)`/`entrada(4)` (la franja CTA fija
   puede quedar estática a propósito, por estar siempre visible).
2. [CTA fijo, page.tsx:223-232 y :390-408] Si el tap no logra abrir Hotmart (sin conexión,
   bloqueador de pop-ups, red lenta), el único comportamiento es que el timeout de 8s resetea el
   botón a su texto normal en silencio — no hay ningún mensaje que explique qué pasó ni qué
   hacer (heurística 9, "errores con solución"). → Fix: si pasan los 8s sin navegación efectiva,
   mostrar un texto breve bajo el botón ("No se pudo abrir el pago, intenta de nuevo") en vez de
   solo revertir el spinner.
3. [Consistencia de chips de ícono — benefits (page.tsx:302, `bg-[var(--surface)]`) vs. pasos de
   prueba y garantía (page.tsx:343 y :372, `bg-[var(--chip-bg)]`)] Mismo componente visual (chip
   circular con ícono) usa 2 tokens de fondo distintos en la misma pantalla. Está
   contextualmente justificado (contraste contra fondo tintado vs. contra tarjeta clara), pero
   un ojo entrenado lo nota al comparar ambos de cerca. → Fix: si la intención es la misma,
   documentar la regla ("chip-bg sobre tarjetas, surface sobre fondos tintados") en un comentario
   para que no se perciba como variante accidental en la próxima pantalla.
4. [Densidad de contenido — "$59.99" aparece 2 veces (detalle de tarjeta Anual, page.tsx:49, y
   paso "Al terminar el Día 3", page.tsx:67) y la garantía aparece 2 veces (tarjeta de garantía,
   page.tsx:371-379, y línea bajo el CTA, page.tsx:420-423)] Ambas repeticiones están
   funcionalmente justificadas (la garantía cerca del CTA es un sub-check binario obligatorio del
   SO), pero suman densidad de texto a una pantalla ya cargada de tarjetas. → Fix: ninguno
   urgente; si se busca aligerar, la línea bajo el CTA podría omitir "Garantía del Primer Ajuste
   Honesto" completo y dejar solo "Garantía de 7 días" ya que el nombre completo vive arriba.
5. [Identidad ownable, pantalla completa] El dispositivo ownable de la ficha (el anillo de
   progreso / "Check de Presencia") solo aparece en miniatura en el logo (page.tsx:86-99); el
   paywall no lo refuerza visualmente más allá del hairline degradé en la tarjeta elegida. No es
   un defecto bloqueante (la paleta y tipografía SÍ son distintivas y pasan el test anti-clon),
   pero es la oportunidad de craft más clara para una próxima pasada. → Fix opcional: un motivo
   decorativo sutil del anillo en el fondo o cerca del título, sin competir con el texto.

## Notas de verificación
- Gate de carga cognitiva: 0 fallas (2 planes, 1 acción primaria, 3 beneficios, 3 pasos de
  trial, nada que pedir de memoria, texto por bloque ≤4 líneas, "qué sigue" obvio).
- CTA héroe vivo: cumple los 4 — contraste alto (texto `var(--bg)` claro sobre botón
  `var(--accent)` #7A3E1D oscuro, medible >4.5:1 a ojo), `whileTap scale 0.97` (page.tsx:389),
  nunca disabled (recupera con `pageshow` + timeout de 8s, page.tsx:223-231), `h-14` (56px) ancho
  completo (page.tsx:397).
- FICHA-ARTE: coinciden el degradé atardecer (#FF9457→#FFE9B0), superficie #FFF3DE, acento
  #7A3E1D, par Unbounded/Manrope, radios del kit (`var(--radius-card)`/`var(--radius-button)`
  idénticos en toda la pantalla). Sin desvíos visibles respecto a la ficha.
- Copy trazado a FICHA-AVATAR (sin cambios respecto a la pasada anterior, texto casi idéntico):
  titular = deseo #1 ("saber con 100% de certeza que me veo impecable", verbatim); subtítulo =
  dolor #1 + ancla emocional ("nadie te dice la verdad por pena"); beneficios = deseos #1/#3/#5;
  nota bajo el CTA = objeciones #5 (precio/garantía) y #6 (pago seguro); garantía nombrada con
  plazo junto al CTA (sub-check binario PASA). Message-match: no verificable (sin creativo de
  origen conocido).
- H3 y H7 verificados en código: `X` → `/` da salida clara; `role="radiogroup"` con navegación
  por flechas (`onKeyDownPlanes`, page.tsx:211-219) y plan preferido recordado vía `localStorage`
  (page.tsx:187-194, 199-201) cubren flexibilidad para quien vuelve o usa teclado.
- `prefers-reduced-motion` respetado en todas las animaciones (`useReducedMotion()` gatea
  `ConteoPrecio`, `entrada()` y las transiciones de `AnimatePresence`).
- Margen real: a diferencia de las 2 pasadas anteriores (36/40·16/20 exacto, "sin margen"), esta
  pasada queda con margen sobre el gate (37/40 ≥36, 18/20 ≥16) tras corregir 2 de los 5 defectos
  top que seguían arrastrándose desde 2026-10-06.
