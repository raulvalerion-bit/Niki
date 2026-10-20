# VEREDICTO revisor-visual — onboarding (recorrido de inicio)
Fecha: 2026-10-17 16:10
Screenshot: docs/revisiones/repaso-2026-10-17c/qa-ob-00.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Screenshots evaluados (11, orden del recorrido, repaso-2026-10-17c/)
qa-ob-00 (apertura, banner cookies) · qa-ob-01 (apertura tras decidir cookies) · qa-ob-02
(objetivo) · qa-ob-03 (dolor) · qa-ob-04 (reconocimiento "No es falta de estilo") · qa-ob-05
(ocasión — mismo paso que atrapó el defecto en la pasada anterior) · qa-ob-06 (tiempo) ·
qa-ob-07 ("¡Ya casi está!") · qa-ob-08 (carga, 75%) · qa-ob-09 / qa-ob-10 (resultado). El badge
rojo "2 Issues" en todas las capturas es el overlay de depuración de Next.js dev (CSP/eval
bloqueado, esperado en dev) — ignorado al puntuar.

Código verificado: app/onboarding/page.tsx completo, con foco en el wrapper
`AnimatePresence`/`motion.div` de L987-995 y un grep de TODOS los puntos `transition`/`initial`/
`exit` del archivo (L222, L252, L263, L573, L692, L993) para confirmar que ninguno quedó fuera
del patrón `reduce`. FICHA-ARTE.md · FICHA-AVATAR.md.

## Verificación del hallazgo de la pasada anterior

**CONFIRMADO RESUELTO.** El wrapper de pasos (L987-995) ahora es:
```
initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : 24 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -24 }}
transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
```
`opacity` y `duration` ya se zeran bajo `reduce`, mismo patrón que el resto del archivo. Evidencia
visual: qa-ob-05.png ("ocasión") — exactamente el mismo paso que capturó el parpadeo en la pasada
anterior, esta vez recapturado con reduced-motion activo y sale NÍTIDO, sin lavado de opacidad.
El grep de los 6 puntos `transition={{ duration: reduce ? ... }}` del archivo (línea 993 incluida)
confirma que es sistémico: TODOS los componentes animados del archivo —`BarraProgreso`,
`HojaSalida`, `ConteoPct`, el stagger de `PantallaPregunta`, el anillo de `PantallaCargando`, y
ahora el wrapper de pasos— manejan `reduce` de forma idéntica. No se encontró ningún punto nuevo
sin corregir.

