# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-27 16:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: ver lista

Detalle usabilidad: h1:4 h2:3 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
Otros screenshots revisados: docs/revisiones/paywall-375-scroll1.png, docs/revisiones/paywall-375-scroll2.png, docs/revisiones/paywall-375-mensual.png
Código revisado: app/paywall/page.tsx, app/page.tsx y app/onboarding/page.tsx (nombres de la garantía y del desafío)
Tipo de pasada: tercera pasada de hoy, tras corregir los defectos 1-4 de la segunda.

## TOP DEFECTOS (ninguno bloquea; pasa el gate por el mínimo exacto)
1. [Escala tipográfica] Hay 4 tamaños (28/20/16/13) y el máximo son 3. Se acepta la razón (a 28px se parte "VIP Pro Mensual"), pero jerarquía se queda en 3. → Fix: si se rediseña la tarjeta, probar el precio a 16px bold display.
2. [Primer pliegue, borde inferior] Detrás del degradé de la franja fija asoma el borde vacío de la tarjeta de prueba, y se ve como un corte (encaje 3). → Fix: subir el tramo opaco del degradé de la franja (p. ej. `var(--bg)_85%`) o dejar un espacio de 24px más antes de la tarjeta.
3. [Garantía: nota bajo el botón frente a la tarjeta, page.tsx:380 frente a :341] Dos variantes del nombre: "Garantía Ajuste Honesto" y "Garantía del Primer Ajuste Honesto" (la landing usa la segunda). Solo lo nota quien revisa con lupa. → Fix: "Garantía Primer Ajuste Honesto · 7 días" bajo el botón, si cabe en 1 línea a 13px.
4. [Tarjetas de plan] No hay ancla de valor: la landing muestra un stack tachado de $186 y el paywall no lo recuerda (especificidad 3). → Fix: añadir bajo el Anual, en 13px, "Valor $186 · hoy $107.88/año".
5. ["$0" dicho dos veces: paso "Hoy" de la tarjeta de prueba y línea bajo el botón] Redundancia leve (h8 3). → Fix: dejar el paso "Hoy" en "Acceso completo, sin cobro" y el "$0" solo junto al botón.

## Notas de verificación
- Corregido y visible en los renders:
  - Bajo el botón: "Garantía Ajuste Honesto de 7 días · Pago seguro". El sub-check de nombre + plazo junto al botón PASA.
  - El desafío se llama "Racha Glow-Up" en paywall, landing (app/page.tsx:105/120/137/150) y onboarding:754, así que h4 sube a 4.
  - Paso "Hoy": "Acceso completo por $0 (la prueba ya viene activada en Hotmart)".
  - La cabecera ya no tiene la línea bajo "niki": "Check de Presencia" aparece 2 veces en el pliegue.
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4.
  - #FFF3DE sobre #7A3E1D ≈ 7.6:1.
  - whileTap 0.97.
  - Nunca deshabilitado, y se recupera con pageshow + timeout de 8 s.
  - h-14 a ancho completo, fijo y con safe-area.
- Contraste: la línea de impuestos en text-primary cumple AA. El texto secundario sobre la superficie da ≈4.8:1.
- Estado Mensual: botón "Empezar mi mes VIP Pro", nota de renovación y hairline en la tarjeta elegida. Sin la línea de "$0". Correcto.
- FICHA-ARTE: coinciden el degradé atardecer, el acento #7A3E1D, Unbounded/Manrope y los radios del kit. Anti-clon: no aplica.
- Movimiento: stagger, conteo del precio, whileTap, AnimatePresence al cambiar de plan y reduced-motion. No hay anillo ni barra que se dibuje.
- Copy trazado a FICHA-AVATAR:
  - Titular: deseo #1.
  - $0.30/día y garantía: objeción #5.
  - Pago seguro y moneda local: objeción #6.
  - Message-match: no verificable.
- Casilla de prueba de Hotmart marcada por defecto: dato del constructor (compra real + webhook de $0). No lo verifiqué yo.
- Pasa exacto en 36/40 y 16/20. Cualquier regresión la devuelve a NO LISTA.
