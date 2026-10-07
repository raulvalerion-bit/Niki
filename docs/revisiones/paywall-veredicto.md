# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-06 14:00
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
Otros screenshots revisados: docs/revisiones/repaso-2026-10-06/paywall-pliegue-375.png, docs/revisiones/repaso-2026-10-06/paywall-mensual-375.png
Código revisado: app/paywall/page.tsx (franja fija, líneas 382-417)
Tipo de pasada: tercera pasada de hoy (final), tras corregir los defectos 1 y 2 de la segunda.

## TOP DEFECTOS (ninguno baja el gate; pasa en el mínimo exacto: 36/40 y 16/20)
1. [Tarjeta Anual, page.tsx:42 y :44] "$4.99/mes" sigue sin cuadrar: $4.99 × 12 = $59.88, pero se cobran $59.99. La landing repite el mismo error (especificidad 3). Además, "gratis" queda sola en la 2ª línea del detalle. → Fix: "$5/mes" en la landing y en el paywall a la vez, y "$59.99/año · <$0.17/día · ~8 meses gratis" para que quepa en 1 línea.
2. [Primer pliegue, borde inferior de la tarjeta Mensual] El borde inferior de la tarjeta se funde en la franja fija. El corte cae en el borde, no en el texto: solo se ve con lupa (encaje 3). → Fix: `gap-3` entre los planes, o 8px menos de margen sobre ellos.
3. [Línea bajo el botón en Anual, page.tsx:408] Se quitó "(Hotmart muestra el precio anual)". Al llegar al pago, quien vio "Hoy pagas $0" encuentra $59.99 en Hotmart, y la aclaración ahora solo está en la tarjeta de prueba, fuera del pliegue. → Fix: "Hoy pagas $0 · Hotmart muestra $59.99 del año" (y "Pago seguro" junto a la garantía).
4. [Escala tipográfica, page.tsx:281/162/160/167] Siguen 4 tamaños (28/20/16/13), uno más del máximo de 3 (jerarquía 3). → Fix: precio de la tarjeta a 16px bold display.
5. ["$0" dicho 2 veces: paso "Hoy" de la tarjeta de prueba y línea bajo el botón] Redundancia leve (h8 3). → Fix: dejar el paso "Hoy" en "Acceso completo, sin cobro".

## Notas de verificación
- Corregidos y visibles en los 3 renders:
  - Bajo el botón en Anual: "Hoy pagas $0 · Pago seguro con Hotmart".
  - Bajo el botón en Mensual: "Se renueva cada mes · cancelas cuando quieras".
  - En los dos estados, debajo: "Garantía del Primer Ajuste Honesto · 7 días". El sub-check de garantía con nombre y plazo junto al botón PASA (oferta vuelve a 4).
- El evento de medición (page.tsx:387) solo envía el plan y la red de origen. No lleva datos personales ni efecto visual. Vercel Analytics no cambia el render.
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4.
  - Contraste ≈7.6:1.
  - whileTap 0.97.
  - Nunca deshabilitado. Se recupera con pageshow y un timeout de 8 s.
  - h-14 a ancho completo, fijo y con safe-area.
- FICHA-ARTE: coinciden el degradé atardecer, la superficie #FFF3DE, el acento #7A3E1D, Unbounded/Manrope y los radios del kit.
- Copy trazado a FICHA-AVATAR: deseo #1, dolor #1 y objeciones #5 y #6. Message-match: no verificable.
- Margen cero: cualquier regresión devuelve la pantalla a NO LISTA.