## Hallazgos nuevos
Ninguno. Revisión de las 11 capturas + código completo no encontró defectos nuevos. Persiste sin
cambios el ítem ya reportado en pasadas previas (ver Top Defectos #1 abajo, no bloqueante).

## Detalle Usabilidad (0-4 cada una)

- h1 Visibilidad del estado: **4** — con el parpadeo de reduce resuelto, el recorrido cubre
  feedback en absolutamente todas las interacciones observables: whileTap en cada botón, check
  animado al elegir, barra de progreso, pantalla de carga con pasos reales marcados uno a uno
  (labor illusion con contenido personalizado, no genérico), y el CTA del resultado con estado
  pendiente + spinner + timeout de 8s con mensaje de error accionable (`EnlaceCta`,
  components/landing/ui.tsx:151-180). No queda ningún punto donde el usuario se pregunte "¿se
  colgó?". Es el único 4 que se otorga en esta pasada — no hay motivo para repartir más.
- h2 Lenguaje del usuario: 3 — 100% español, CTAs en 1ª persona y en el mundo del avatar
  ("Glow-Up", "vibe check" son vocabulario de marca documentado en FICHA-AVATAR, no jerga técnica).
- h3 Control y libertad: 3 — atrás en cada pregunta, X con hoja de confirmación, borrador
  retomable, "Empezar de nuevo", Escape cierra el modal, foco atrapado en la hoja.
- h4 Consistencia: 3 — con el wrapper de pasos ya alineado al mismo patrón `reduce` que el resto
  del archivo, no queda ninguna pieza de la pantalla que trate el mismo flag de forma distinta.
- h5 Prevención de errores: 3 — bloqueo de doble-tap (`if (elegido) return`), navegación por
  teclado, sin inputs libres que puedan fallar validación.
- h6 Reconocer vs recordar: 3 — opciones siempre visibles, el resultado repite las 4 respuestas en
  `FilaPlan`.
- h7 Flexibilidad (código): 3 — flechas/Home/End en el radiogroup, plan preseleccionado vía
  `?plan=`, borrador recuperable entre sesiones.
- h8 Estético y minimalista: 3 — 1 CTA primario por pantalla, elementos con función clara, sin
  relleno decorativo.
- h9 Errores con solución: 3 — único error cubierto (red al navegar) con qué pasó + qué hacer,
  sin código técnico.
- h10 Ayuda contextual: 3 — `notaAyuda`/`microCopy` en las 4 preguntas, tarjetas de contenido real
  en los 2 pasos de reconocimiento, cero pantalla muda.

**Total usabilidad: 31/40**

## Detalle Craft (0-4 cada eje)

- Jerarquía: 3 — 4 niveles nítidos, máx ~3-4 tamaños por pantalla, consistente en todo el
  recorrido.
- Profundidad: 3 — degradé base, tarjetas elevadas (surface + shadow), anillos decorativos de
  fondo, CTA fijo con velo degradé en el resultado.
- Identidad ownable: 3 — mascota 3D propia, anillo de marca, paleta atardecer + acento marrón;
  no coincide con "Capítulo" ni "Umbral" — pasa el test anti-clon.
- Movimiento (código + reduced-motion): **4** — las 7 baseline están presentes y verificadas: (1)
  stagger de entrada en `PantallaPregunta` L569-574, (2) conteo animado en `ConteoPct`, (3) anillo
  que se dibuja en `PantallaCargando` L682-693, (4) tap <150ms en `whileTap scale 0.97` en cada
  botón, (5) transición entre pasos L987-995, (6) modal suave en `HojaSalida`, (7) celebración de
  hito con rebote en `PantallaResultado` L750-758. El grep de L222/252/263/573/692/993 confirma que
  las 7 respetan `reduce` sin excepción — el único punto que fallaba (L987-995) ya está alineado.
  Es un recorrido de onboarding con reduced-motion resuelto de forma completa y sistémica, no
  parcial — justifica el 4.
- Encaje óptico: 3 — chips, números centrados y padding simétrico se sostienen en todo el
  recorrido.

**Total craft: 16/20**

## Detalle Copy (0-4 cada eje) — FICHA-AVATAR.md como fuente
(Sin cambios de copy en esta ronda; se re-verifica igual que la pasada anterior.)

- Idea única dominante: 3 — "Check de Presencia" atraviesa hero, preguntas, carga y resultado sin
  desviarse a features sueltas.
- Especificidad y prueba: 3 — números concretos y trazables ("30 segundos", "20 minutos dudando",
  "3 ajustes", "3 días gratis"); cero adjetivos huecos, cero claims de ingresos/salud.
- Emoción/dolor real: 4 — las opciones de "dolor" y los textos de reconocimiento citan casi
  literal los dolores #1/#2/#4 y la objeción #4 de FICHA-AVATAR.md ("nadie te dice la verdad por
  pena", "sin notas crueles").
- Claridad de oferta: 3 — el resultado anticipa trial de 3 días y Plan Anual sin forzar precio
  (correcto, vive en paywall), pero no nombra garantía con plazo en este tramo.
- Dirección a una acción: 4 — un solo tipo de CTA repetido en 1ª persona en las 4 pantallas con
  botón.

**Total copy: 17/20** (ningún eje ≤2)

Sub-checks binarios: garantía nombrada con plazo — NO aparece en este tramo (esperable, vive en
paywall); message-match — no verificable sin el creativo de origen.

## Fidelidad a referencia
N/A — FICHA-ARTE.md confirma que no hubo imagen de referencia del usuario (Ruta 1, 2026-09-17).

## TOP DEFECTOS (máx 5, por impacto)

1. **[Gate de carga cognitiva, "Ocasión", OCASIONES, app/onboarding/page.tsx:92-99, qa-ob-05.png]**
   6 opciones en una sola decisión excede el límite de ≤4 del gate de carga cognitiva del SO
   (mitigado con grid de 2 columnas sin scroll; excepción de producto documentada en el propio
   código para mantener las 6 del tour aprobado por el usuario). Carryover sin cambios desde hace
   3 pasadas — no bloquea el gate por sí solo, sigue siendo la única decisión del recorrido fuera
   de la regla. Fix (si se decide atacarlo): bajar a 4 opciones núcleo + "Otro momento" como
   quinta opción abierta, o dividir en 2 pasos de 3.
2. **[Resultado, botón "Desbloquear mi Check de Presencia", app/onboarding/page.tsx:793-810,
   qa-ob-09/10.png]** Dato de contexto, no defecto de código: el overlay rojo de depuración de
   Next.js dev tapa parcialmente el CTA en las capturas de este entorno. Pendiente confirmar en
   una captura de producción (sin overlay) que el padding inferior del CTA fijo
   (`pb-[max(16px,env(safe-area-inset-bottom))]`) despeja el botón completo en dispositivos con
   gesture bar — no verificable en este dev render.
3. **[Gate de usabilidad general]** El recorrido está libre de bugs funcionales y de accesibilidad
   detectables tras 3 pasadas de corrección, pero 9 de los 10 criterios de usabilidad aterrizan en
   "bien, un ojo entrenado detecta qué afinar" (3/4) en vez de "ejemplar" (4/4) — no hay un defecto
   puntual que lo explique, es pulido acumulado (microcopy de error en más puntos, un segundo nivel
   de deshacer, variación visual entre las 2 tarjetas de reconocimiento para que no se sientan
   plantilla repetida). Para cruzar el gate de 36/40 hace falta subir varios de esos 3→4 con
   evidencia concreta por heurística, no un solo fix.

## Condición para la próxima pasada
El hallazgo reportado en la 4ª pasada (wrapper de transición entre pasos, L987-995) está
CONFIRMADO RESUELTO — verificado en código (grep de los 6 puntos de transición del archivo) y en
vivo en qa-ob-05.png, el mismo paso que lo atrapó antes. Craft cruza el gate (16/20). Usabilidad
sube de 29→31/40 pero sigue bajo el umbral de 36 — no por un bug nuevo, sino porque la mayoría de
heurísticas están en "bien" y no en "ejemplar". Antes de la próxima pasada: identificar 2-3
heurísticas concretas para subir a 4/4 con mejoras específicas (ver Top Defecto #3) — ya no hay
hallazgos de reduced-motion pendientes en este archivo.
