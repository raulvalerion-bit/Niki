# VEREDICTO revisor-visual — landing
Fecha: 2026-10-04 23:40
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:4 h2:4 h3:3 h4:4 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquia:3 profundidad:3 identidad:4 movimiento:3 encaje:3
Detalle copy: idea:4 especificidad:3 emocion:4 oferta:4 accion:3
Top defectos:
1. [Oferta, tarjeta Mensual, botón "Elegir mensual" (tramo 06, y≈740; page.tsx L178 ctaHref=CTA_HREF) + app/paywall/page.tsx L181 useState<PlanId>('anual')] La elección se pierde: quien elige Mensual hace el recorrido de inicio y llega a la pantalla de planes con el Anual (con prueba y cobro anual) ya marcado. Obliga a recordar la elección y empuja a pagar un plan que no eligió (h5/h6) → fix: ctaHref '/onboarding?plan=mensual' (y '?plan=anual' en el Anual), y que el paywall inicialice `plan` desde ese parámetro.
2. [Agitación, párrafo 2 + tarjeta "EN 6 MESES" (tramos 02 y≈860-935 y 03 y≈185-290; page.tsx L102 y L109)] La misma idea de "6 meses" sale dos veces seguidas: primero el párrafo ("sigues exactamente en el mismo lugar") y luego la tarjeta ("Sigues saliendo con la misma duda"). Se lee como relleno (h8) → fix: quitar el párrafo L102 y dejar que la tarjeta Hoy/En 6 meses cargue el contraste.
3. [CTA final dorado, párrafo de proyección a futuro "Subes tu foto antes de salir..." (tramo 08, y≈360-435) y PS (y≈620-760); CtaFinal.tsx L101 y L129] El texto usa --gold-text al 82%/85% de opacidad sobre --gold #d4a72c: medido ≈4.0:1 y ≈4.2:1, por debajo de AA 4.5:1 para texto normal de 15-17px. Se nota más claro que el resto (ancla de conversión "todo texto AA") → fix: color var(--gold-text) al 100% en ambos (5.7:1) y separar los niveles por peso o tamaño, no por transparencia.
4. [Todos los CTA, estado de falla (ui.tsx L173)] `<span role="status">` se monta en el mismo momento que su texto, así que los lectores de pantalla no suelen anunciarlo. Además el mensaje solo dice qué hacer, no qué pasó (h9) → fix: dejar un `<span role="status" className="sr-only">` siempre montado y llenarlo en la falla, con el texto "No pudimos abrir tu Check. Revisa tu conexión y vuelve a tocar."
5. [CTA "Elegir mensual" vs. CTA del Anual (tramo 06)] "Elegir mensual" es el único CTA sin beneficio y no está en 1ª persona, y rompe el verbo "Hacer mi Check" que se repite en toda la página (acción de copy 3/4) → fix: "Empezar con el mensual" o "Quiero el plan mensual".
Verificado: los 5 arreglos anteriores están aplicados. EnlaceCta (Link + motion, Loader2, aria-busy, timeout de 8 s) lo usan CtaButton, la barra fija (las anclas no muestran carga) y "Elegir mensual". Todos los CTA usan 16px y h-12; el final usa h-14. El Anual dice "Hacer mi Check gratis" en 1 línea. "En 6 meses" quedó sin exclamación ni crueldad. La mascota del hero está en el borde derecho del marco, a la altura del título, y no tapa ni tarjetas ni el anillo. Contraste del CTA marrón sobre dorado ≈3.2:1 (≥3:1, pasa). Gate de carga cognitiva: 0 fallas. h1, h2 y h4 suben a 4. h6 baja a 3 (defecto 1, nuevo) y h8 baja a 3 (defecto 2). Faltan 3 puntos para el gate de 36: con los defectos 1, 2 y 4 se alcanza.
