# VEREDICTO revisor-visual — landing
Fecha: 2026-10-04 22:10
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:4 h9:3 h10:3
Detalle craft: jerarquia:3 profundidad:3 identidad:4 movimiento:3 encaje:3
Detalle copy: idea:4 especificidad:3 emocion:4 oferta:4 accion:3
Top defectos:
1. [Barra fija inferior (StickyCtaMobile, ui.tsx L252-258) y CTA "Elegir mensual" (Oferta.tsx L198-204)] Siguen siendo motion.a con href plano a /onboarding: recarga completa sin precarga ni spinner. La barra fija es el CTA que más se toca en móvil, así que el fix del defecto #1 anterior quedó a medias, y ahora hay 2 CTA que se comportan distinto (h1/h4) → fix: que ambos usen MotionLink con el mismo estado yendo (Loader2 + aria-busy), o sea, CtaButton con variante outline/barra.
2. [CTA del Anual (tramo 06, y≈340) vs. el resto de CTA] El Anual sigue con compacto (15px, px-3) y los otros con 16px; además Mensual y la barra fija miden h-12 (48px) y CtaButton 52px: 3 alturas y 2 tamaños de texto en el mismo botón primario (h4/encaje) → fix: 16px y h-[52px] en todos; si no cabe en una línea en la tarjeta, acortar el texto del Anual en vez de achicar la fuente.
3. [Agitación, tarjeta "EN 6 MESES" (tramo 03, y≈185-290; page.tsx L109)] "¡Seguirás siendo invisible, mientras otros brillan!" contradice la promesa del hero ("sin críticas crueles") y la ficha (nunca cruel; máx 1-2 exclamaciones por pantalla y ya hay "¡Así se ve…!" y "¡Tus resultados…!") (h2/voz) → fix: "En 6 meses sigues saliendo con la misma duda, y nadie te dice qué ajustar." sin exclamación.
4. [Todos los CTA con spinner (ui.tsx L167-182)] Si la navegación se traba (sin conexión o la precarga falla), el spinner gira para siempre: no dice qué pasó ni qué hacer (h9/h1) → fix: a los ~8s sin cambio de ruta, sacar el spinner y mostrar debajo "No pudimos abrir tu Check. Revisa tu conexión y vuelve a tocar."
5. [Hero, mockup del teléfono (tramo 01, y≈950-1000)] La mascota tapa la esquina inferior izquierda de la tarjeta "Outfit 8/10" del mockup: el dato del héroe queda cortado por decoración (encaje) → fix: mover la mascota fuera del área de las tarjetas (borde derecho del marco o encima del anillo) o subir el z-index del contenido en esa franja.
Verificado: los 5 arreglos anteriores están aplicados. CtaButton es MotionLink con Loader2 + aria-busy; "Antes" ahora es otra escena ("cuando ya estás en la cita"); las dos tarjetas tienen p-5 (el contenido alinea, x≈41-42); "Se cobra $107.88 al año" va a 13px en la tarjeta y en el desglose; la tarjeta Anual tiene una sola línea con el ahorro en semibold acento; el footer usa grilla 2x2 y el correo es inline-block py-3. h8 sube a 4. h2 baja a 3 por la frase cruel (defecto 3). La usabilidad sigue en 32/40 (el gate pide 36): faltan la consistencia de CTA (1-2), el manejo de error de navegación (4) y la voz (3).
