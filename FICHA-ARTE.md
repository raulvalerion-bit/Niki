# FICHA DE DIRECCIÓN DE ARTE — Niki

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: NO → el usuario eligió Ruta 1 ("propóngamelo tú") en la pregunta de referencia del 54, 2026-09-17

## Identidad derivada (sin referencia: FUSIÓN de líderes — 16 PASO 0.2bis)
- TABLA DE LÍDERES: TikTok/Reels (feed) → estética vibrante de atardecer, cero clínica · Cal AI/Noom → anillo de progreso central como héroe-dato · Umax (app modelo, ver FICHA-MODELO.md) → mecanismo de scan por foto + puntuación (tomado el mecanismo, invertido el tono: nunca frío/cruel)
- Combinación tipográfica: display **Unbounded** (grotesca geométrica audaz) + body **Manrope** — clase distinta a las otras 2 direcciones descartadas (Baloo 2/Plus Jakarta Sans redondeada friendly, y Fraunces/Karla serif editorial)
- Arquetipo: El Amigo Sincero con energía de "buen día" — no coach clínico, no crítico frío · Mundo del sujeto: redes sociales visuales (TikTok/Reels), luz de atardecer, energía de "salir a la calle con seguridad"
- Dirección del banco 54 usada para el dispositivo ownable: anillo de progreso central + grid 2x2 de señales — variante propia ("Glow Atardecer"), partiendo de la lógica de "Fintech de bolsillo" del 54 pero con paleta y mood completamente reemplazados por pedido del usuario

## Personalidad compilada
- 3 adjetivos de personalidad: cálido, vibrante, motivador (nunca clínico ni cruel — reacción directa a la queja #1 de Umax)
- Compilación: spring suave (sin rebote exagerado) · duración base ~220ms · exclamaciones máx 1-2/pantalla (ya usadas en headlines clave: "¡Vas a entrar seguro hoy!", "¡Tus resultados para hoy!") · celebración nivel medio (racha, frase de cierre por puntaje) · radio tendencial 14-18px

## Brand kit final (valores que viven en globals.css/@theme)
- Fondo: degradé `#FF9457 → #FFB768 → #FFD98A → #FFE9B0` (naranja→amarillo, "atardecer sin sol" — pedido explícito del usuario) · Superficie: `#FFF3DE` (translúcida sobre el degradé en pantallas con muchas tarjetas) · Texto 1º/2º: `#3C2412` / `#8A6448`
- Acento: `#7A3E1D` (marrón cálido — reemplazó al magenta original por pedido del usuario: "neutral entre hombre y mujer, que un hombre no se abstenga por ver rosa") · SOLO en: anillo de progreso, CTA principal, chip de tab activo, bordes finos de las tarjetas de resultado · 2ª nota: `#B7DE2A` (verde-lima oscurecido, un solo acento secundario en el ícono de "Actitud")
- Semánticos: éxito `#7A3E1D` (reutiliza el acento, no hay error/aviso visibles aún en las pantallas mockeadas — se definen en Sesión 3 con estados reales)
- Display: Unbounded (600/700) · Body: Manrope (400/500/600/700) · Escala: display 20-30px / title 21-22px / body 12.5-14px / label 10-11px
- Radio: cards 18px / botones 14px · Profundidad: sombras tintadas de 2 capas (tinte cálido `140 60 20`, nunca negro puro) + hairline degradada en tarjetas destacadas · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: anillo de progreso central (Puntaje de Presencia) + escala de intensidad suave→media→fuerte en las 3 tarjetas de eje (Outfit/Postura/Actitud), todas en tonos crema con contorno fino marrón — nunca relleno sólido oscuro
- Motion signature: N/A — no se animó en el mockup HTML; se define con Framer Motion/CSS en la Sesión 3+ siguiendo spring suave + duración ~220ms de la personalidad compilada

## Trazabilidad y vetos
- Ruta de diseño: propuesta propia (Protocolo A/B/C, sin referencia del usuario)
- Protocolo A/B/C: opción elegida **B** ("Glow Atardecer", tras 4 rondas de ajustes del usuario sobre la B original "Glow Eléctrico") · descartadas: A "Coach Cálido" (crema+coral, Baloo 2, héroe-dato+cards apiladas) y C "Revista de Estilo" (crema editorial+terracota, Fraunces, timeline) · página comparativa: `direcciones-abc.html` (raíz del proyecto, copia archivada en `docs/revisiones/direcciones-abc.html`) · screenshots: verificados en vivo en el Browser pane durante la sesión (no se exportó PNG aparte; el HTML es la evidencia reproducible)
- Tour de la app: `vista-previa-app.html` (raíz del proyecto, copia archivada en `docs/revisiones/vista-previa-app.html`) · vistas incluidas: pantalla principal (Hoy/M0), onboarding (pregunta de ocasión con 6 opciones), paywall (2 planes, anual recomendado), mecanismo (Scan completo con los 3 ejes + frase de cierre por puntaje) · aprobado por el usuario: SÍ, 2026-09-17, tras 5 rondas de ajustes puntuales (fondo atardecer, acento marrón, textos, orden de tarjetas, frase motivacional por puntaje)
- Paleta derivada de: fusión propia ("Glow Atardecer"), NO tomada íntegra de un líder específico — nace de la dirección oscura original ("Fintech de bolsillo" del 54) reemplazada por pedido explícito del usuario con un degradé de atardecer cálido
- Registro anti-repetición: paleta (degradé naranja-amarillo `#FF9457→#FFE9B0` + acento marrón `#7A3E1D`) y par tipográfico (Unbounded + Manrope) quedan vetados para el próximo proyecto del SO
- Modo (claro/oscuro) DERIVADO por: pedido explícito del usuario — quería "atractiva, inspiradora, colorida" y "sin sol pero con tonalidad de amanecer/atardecer"; se descartó el modo oscuro original de la dirección B tras verla comparada con las otras 2

## Idioma UI: Español (LATAM, tuteo) · Fecha de cierre de la ficha: 2026-09-17 · Aprobada por el usuario: SÍ
