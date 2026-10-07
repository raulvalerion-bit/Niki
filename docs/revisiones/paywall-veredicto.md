# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-06 13:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: ver lista

Detalle usabilidad: h1:4 h2:3 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:3 acción:4
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3
Otros screenshots revisados: docs/revisiones/repaso-2026-10-06/paywall-pliegue-375.png, docs/revisiones/repaso-2026-10-06/paywall-mensual-375.png
Código revisado: app/paywall/page.tsx (líneas 44, 256, 381, 408)
Tipo de pasada: segunda pasada de hoy, tras corregir los defectos 1-4 de la primera.

## TOP DEFECTOS (ninguno baja el gate; pasa en el mínimo exacto: 36/40 y 16/20)
1. [Nota bajo el botón, page.tsx:408] Al cambiar el nombre de la garantía se perdió el plazo: ahora dice "Garantía del Primer Ajuste Honesto · Pago seguro", sin "7 días". El sub-check binario "garantía con nombre Y plazo cerca del CTA" FALLA: el plazo solo aparece en la tarjeta de abajo, fuera del pliegue (oferta 4→3). Es una regresión de esta pasada. → Fix: "Garantía del Primer Ajuste Honesto · 7 días" y pasar "Pago seguro" a la línea de arriba, o bajar a 12px si no cabe.
2. [Plan Mensual elegido, primer pliegue] La nota de renovación ya no se ve lavada: ahora queda tapada del todo por la franja opaca. Quien elige Mensual paga sin ver "se renueva cada mes · cancelas cuando quieras" (en Anual sí aparece "Hoy pagas $0" bajo el botón). → Fix: en Mensual, poner bajo el botón la línea equivalente "Se renueva cada mes · cancelas cuando quieras" (page.tsx:401, rama `plan === 'mensual'`).
3. [Primer pliegue en estado Anual, borde inferior de la tarjeta Mensual] Con el degradé al 85% ya no asoma la tarjeta de prueba, pero el borde inferior de la tarjeta Mensual se funde en la franja: tarjeta cortada (lupa → encaje 3). → Fix: `gap-3` entre planes, o aceptar el corte y dejarlo en el borde (no está a mitad de texto).
4. [Tarjeta Anual, page.tsx:42 y :44] Sigue "$4.99/mes", aunque $4.99 × 12 = $59.88 y no $59.99. La coherencia con la landing no lo vuelve exacto, solo replica el error en 2 sitios (especificidad 3). Además, "gratis" queda sola en la 2ª línea del detalle. → Fix: "$5/mes" en la landing y en el paywall a la vez, y acortar el detalle a "$59.99/año · <$0.17/día · ~8 meses gratis".
5. [Escala tipográfica, page.tsx:281/162/160/167] Siguen 4 tamaños (28/20/16/13), uno más que el máximo de 3 (jerarquía 3). → Fix: precio de la tarjeta a 16px bold display.

## Notas de verificación
- Corregidos y visibles en los renders:
  - Ya no asoma la tarjeta de prueba en el pliegue Anual.
  - Mismo nombre de garantía en tarjeta, landing, /reembolsos y bajo el botón (h4 vuelve a 4).
  - "menos de $0.17/día" en el detalle del Anual.
  - Franja al 85% con pt-8 (:381) y pb del main a 160px (:256).
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: cumple los 4.
  - Contraste ≈7.6:1.
  - whileTap 0.97.
  - Nunca deshabilitado. Se recupera con pageshow y un timeout de 8 s.
  - h-14 a ancho completo, fijo y con safe-area.
- FICHA-ARTE:
  - Coinciden el degradé atardecer, la superficie #FFF3DE, el acento #7A3E1D y Unbounded/Manrope.
  - Radios: los del kit.
- Copy:
  - Trazado a FICHA-AVATAR: deseo #1, dolor #1 y objeciones #5 y #6.
  - Message-match: no verificable.
  - Sub-check de garantía junto al botón: FALLA (defecto 1).
- Margen cero: cualquier regresión devuelve la pantalla a NO LISTA. Los defectos 1 y 2 son de 1 línea cada uno y conviene corregirlos antes de lanzar tráfico pagado.
