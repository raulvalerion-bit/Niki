# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-25 23:59
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 17/20
Copy: 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: ver lista

Detalle usabilidad: h1:4 h2:3 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:3 acción:4
Otros screenshots revisados: docs/revisiones/paywall-375-final-scroll.png, docs/revisiones/paywall-mensual-375.png
Código revisado: app/paywall/page.tsx (+ app/page.tsx, components/landing/Oferta.tsx, FICHA-ARTE.md)
Tipo de pasada: re-verificación tras re-render. El código del paywall es idéntico al de la pasada anterior. Los 3 renders coinciden con él:
- el primer pliegue con el Anual elegido,
- el scroll hasta el final,
- el estado Mensual con su CTA "Empezar mi mes VIP Pro" y la nota de renovación.

## TOP DEFECTOS
1. [Tarjeta VIP Pro Anual, page.tsx:39 frente a app/page.tsx:130] Sigue abierto. El paywall dice "ahorras 40%" y la landing dice "~5 meses gratis": son dos cifras distintas para el mismo ahorro (oferta 3). → Fix: cambiar el detalle a "$107.88 al año · $0.30 al día · ~5 meses gratis".
2. [Escala tipográfica global] Sigue abierto. Hay 4 tamaños (28/20/16/13) y el máximo son 3 (jerarquía 3). → Fix: llevar el precio del plan a la escala display o a la de cuerpo, sin añadir tamaños.
3. [Primer pliegue: cabecera, subtítulo y beneficio 1] Sigue abierto. "Check de Presencia" sale 3 veces en ~250px y la garantía se repite en la tarjeta y bajo el CTA (h8 3). → Fix: quitar la línea "Tu Check de Presencia antes de salir" de MarcaNiki (page.tsx:90).
4. [Tarjetas de plan] Sigue abierto. No hay ancla de valor: la landing muestra un stack tachado de $186 y el paywall no lo recuerda (especificidad 3). → Fix: añadir bajo el Anual en 13px "Valor $186 · hoy $107.88 al año".
5. [Nombres entre pantallas, page.tsx:61 frente a app/page.tsx:105/120/137] Sigue abierto. La misma pieza tiene 3 nombres: "Tu desafío Glow-Up de 21 días", "Guía Glow-Up de 21 días" y "Racha Glow-Up". → Fix: unificar en "Desafío Glow-Up de 21 días".

## Notas de verificación
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4.
  - Contraste de #FFF3DE sobre #7A3E1D ≈ 7.6:1.
  - whileTap 0.97.
  - Nunca deshabilitado, con spinner "Un momento…".
  - h-14 a ancho completo, fijo y con safe-area.
- FICHA-ARTE: coinciden el degradé atardecer, el acento café, Unbounded/Manrope y los radios del kit.
- Anti-clon: no coincide con Capítulo ni con Umbral.
- Movimiento (código):
  - Hay stagger, conteo del precio, whileTap, AnimatePresence al cambiar de plan y reduced-motion.
  - No hay anillo ni barra que se dibuje. Modal y celebración no aplican.
- Copy:
  - La aritmética es correcta: 107.88/12 = 8.99; 40%; $0.30 al día.
  - La garantía va con nombre y condición, sin plazo (pendiente de Hotmart, FICHA-MERCADO §4; no descuenta).
  - Message-match: no verificable.
- Hotmart no está conectado (no descuenta). Al conectarlo se revisan h1, h5 y h9:
  - los errores de pago,
  - el regreso del checkout,
  - el doble toque,
  - la cancelación.
- Pasa el gate por el mínimo exacto (36/40, 16/20, 17/20). Cualquier regresión la devuelve a NO LISTA.
