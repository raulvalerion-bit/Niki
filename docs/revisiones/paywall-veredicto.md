# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-25 22:40
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 34/40
Craft: 15/20
Copy (si vende): 17/20
Copy: 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: ver lista

Detalle usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:3
Otros screenshots revisados: docs/revisiones/paywall-375-final-scroll.png, docs/revisiones/paywall-mensual-375.png
Código revisado: app/paywall/page.tsx (+ app/page.tsx, FICHA-ARTE.md, FICHA-AVATAR.md, FICHA-MERCADO.md §4)

## TOP DEFECTOS
1. [Toda la pantalla: escala tipográfica] Hay 6 tamaños de texto: 28 (h1), 20 (precio), 16 (subtítulo y nombre del plan), 13 (beneficios, detalle y legales), 12 (tagline de la marca) y 11 (badge "3 DÍAS GRATIS" y "CÓMO FUNCIONA TU PRUEBA"). Esto rompe el máximo del eje de jerarquía y es lo que deja el craft en 15. → Llevar los textos de 12 y 11 a 13 (tagline, badge y label de la prueba) para quedar en 28/20/16/13.
2. [Nota bajo el CTA fijo] El nombre de la garantía queda suelto en la segunda línea ("Primer Ajuste Honesto · pago seguro con Hotmart") y se lee como un fragmento sin relación con "Garantía de 7 días". Además no coincide con la landing, que dice "Garantía del Primer Ajuste Honesto". → Reescribir como "Garantía del Primer Ajuste Honesto: 7 días, si no te sirve te devolvemos todo · pago seguro con Hotmart".
3. [Bloque de 3 beneficios] Los chips de ícono miden 32px y usan un ícono en --text-primary sobre --chip-bg. El sistema de conversión (49/55) pide chips de 40-48px con fondo de acento al 8-12%, así que la lista se ve más pobre que el resto del kit. → Cambiar a size-10 con bg color-mix(var(--accent) 10%) e ícono en --accent.
4. [Vista Mensual, nota bajo las tarjetas] La tarjeta ya dice "Se cobra hoy, sin prueba gratis" y la nota repite "La prueba de 3 días gratis es solo para el Anual". Es la misma idea dicha dos veces a 60px de distancia. → Dejar la nota solo en "Se renueva cada mes · cancelas cuando quieras desde Hotmart".
5. [Cabecera + hero, primer pliegue] El anillo del logo (32px) y el anillo del hero (48px) están apilados a unos 40px de distancia. El dispositivo ownable se repite dos veces seguidas y resta aire al titular. → Quitar el AnilloHero del paywall, o reemplazarlo por un anillo con dato (por ejemplo, la meta del Glow-Up de 21 días) que cumpla una función.

## Notas de verificación
- Resuelto frente a la pasada anterior:
  - El precio de las tarjetas está a 20px en Unbounded y funciona como dato héroe.
  - Las 2 tarjetas quedan completas por encima del CTA a 812px.
  - El subtítulo abre con la escena literal de la ficha ("¿20 minutos frente al armario? Nadie te dice la verdad por pena").
  - El CTA de la vista Mensual está en primera persona.
  - El precio tiene conteo animado con useReducedMotion.
- Gate de carga cognitiva: 0 fallas. Hay 3 beneficios, 2 planes, 1 acción primaria, el siguiente paso es obvio y no hay elementos que parezcan interactivos y no respondan.
- CTA héroe vivo: cumple los 4. Contraste #FFF3DE sobre #7A3E1D de ~7:1, whileTap 0.97, nunca deshabilitado, h-14 a ancho completo, fijo con safe-area y con estado "Un momento…" al tocarlo.
- Control (código): la X lleva a "/" y está visible sin demora. "Ya tengo cuenta" y los enlaces legales tienen un área táctil de ≥44px. El radiogroup se maneja con flechas y el foco se mueve (h7).
- Movimiento (código): hay stagger de entrada, anillo que se dibuja, conteo del precio, whileTap en tarjetas y CTA, y AnimatePresence al cambiar de plan. Todo respeta reduced-motion, incluido el spinner. No aplican celebración ni modal.
- FICHA-ARTE: el degradé #FF9457→#FFE9B0, el acento #7A3E1D, Unbounded/Manrope y los radios 18/14 coinciden. Anti-clon: no coincide con Capítulo ni con Umbral.
- Copy: no se descuenta por la ausencia de testimonios ni de la comparación con un asesor de imagen (no hay fuente ni usuarios reales). Sub-check garantía nombrada: PASA, pero el nombre está fragmentado (defecto 2). Message-match: no verificable (no hay dato del creativo). Aritmética: 107.88/12 = 8.99; 1 − 8.99/14.99 ≈ 40%; 107.88/365 ≈ 0.30.
- Nota Hotmart (no descuenta): los errores de pago, el regreso desde el checkout, el bloqueo del doble toque y el "cancelas gratis desde Hotmart" se verifican al conectar la pasarela. Ahí se revisan h1 y h9.
