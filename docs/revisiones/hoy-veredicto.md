# VEREDICTO revisor-visual — Hoy (M0, pantalla principal) — revisión completa con racha/misión/pendiente
Fecha: 2026-10-16 15:10
Screenshot: docs/revisiones/repaso-2026-10-16/hoy-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): N-A (pantalla post-compra, no vende)
Fidelidad (si hubo referencia): N-A (sin referencia del usuario)
Veredicto: NO LISTA

Detalle usabilidad (h1-h10):
h1 Visibilidad del estado del sistema: 4 — skeletons con forma del contenido, aria-busy, barra de progreso + mensajes rotativos en el análisis, aria-live, cancelar responde al instante (app/app/page.tsx:325-377, components/app/HoyInicio.tsx:94-104).
h2 Lenguaje del usuario (0 jerga/inglés crudo): 2 — "Check"/"Checks" e "Glow-Up" son anglicismos crudos repetidos ≥6 veces en una sola pantalla (título, CTA, contador, nombre de sección), sin traducir. Ver TOP DEFECTO 1.
h3 Control y libertad (código): 3 — Cancelar con abort real en el análisis (page.tsx:206-216), volver/atrás en el paso foto, modal de prueba con Escape + focus-trap (EstadoPlan.tsx:204-221). Sin undo para un Check ya enviado, pero no aplica (no es destructivo).
h4 Consistencia: 3 — la tarjeta "Misión de la semana" usa borde sólido 2px acento (MisionSemana.tsx:85) mientras "Pendiente" y "Racha Glow-Up" usan borde 1px tintado al 28% (HoyInicio.tsx:156,172; RachaGlowUp.tsx:84): mismo patrón de tarjeta, tratamiento de borde distinto.
h5 Prevención de errores: 3 — valida ocasión+foto antes de enviar, detecta offline, CTA nunca disabled por defecto (antipatrón evitado), reclamar misión con aria-busy. No hay más deshabilitados claros que mostrar en este estado.
h6 Reconocer vs recordar: 4 — todo visible en pantalla; la última ocasión se recuerda vía localStorage como atajo, no como carga para el usuario.
h7 Flexibilidad y eficiencia (código): 3 — atajo de "última ocasión" para el usuario recurrente (page.tsx:70-76); sin atajos de teclado (bajo impacto, es mobile-first).
h8 Estético y minimalista: 3 — 1 acción primaria clara, pero la tarjeta Racha (21 puntos vacíos) y la tarjeta Misión (3 puntos) repiten el mismo motivo visual en dos escalas distintas, una encima de otra — se percibe redundante sin aportar jerarquía.
h9 Errores claros con solución: 4 — mensajes con qué pasó + qué hacer ("No pudimos abrir esa foto. Prueba con otra..."; "Estás sin conexión..."), nunca código técnico.
h10 Ayuda contextual: 3 — empty states enseñan ("Con tu primer Check, Niki empieza a conocer tu estilo..."), toggle de info explica congeladores; sin tooltip la primera vez que aparecen Misión/Racha.

