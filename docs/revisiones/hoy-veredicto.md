# VEREDICTO revisor-visual — Hoy (M0, pantalla principal)
Fecha: 2026-10-20 18:00
Screenshot: docs/revisiones/repaso-2026-10-20/hoy-v4-375-00.png · docs/revisiones/repaso-2026-10-20/hoy-v4-375-01.png
Usabilidad: 35/40
Craft: 19/20
Copy (si vende): N-A (pantalla post-compra, no vende)
Fidelidad (si hubo referencia): N-A (sin referencia del usuario — Ruta 1)
Veredicto: NO LISTA

Detalle usabilidad (h1-h10):
h1 Visibilidad del estado del sistema: 4 — sin cambios: skeleton con forma del contenido (HoyInicio.tsx:94-104), aria-busy, cancelar con abort real, estados de error con reintentar.
h2 Lenguaje del usuario: 4 — sin cambios: "Check"/"Checks"/"Glow-Up" son vocabulario de marca exigido por FICHA-AVATAR.md, no jerga; resto del copy en español llano.
h3 Control y libertad (código): 3 — sin cambios: cancelar con abort real, reintentar en error de carga y de misión, sin undo explícito (no hay acción destructiva en esta pantalla).
h4 Consistencia: 4 — sin cambios: "Tu último ajuste" sigue reutilizando el patrón hundido de paywall/page.tsx (color-mix + inset shadow), confirmado en la captura.
h5 Prevención de errores: 3 — sin cambios: CTA nunca disabled por defecto, valida ocasión+foto antes de enviar, detecta offline.
h6 Reconocer vs recordar: 4 — sin cambios.
h7 Flexibilidad y eficiencia (código): 3 — sin cambios.
h8 Estético y minimalista: 3 (sin cambio neto) — FIX CONFIRMADO: RachaGlowUp.tsx:103 es ahora `font-semibold`, igual que MisionSemana.tsx:96 y HoyInicio.tsx:173 (los 3: `text-[17px] font-semibold leading-[1.3]`). El defecto exacto de la ronda anterior (peso de fuente distinto entre las 3 tarjetas) está 100% resuelto, confirmado en código y en la captura 01. PERO al revisar las 3 tarjetas de nuevo con lupa aparece un residuo distinto, no reportado antes: el contenedor del ícono es `size-10` (40px) en MisionSemana.tsx:87 y `size-9` (36px) en RachaGlowUp.tsx:90 y en el bloque "Tu último ajuste" de HoyInicio.tsx:166 — mismo patrón ícono+título repetido 3 veces en la misma pantalla, con un tamaño de contenedor que no es idéntico entre las 3. Es una diferencia de 4px (~11%) que un usuario cualquiera no nota a simple vista (no baja a 2), pero que impide certificar la tipografía/retícula de las 3 tarjetas como "100% unificada" (criterio de 4 = ejemplar/decil superior, cero residuos ni con lupa) → se queda en 3, por una razón distinta y más leve que en la ronda anterior.
h9 Errores claros con solución: 4 — sin cambios.
h10 Ayuda contextual: 3 — sin cambios: el concepto de "gemas" (MisionSemana.tsx:118-119,130-131,135) sigue sin una explicación la primera vez que aparece. (Nota: "congeladores" SÍ tiene este patrón resuelto — RachaGlowUp.tsx:138-153, chip con ícono Info que al tocarlo despliega una explicación corta — es la prueba de que el patrón existe en el código base y falta aplicarlo a "gemas".)

