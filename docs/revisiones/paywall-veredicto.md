# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/repaso-2026-10-16/qa-paywall.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: ver lista

Detalle usabilidad: h1:4 h2:3 h3:4 h4:4 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:4

Tipo de pasada: revisión independiente desde cero, re-certificación tras el cambio de
rendimiento del 2026-10-16 (titular sin fade-in + Supabase bajo demanda). Screenshot capturado
hoy en producción con sesión real (`scripts/captura-sesion-prod.mjs`), viewport 375×812,
`fullPage: true`, plan Anual preseleccionado desde el recorrido de inicio real.

## TOP DEFECTOS (ninguno baja el gate; pasa en el mínimo exacto: 36/40 y 16/20 — SIGUE SIN MARGEN)
1. [Tarjeta Anual, app/paywall/page.tsx:42-45] "$4.99/mes" sigue sin cuadrar con "$59.99/año":
   $4.99 × 12 = $59.88, no $59.99. Un usuario que hace la cuenta —o Hotmart, que va a mostrar
   $59.99 del año— nota la discrepancia justo antes de pagar (defecto heredado de la pasada del
   2026-10-06, SIN CORREGIR). → Fix: usar "$5/mes" en el badge, o cuadrar el total a "$59.88/año"
   para que las dos cifras coincidan exactamente.
2. [Detalle del plan Anual, page.tsx:45, visible en el screenshot a la altura de la tarjeta
   Anual] La palabra "gratis" queda huérfana en su propia línea ("$59.99/año · menos de
   $0.17/día · ~8 meses" / "gratis" solo abajo) — se ve como un corte de layout a simple vista,
   sin necesitar lupa (defecto heredado, SIN CORREGIR). → Fix: acortar a "$59.99/año · <$0.17/día
   · ~8 meses gratis", o envolver "8 meses gratis" en un `whitespace-nowrap` para que no se
   parta.
3. [Jerarquía tipográfica, page.tsx:284 (28px) · :163 (20px) · :161 (16px) · :168 (13px)] 4
   tamaños de texto conviven en la misma pantalla — uno más del máximo de 3 que exige el propio
   sistema de diseño del proyecto (DESIGN-CORE). El precio de la tarjeta (20px bold) compite con
   el nombre del plan (16px) sin ganarse un nivel propio al entrecerrar los ojos. → Fix: bajar el
   precio de la tarjeta a 16px bold display, fundiendo ese nivel con el nombre del plan.
4. [Captura completa — franja fija del CTA vs. sección "Cómo funciona tu prueba", justo debajo
   de las tarjetas de plan] En la imagen a página completa, la franja fija ("Empezar mis 3 días
   gratis" + "Hoy pagas $0" + garantía) aparece superpuesta sobre el título "Cómo funciona tu
   prueba" y el primer paso "Hoy" de `PASOS_TRIAL`, tapándolos — compatible con un artefacto
   conocido de `page.screenshot({ fullPage: true })` con `position: fixed` (Playwright no
   recoloca los elementos fijos al recomponer la imagen completa; `scripts/captura-sesion-
   prod.mjs:27` usa `fullPage: true` sin tratamiento especial). No se pudo confirmar con certeza
   que en el dispositivo real ese tramo no quede igual de ajustado: el padding inferior reservado
   para la franja (`pb-[calc(160px+...)]`, page.tsx:257) se queda a pocos píxeles de la altura
   real del CTA + 2 líneas de texto (~156px calculados), así que cualquier variación de ancho de
   fuente/zoom del sistema podría comerse ese margen. → Fix: volver a capturar ese tramo con un
   método que no congele los `fixed` (capturas por viewport con scroll real en vez de `fullPage`,
   o forzar `position:fixed→absolute` justo antes de la captura) para confirmar en firme que el
   paso "Hoy" nunca queda tapado; de paso, subir el padding reservado a 172-176px para dar aire
   de sobra.
5. ["$0" dicho 2 veces: page.tsx:61 ("Acceso completo por $0…") y page.tsx:410 ("Hoy pagas $0")]
   Redundancia leve — el mismo dato se repite en dos tramos de la misma pantalla sin aportar nada
   nuevo la segunda vez (defecto heredado, SIN CORREGIR). → Fix: en el paso "Hoy" del trial,
   cambiar a "Acceso completo, sin cobro" y dejar el "$0" exclusivamente en la franja fija.

## Notas de verificación
- El cambio de rendimiento descrito (titular sin fade-in, Supabase diferido) está confirmado en
  el código: el `<h1>` (page.tsx:284) no usa `entrada()`/`motion`, a diferencia de la lista de
  beneficios (`entrada(1)`, page.tsx:292-293) y las tarjetas de plan (`entrada(2)`, page.tsx:306-
  307) que sí llevan stagger. Esto deja el titular visible desde el primer frame (bueno para LCP)
  pero rompe ligeramente la baseline de "entrada escalonada desde arriba" del eje Movimiento —
  ya contemplado en el puntaje (movimiento:3, sin bajar respecto a la pasada anterior porque el
  resto de la pantalla sigue escalonando con normalidad).
- `clienteSupabaseDiferido()` (page.tsx:232) solo corre dentro de un `useEffect`, no bloquea el
  primer render ni cambia nada visible — confirmado, sin impacto de craft/usabilidad.
- Gate de carga cognitiva: 0 fallas (2 planes, 1 acción primaria, 3 beneficios, 3 pasos de
  trial, nada que pedir de memoria).
- CTA héroe vivo: cumple los 4 — contraste alto (texto `var(--bg)` claro sobre botón
  `var(--accent)` #7A3E1D oscuro), `whileTap scale 0.97` (page.tsx:385), nunca deshabilitado
  (recupera con `pageshow` + timeout de 8s, page.tsx:219-228), `h-14` ancho completo
  (page.tsx:393).
- FICHA-ARTE: coinciden el degradé atardecer (#FF9457→#FFE9B0), superficie #FFF3DE, acento
  #7A3E1D, par Unbounded/Manrope y radios del kit. Sin desvíos visibles respecto a la ficha.
- Copy trazado a FICHA-AVATAR: titular = deseo #1 ("saber con 100% de certeza que me veo
  impecable", verbatim); subtítulo = dolor #1 + ancla emocional de la ficha ("nadie te dice la
  verdad por pena"); beneficios = deseos #1/#3/#5; nota bajo el CTA = objeciones #5 (precio/
  garantía) y #6 (pago seguro); garantía nombrada con plazo junto al CTA (sub-check binario
  PASA). Message-match: no verificable (sin creativo de origen).
- H3 y H7 verificados en código: `X` → `/` y "Ya tengo cuenta" → `/login` dan salida/control
  (page.tsx:262-268, :380); `role="radiogroup"` con navegación por flechas
  (`onKeyDownPlanes`, page.tsx:207-215) y plan preferido recordado vía `localStorage`
  (page.tsx:183-190, 196-197) cubren flexibilidad para quien vuelve o usa teclado.
- Defectos 1, 2 y 5 de la pasada del 2026-10-06 siguen presentes sin corregir — el código de esas
  3 zonas (page.tsx:42-45, :61, :410) es idéntico al de la revisión anterior. El defecto 4 es
  nuevo en esta pasada (artefacto de captura, no cambio de código).
- Margen cero: el puntaje cae EXACTO en el mínimo del gate (36/40 · 16/20) por tercera vez
  consecutiva. Cualquier regresión adicional —incluida la resolución pendiente del defecto 4—
  saca la pantalla de LISTA.
