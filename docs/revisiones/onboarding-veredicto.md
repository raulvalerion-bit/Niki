# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/repaso-2026-10-16/qa-ob-00.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Screenshots evaluados: docs/revisiones/repaso-2026-10-16/qa-ob-00.png … qa-ob-10.png (11 capturas,
recorrido completo: apertura, apertura-tras-tocar, objetivo, dolor, reconocimiento1, ocasión,
tiempo, reconocimiento2, carga×2, resultado) · Código: app/onboarding/page.tsx +
components/landing/ui.tsx (EnlaceCta, Hairline) · components/AvisoCookies.tsx (banner de cookies
visible en 00, no forma parte del flujo de onboarding, no se puntúa) · Fichas: FICHA-ARTE.md,
FICHA-AVATAR.md

Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:4 h8:2 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:4 especificidad:4 emoción:4 oferta:3 acción:4

CTA héroe vivo: cumple los 4 (contraste del acento marrón sobre fondo atardecer ≥3:1, whileTap
scale 0.97 en todos los botones, nunca disabled por defecto, área ≥48px ancho completo).

Notas de verificación fresca (no se asumió nada del veredicto 2026-10-06):
- El banner `/iconos/banner-bienvenidos-v2.webp` (page.tsx:427-434) hoy carga como .webp —mismo
  diseño, mismo color— y SIGUE sin ninguna mención en FICHA-ARTE.md (verificado con grep: cero
  resultados). La condición del veredicto anterior era explícita: sin registro + aprobación del
  dueño, o sin retirarlo, "la pantalla vuelve a NO LISTA". Se cumple esa condición aquí.
- El lema "Tu Check de Presencia antes de salir" sigue repitiéndose en el encabezado de cada paso
  (MarcaNiki, page.tsx:203) — confirmado en 02 a 10. En la pantalla de resultado (10) la frase
  "Check de Presencia" aparece 3 veces en una sola vista (encabezado, H1, CTA). No resuelto.
  "Tu objetivo / Lo que te frena / Enfocado en / Tu hábito" (FilaPlan).
- El aire muerto del paso "No es falta de estilo" (reconocimiento1, page.tsx:983-990) sigue
  presente: ~175px vacíos entre la barra de progreso y el ícono, y ~215px vacíos entre el botón y
  el borde inferior (medido sobre qa-ob-04.png, 375×812). No resuelto.
- El primer paso ya no hace fade-in (nace visible, mejora de LCP) — cambio real verificado en el
  código (AnimatePresence initial={false} + comentario en línea 944-945); no afecta la puntuación
  salvo heurística 1, donde suma.
- Nuevo hallazgo (no estaba en la pasada anterior): las preguntas "objetivo" (02) y "dolor" (03)
  dejan ~220-280px de espacio vacío debajo de las 4 opciones, sin `notaAyuda` ni ningún otro
  contenido — a diferencia de "tiempo" (06), que sí usa `notaAyuda` para llenar ese mismo hueco.
  Es una inconsistencia del propio patrón ya construido en el código (el prop existe y se usa en
  una pregunta pero no en las otras dos con el mismo problema de espacio).
- La mascota `niki-saludando.webp` en apertura (page.tsx:439) sigue siendo una `<img>` plana sin
  motion ni gesto de entrada — mismo defecto que la pasada anterior, no corregido.
- Resuelto en esta pasada (confirmado visualmente en qa-ob-10.png): los chips Outfit/Postura/
  Actitud ya no quedan apretados contra el CTA — hay aire limpio entre la lista y la franja del
  botón fijo.

Top defectos:
1. [00 Apertura, banner "¡Bienvenidos!" — app/onboarding/page.tsx:427-434, CONDICIÓN INCUMPLIDA]
   Sigue sin estar en FICHA-ARTE.md (su color/gradiente dorado saturado y el trazo con contorno
   grueso no están documentados en ningún lugar del brand kit) y el plural "Bienvenidos" sigue
   chocando con el tuteo singular del resto del copy ("tu Check", "te dice"). Visualmente domina
   más que el H1 real de la pantalla (rompe la jerarquía: compite como segundo "héroe"). Fix:
   registrar el banner en FICHA-ARTE.md (color exacto, uso permitido, fecha, confirmación del
   dueño) o retirarlo y reemplazarlo por un elemento del kit ya aprobado (ej. la mascota +
   headline solo).
2. [Encabezado de todos los pasos, page.tsx:203; resultado, page.tsx:707-709 y 767-770] El lema
   "Tu Check de Presencia antes de salir" se repite arriba en cada una de las 9 pantallas del
   recorrido, y en el resultado "Check de Presencia" aparece 3 veces en una sola vista (lema +
   H1 + botón). Fix: dejar solo "niki" en el encabezado de los pasos internos (reservar el lema
   completo para la apertura, donde sí cumple función de presentación).
3. [04 Reconocimiento "No es falta de estilo", page.tsx:983-990] ~175px vacíos arriba del ícono y
   ~215px vacíos debajo del botón (medido sobre qa-ob-04.png) — la pantalla se siente incompleta,
   no una decisión de diseño. Fix: agregar un bloque `extra` como el que ya tiene reconocimiento2
   (ej. un dato del propio dolor elegido, o una mini-ilustración), o pasar a `justify-start` con
   `pt-16` fijo para que el contenido no "flote" en el centro con tanto margen muerto.
4. [02 Objetivo y 03 Dolor, page.tsx:959-981] Ambas preguntas dejan 220-280px vacíos debajo de las
   4 opciones — el mismo problema que ya se resolvió para "tiempo" (06) con `notaAyuda`, pero no
   se aplicó aquí pese a que el componente ya soporta esa prop. Fix: añadir `notaAyuda` a estas
   dos preguntas (ej. un micro-dato de por qué importa el objetivo/dolor elegido), igual que en
   "tiempo".
5. [00 Apertura, niki-saludando, page.tsx:439] Sigue siendo una `<img>` estática sin entrada ni
   gesto, igual que en la revisión anterior — no se corrigió. Fix: envolver en `motion.img` con
   spring de entrada y un balanceo único de la mano (~600ms), respetando `useReducedMotion`
   (mismo patrón ya usado en la mascota de "resultado", page.tsx:711-719).

Condición activa: el banner "¡Bienvenidos!" (defecto 1) sigue sin registrarse en FICHA-ARTE.md ni
retirarse — la condición del veredicto 2026-10-06 se cumple: esta pantalla se mantiene NO LISTA
hasta que el dueño confirme el color/uso en la ficha (y se corrijan los defectos 2-5, que ya por
sí solos bajan Usabilidad a 34/40, por debajo del umbral de 36/40).