Detalle craft (jerarquía / profundidad / identidad / movimiento / encaje):
jerarquía: 4 — sin cambios respecto a la ronda anterior: MisionSemana.tsx:96, RachaGlowUp.tsx:103 y HoyInicio.tsx:173 en 17px, 4 niveles nítidos (héroe 24px → título de tarjeta 17px → cuerpo 15px → label 12px uppercase). El criterio de este eje es tamaño/escala, ya resuelto; el residuo de esta ronda (tamaño del contenedor de ícono) no es un nivel de jerarquía tipográfica, por eso no mueve este eje.
profundidad: 4 — sin cambios: 3 niveles (base degradé, elevado Misión/Racha con borde+shadow-1, hundido "Tu último ajuste" con color-mix+inset shadow) confirmados en código y en la captura.
identidad: 3 — sin cambios: la mascota Niki (aprobada en FICHA-ARTE.md) sigue sin aparecer en esta pantalla.
movimiento (código): 4 — sin cambios: las 7 baseline verificadas, useReducedMotion respetado en los 3 archivos.
encaje óptico: 4 — sin cambios respecto a la ronda anterior (min-h-11 en el link de Misión, label de "Tu último ajuste" en text-primary, ya confirmados). El residuo de tamaño de ícono entre tarjetas (ver h8) es exactamente el tipo de desencaje que vive en este eje, pero no alcanza a bajarlo de 4: es un desencaje de 4px entre contenedores de 36-40px, no un desencaje "a simple vista" como pide el eje (0 = desencajes a simple vista; aquí no los hay a simple vista, sí con medición).

TOP DEFECTOS (ordenados por impacto):
1. [MisionSemana.tsx:87 ícono `size-10` (40px) vs RachaGlowUp.tsx:90 e "Tu último ajuste" en HoyInicio.tsx:166 ícono `size-9` (36px), las 3 tarjetas apiladas en "Hoy"] Mismo patrón ícono+título repetido 3 veces en la pantalla, pero el contenedor del ícono de Misión es 4px más grande que el de las otras 2 → cambiar MisionSemana.tsx:87 de `size-10` a `size-9` (o subir las otras 2 a `size-10`) para igualar los 3 contenedores.
2. [Pantalla completa "Hoy", estado normal] La mascota Niki (aprobada en FICHA-ARTE.md, estados ≥40px) sigue sin aparecer en la pantalla más vista de la app → incorporar un estado neutro de la mascota en la próxima iteración.
3. [MisionSemana.tsx:118-119,130-131,135, concepto "gemas"] "+3 gemas" aparece 3 veces sin que nada explique qué son ni para qué sirven la primera vez que un usuario nuevo las ve, mientras "congeladores" en la tarjeta de abajo (RachaGlowUp.tsx:138-153) ya resuelve esto con un chip tocable que despliega la explicación → reusar el mismo patrón de chip+Info+explicación para "gemas".
4. [HoyInicio.tsx, h3/h7 — verificado en código, sin cambios en esta ronda] No hay atajos de teclado ni flexibilidad para usuario experto, y no hay acción de deshacer en esta pantalla (no es crítico porque no hay acción destructiva, pero limita h3/h7 a 3) → fuera de alcance de esta ronda, dejar anotado para una pasada de pulido general.

Nota de contexto (verificación del fix solicitado para esta ronda, respecto al veredicto de 2026-10-20 15:00, 35/40 · 19/20):
- Fix solicitado (RachaGlowUp.tsx:103 de `font-bold` a `font-semibold`): CONFIRMADO en código — línea 103 ahora es `text-[17px] font-semibold leading-[1.3] text-[var(--text-primary)]`, idéntica a MisionSemana.tsx:96 y HoyInicio.tsx:173. El TOP DEFECTO 1 de la ronda anterior queda 100% resuelto.
- Al desaparecer ese defecto, una revisión fresca y con lupa de las mismas 3 tarjetas encuentra un residuo distinto y más leve (tamaño de contenedor de ícono, 36px vs 40px) que no había sido reportado en ninguna ronda anterior. Es genuino (verificado en código, no interpretación) y entra en el mismo criterio de h8 ("tipografía... consistentes entre sí" / "cada elemento se gana su lugar"), así que mantiene h8 en 3 en vez de subirlo a 4.
- Usabilidad se mantiene en 35/40 (mismo total, causa distinta en h8). Craft se mantiene en 19/20 (el residuo de ícono no es un defecto de escala tipográfica ni un desencaje "a simple vista", por eso no baja jerarquía ni encaje).

Gate doble (≥36/40 usabilidad Y ≥16/20 craft): craft pasa con holgura (19/20); usabilidad se queda en 35/40, otra vez a 1 punto del umbral, por un residuo de consistencia distinto y más pequeño que en la ronda anterior (tamaño de ícono entre 3 tarjetas, no peso de fuente). NO LISTA.