Detalle craft (jerarquía / profundidad / identidad / movimiento / encaje):
jerarquía: 3 — 4 niveles leíbles (hero 40px, título 24px, body 15px, labels 12px uppercase), pero varias tarjetas comparten casi el mismo peso de título (15-16px semibold) y se funden al entrecerrar los ojos.
profundidad: 3 — base degradé + tarjetas elevadas (shadow-1) + nav con borde superior; no hay nivel "hundido" visible en esta pantalla (no es indispensable aquí, pero reduce el conteo de niveles reales a 2).
identidad: 3 — paleta atardecer + anillo + marrón acento es ownable y pasa el test anti-clon (no coincide con "Capítulo" ni "Umbral"), pero esta pantalla no muestra ningún dispositivo de firma adicional (mascota, textura) más allá del color y el anillo.
movimiento (código): 4 — las 7 baseline están presentes y verificadas en código: stagger de entrada (HoyInicio.tsx:70-73), conteo del número héroe (ResultadoCheck.tsx:87-97 anillo; RachaGlowUp.tsx:51-57 días), anillo que se dibuja (ResultadoCheck.tsx:103-115) y puntos que aparecen con spring (MisionSemana.tsx:102-112; RachaGlowUp.tsx:109-128), tap <150ms (whileTap scale 0.97 consistente), transición entre tabs (app/app/template.tsx, fundido 200ms), modales suaves (EstadoPlan.tsx:184-221), celebración en hitos reales (ResultadoCheck.tsx:21-33 mensajes de racha 3/7/14/21). useReducedMotion respetado en todos los componentes revisados.
encaje óptico: 3 — número del anillo centrado, radios consistentes entre tarjetas y botones; el toggle "ⓘ" de congeladores es un botón real pero sin affordance visual de botón (solo texto + ícono de 14px), bajo contraste de "tapabilidad".

TOP DEFECTOS (ordenados por impacto):
1. [Título "Tu Check de hoy te espera", CTA "Hacer mi Check de Presencia", contador "Tienes 3 Checks disponibles hoy", tarjeta "RACHA GLOW-UP"] Anglicismos crudos sin traducir repetidos 6+ veces en la pantalla más vista de la app ("Check"/"Checks", "Glow-Up") → traducir a vocabulario 100% en español: p. ej. "Tu revisión de hoy", "Hacer mi revisión de presencia", "Racha Imparable"/"Racha de Brillo". Archivos: components/app/HoyInicio.tsx:112,137,143; components/app/RachaGlowUp.tsx:61-79,102.
2. [Tarjetas apiladas "Pendiente" / "Misión de la semana" / "Racha Glow-Up"] Tratamiento de borde inconsistente entre tarjetas del mismo patrón: Misión usa borde sólido 2px acento, Pendiente y Racha usan borde 1px tintado al 28% → unificar el grosor/opacidad en las tres, y si se quiere destacar Misión usar otro recurso (badge, no el borde). Archivos: components/app/MisionSemana.tsx:85 vs components/app/HoyInicio.tsx:156,172 y components/app/RachaGlowUp.tsx:84.
3. [Tarjeta Racha Glow-Up, estado "Empieza una racha nueva"] Grid de 21 círculos punteados completamente vacíos (sin indicador de "hoy" porque racha=0) ocupa un bloque grande de pantalla para comunicar solo "tu racha es 0", justo debajo del grid de 3 puntos de Misión de la Semana — mismo motivo visual repetido en dos escalas, se percibe redundante → en el estado "terminada"/"nueva" colapsar el grid a una versión compacta (p. ej. solo el primer punto resaltado) hasta que haya al menos 1 día real. components/app/RachaGlowUp.tsx:109-128.
4. [Tarjeta "PENDIENTE · OUTFIT 5/10" vs tarjeta "MISIÓN DE LA SEMANA · ACTITUD"] Dos focos de "próxima acción" sin jerarquía entre sí: la tarjeta pendiente empuja a arreglar el Outfit y la Misión de la semana premia subir Actitud — el usuario no tiene pista de cuál priorizar hoy → unificar ambas en un solo "próximo paso" o marcar visualmente cuál es la prioridad (p. ej. mover la de mayor impacto arriba, o fusionar el mensaje). components/app/HoyInicio.tsx:148-168 y components/app/MisionSemana.tsx:84-100.
5. [Cabecera, bajo "niki"] "Tu presencia, lista para salir" a 12px, peso medio, marrón sobre el naranja más saturado de toda la pantalla — sigue siendo el texto más débil visualmente (ya se había señalado a 10px el 2026-09-28 y se subió a 12px, pero el contraste tipográfico contra el fondo no se corrigió) → oscurecer el tono o subir a semibold para que no quede al límite de legibilidad. app/app/layout.tsx:53.
