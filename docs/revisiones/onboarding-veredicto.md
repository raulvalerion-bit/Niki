# VEREDICTO revisor-visual — onboarding (recorrido de inicio)
Fecha: 2026-10-16 (2ª pasada del día, evaluación independiente desde cero)
Screenshot: docs/revisiones/repaso-2026-10-16d/qa-ob-00.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Screenshots evaluados (11, orden del recorrido, repaso-2026-10-16d/)
qa-ob-00.png (apertura, banner cookies) · qa-ob-01.png (apertura tras decidir cookies) ·
qa-ob-02.png (objetivo) · qa-ob-03.png (dolor) · qa-ob-04.png (reconocimiento "No es falta de
estilo") · qa-ob-05.png (ocasión) · qa-ob-06.png (tiempo) · qa-ob-07.png ("¡Ya casi está!") ·
qa-ob-08.png / qa-ob-09.png (carga 25%/100%) · qa-ob-10.png (resultado)

Código verificado: app/onboarding/page.tsx (completo) · components/landing/ui.tsx (EnlaceCta,
Hairline) · components/AvisoCookies.tsx · FICHA-ARTE.md · FICHA-AVATAR.md

## Verificación de los 5 puntos reportados como corregidos (confirmado contra código + capturas)

1. **Banner "¡Bienvenido!" registrado en FICHA-ARTE, singular.** CONFIRMADO RESUELTO. En
   `PantallaApertura` (page.tsx:449-456) el banner es un `<div>` con `style={{ background:
   'var(--bg-gradient)' }}` — mismo token que usa `components/landing/tokens.css:25`
   (`--bg-gradient`, degradé "Glow Atardecer" documentado en FICHA-ARTE.md línea 17/25). Texto
   "¡Bienvenido!" (singular) en `text-[var(--accent)]`, acento `#7a3e1d` también documentado.
   Ya no es un asset suelto fuera de la ficha. Captura qa-ob-00/01 lo confirma visualmente.

2. **Lema repetido en cada paso.** CONFIRMADO RESUELTO. `MarcaNiki` se invoca una sola vez en
   todo el árbol (page.tsx:966) con `conLema={false}`; el `prop` `conLema=true` por defecto
   (línea 179) nunca se usa, así que el lema jamás aparece en el encabezado de ningún paso. El
   lema completo ("¡Tu Check de Presencia antes de salir!") vive únicamente en el `<h1>` de
   apertura (línea 457-459). Verificado en las 11 capturas: ningún paso 02-10 repite el lema.

3. **Aire muerto en "No es falta de estilo".** PARCIALMENTE RESUELTO — mejoró pero no se
   eliminó. Se agregó la tarjeta "CÓMO ES DISTINTO" (page.tsx:1018-1027), igual patrón que ya
   usaba "¡Ya casi está!". El vacío total bajó de ~390px (175+215 reportados antes) a un
   estimado de ~220px combinados por pantalla. Pero en ambas pantallas de reconocimiento
   (qa-ob-04 y qa-ob-07) el hueco queda claramente desbalanceado: mucho más aire ABAJO del
   botón (~150-170px) que ARRIBA del ícono (~45-70px), pese a que `centrado=true` usa
   `justify-center` (page.tsx:615) que debería repartirlo parejo. No es el defecto original,
   pero tampoco es el "centrado" que promete el comentario del código — ver Top Defectos #2.

4. **Objetivo y Dolor sin `notaAyuda`.** CONFIRMADO RESUELTO. `notaAyuda` presente en ambos
   (page.tsx:992 y :1005) y visible en qa-ob-02/03 ("No hay respuesta incorrecta…" / "Tu primer
   Check se enfoca justo ahí…"). Reduce el vacío inferior de forma consistente con el patrón que
   ya usaba "tiempo".

5. **`niki-saludando` estático.** CONFIRMADO RESUELTO. `NikiSaludando` (page.tsx:414-431) es
   ahora `motion.img` con resorte de entrada (`scale 0.5→1`, `spring stiffness 300`) + balanceo
   único de rotación (`rotate: [0,-10,6,0]`), respeta `useReducedMotion`. Cumple baseline #7 de
   movimiento.

## Hallazgos nuevos (no reportados en la pasada anterior)

- **Paso "tiempo" (qa-ob-06) es ahora el peor caso de aire muerto de todo el recorrido.** Solo
  2 opciones (`TIEMPOS`, page.tsx:103-106) + `notaAyuda` dejan ~220-230px totalmente vacíos bajo
  el texto de ayuda — más que el "No es falta de estilo" ya corregido. No tiene tarjeta, no está
  centrado como las pantallas de reconocimiento: simplemente termina el contenido y queda medio
  fondo libre. Un usuario que responde esta pregunta lo nota sin buscarlo.
- **Pantalla de carga al 100% con el último ítem sin check.** En `PantallaCargando`
  (page.tsx:690-705), cuando `activo` llega al último índice, ese ítem se pinta con el punto
  pulsante (`i === activo`) en vez del check (`i < activo`) — así que en qa-ob-09 el anillo dice
  "100%" pero "Tu hábito: 2 minutos cada mañana" todavía se ve "en curso", no completado. Es una
  inconsistencia visible entre el número y la lista que lo acompaña.
- **"Ocasión" presenta 6 opciones en una sola decisión** (OCASIONES, page.tsx:92-99), por
  encima del límite de ≤4 opciones del gate de carga cognitiva del propio SO. Están en grid 2
  columnas sin scroll (mitiga el problema) y hay una decisión de producto documentada en el
  código para mantener las 6 (mismas del tour aprobado) — lo dejo anotado como excepción
  deliberada, no como bloqueante, pero sigue siendo el único grupo del recorrido que no respeta
  la regla.
- **Botones "atrás"/"cerrar" de 44×44px** (`size-11`, Encabezado, page.tsx:318-336), por debajo
  del mínimo de 48px que pide el propio sistema para controles táctiles (aunque cumple el
  mínimo genérico de 44px de iOS). Menor, pero vale la corrección rápida.

## Detalle Usabilidad (0-4 cada una)

- h1 Visibilidad del estado: 3 — feedback inmediato en toda la interacción (whileTap, check
  animado, pausa de 300ms antes de avanzar, barra de progreso animada, loading con pasos
  reales, `EnlaceCta` con spinner + `aria-busy` + fallback de red a los 8s). Resta un punto por
  la inconsistencia 100%/último ítem sin check arriba.
- h2 Lenguaje del usuario: 3 — 100% español, vocabulario del avatar ("Glow-Up", "Check de
  Presencia"), cero jerga técnica ni inglés crudo no autorizado por la ficha.
- h3 Control y libertad: 3 — atrás en cada pregunta, X con hoja de confirmación, borrador
  retomable en localStorage, "Empezar de nuevo", Escape cierra el modal, focus-trap en la hoja.
  No hay forma de saltar directo a editar una respuesta anterior sin retroceder paso a paso.
- h4 Consistencia: 3 — mismo chip, mismo botón, mismo patrón de tarjeta en ambas pantallas de
  reconocimiento, mismo logo en todos los pasos. Radios consistentes por rol (18px tarjetas /
  14px botones, igual que FICHA-ARTE).
- h5 Prevención de errores: 3 — bloqueo de doble-tap durante la transición, sin inputs libres
  que fallen, navegación por teclado entre opciones.
- h6 Reconocer vs recordar: 3 — opciones siempre visibles, resultado final repite las 4
  respuestas sin pedir memorizarlas.
- h7 Flexibilidad y eficiencia (código): 3 — navegación por flechas/Home/End (page.tsx:521-538),
  plan preseleccionado vía `?plan=` (page.tsx:826-834), borrador retomable.
- h8 Estético y minimalista: 2 — un usuario cualquiera nota el vacío de la pantalla "tiempo" y
  el desbalance inferior de las pantallas de reconocimiento sin tener que buscarlo.
- h9 Errores con solución: 3 — el único error real cubierto (falla de red al navegar al
  paywall) tiene mensaje claro y acción ("Revisa tu conexión y vuelve a tocar"). Sin más
  superficie de error que probar en este flujo (no hay campos de texto).
- h10 Ayuda contextual: 3 — `notaAyuda`/`microCopy` en objetivo, dolor, ocasión y tiempo; dos
  tarjetas de contenido real en los pasos de reconocimiento. Cero pantalla muda.

**Total usabilidad: 29/40**

## Detalle Craft (0-4 cada eje)

- Jerarquía: 3 — 4 niveles nítidos (banner 40px → h1 28px → body 16px → label 11-13px), máx
  ~4 tamaños reales en toda la pantalla de apertura, bien controlado en el resto.
- Profundidad: 3 — base con degradé atardecer, tarjetas elevadas (`shadow-1`/`shadow-2`),
  anillos decorativos de fondo, CTA fijo con velo degradé en el resultado.
- Identidad ownable: 3 — mascota 3D propia, anillo de marca, paleta atardecer + acento marrón
  (no coincide con las paletas vetadas de "Capítulo" ni "Umbral" — pasa el test anti-clon).
- Movimiento (código + reduced-motion): 4 — las 7 baseline verificadas una por una: stagger de
  entrada (page.tsx:566-568), conteo animado (`ConteoPct`, :229-241), anillo que se dibuja
  (:676-680), tap <150ms (`whileTap scale 0.97` en todos los botones), transición entre pasos
  (`AnimatePresence` x-slide, :974-981), modal suave (`HojaSalida`, :247-263), celebración en
  hito (`niki-celebrando` spring al resultado, :737-745). `useReducedMotion` respetado en todas.
- Encaje óptico: 2 — el vacío desbalanceado de "tiempo" y de ambas pantallas de reconocimiento
  es un desencaje visible a simple vista; el resto (chips, números centrados, padding simétrico)
  está bien resuelto.

**Total craft: 15/20**

## Detalle Copy (0-4 cada eje) — FICHA-AVATAR.md como fuente

- Idea única dominante: 3 — "Check de Presencia" es el mecanismo bautizado que atraviesa hero,
  preguntas, carga y resultado sin desviarse a features sueltas.
- Especificidad y prueba: 3 — números concretos y trazables ("30 segundos", "20 minutos
  dudando" ≈ escena de FICHA-AVATAR §Problema, "3 ajustes", "3 días gratis"); cero adjetivos
  huecos, cero claims de ingresos/salud.
- Emoción/dolor real: 4 — las opciones de "dolor" y los textos de reconocimiento citan casi
  literal los dolores #1/#2/#4 y la objeción #4 de FICHA-AVATAR.md ("nadie te dice la verdad por
  pena", "sin notas crueles"); agita antes de resolver, no habla de features.
- Claridad de oferta: 3 — el resultado anticipa trial de 3 días y "Plan Anual" sin forzar el
  precio aquí (correcto, esa responsabilidad es del paywall), pero no nombra garantía con plazo.
- Dirección a una acción: 4 — un solo tipo de CTA repetido en 1ª persona ("Iniciar/Seguir/Ver/
  Desbloquear mi Check de Presencia") en las 4 pantallas con botón.

**Total copy: 17/20** (ningún eje ≤2)

Sub-checks binarios: garantía nombrada con plazo — NO aparece en este tramo (esperable, vive en
paywall); message-match — no verificable sin el creativo de origen.

## Fidelidad a referencia
N/A — FICHA-ARTE.md confirma que no hubo imagen de referencia del usuario (Ruta 1, "propóngamelo
tú", 2026-09-17).

## TOP DEFECTOS (máx 5, por impacto)

1. **[Paso "tiempo", app/onboarding/page.tsx:1046-1057, qa-ob-06.png]** Con solo 2 opciones
   (`TIEMPOS`, líneas 103-106) y `notaAyuda`, el contenido no llena ni el 60% de la pantalla:
   quedan ~220-230px totalmente vacíos bajo el texto de ayuda, sin tarjeta ni elemento que lo
   ancle — peor que el "No es falta de estilo" ya corregido. Fix: envolver esta pregunta (o
   cualquiera con ≤2 opciones) en el mismo patrón `centrado` que usa `PantallaReconocimiento`, o
   sumar una 3ª franja horaria real.
2. **[Pasos reconocimiento1/reconocimiento2, PantallaReconocimiento, page.tsx:615, qa-ob-04.png
   y qa-ob-07.png]** El `centrado=true` con `justify-center` no reparte el espacio parejo: el
   hueco queda ~2-3x mayor abajo del botón que arriba del ícono en ambas pantallas. Fix: medir
   en devtools si el contenedor `flex-1` realmente recibe una altura definida (la cadena de
   `flex-1` anidados puede estar colapsando a `min-content`); si no, fijar la altura del bloque
   con `justify-center` sobre el contenedor correcto.
3. **[PantallaCargando, page.tsx:690-705, qa-ob-09.png]** Al llegar a 100%, el último ítem de la
   lista ("Tu hábito…") se pinta con el punto pulsante de "en curso" en vez del check de
   completado — contradice visualmente el "100%" del anillo. Fix: cuando `pct === 100`, pintar
   también el último ítem con `Check` (ajustar la condición `i < activo` a `i <= activo` en el
   frame final, o adelantar `activo` un tick antes de mostrar 100%).
4. **["Ocasión", OCASIONES, page.tsx:92-99, qa-ob-05.png]** 6 opciones en una sola decisión
   excede el límite de ≤4 opciones del gate de carga cognitiva del SO (mitigado por el grid 2
   columnas sin scroll, y hay una decisión de producto documentada para mantener las 6 del tour
   aprobado). Fix si se corrige: partir en 2 pasos de 3, o dejarlo anotado explícitamente como
   excepción aprobada en ESTADO.md para que no vuelva a reportarse como hallazgo nuevo.
5. **[Encabezado, botones atrás/cerrar, page.tsx:318-336]** Área táctil de 44×44px (`size-11`),
   por debajo del mínimo de 48px que pide el propio sistema para controles táctiles. Fix: subir
   a `size-12` (48px), ícono se mantiene en 20px.

## Condición para la próxima pasada
No declarar "lista" hasta: (a) resolver el vacío del paso "tiempo" (defecto #1, el más visible a
simple vista) y (b) corregir la asimetría de centrado en ambas pantallas de reconocimiento
(defecto #2) — son los dos únicos puntos que bajan h8/eje5 de forma perceptible para un usuario
cualquiera. El resto de hallazgos (100%/check, 6 opciones en ocasión, 44px de touch target) son
pulido, no bloqueantes del gate, pero deben corregirse antes del siguiente cierre.
