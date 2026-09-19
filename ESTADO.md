# ESTADO — Niki (AI Image & Outfit Feedback)
Última actualización: 2026-09-18 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: camino completo de la app construido y APROBADO A OJO
por el usuario de punta a punta — Onboarding (Paso 2, 8 pantallas), Paywall (Paso 3), Login (Paso
4, sin contraseña), App interna (Paso 5: Hoy/Historial/Hábitos/Perfil). Logo Anillo Niki confirmado
(chip con degradé atardecer) + tagline "Tus ejes de Presencia e Imagen" aplicados en el encabezado
de las 8+4 pantallas. Todo commiteado a git (5 commits de esta sesión, terminan en el commit que
registra este ESTADO.md). Sin backend real todavía (Supabase/Hotmart/IA no conectados) — cada
pantalla que necesitaría datos reales avisa con honestidad en vez de inventarlos. / Siguiente
acción exacta: al retomar, preguntar al usuario si quiere seguir ajustando detalles visuales o si
pasa a la Sesión de Servicios externos (conectar GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart)
para que todo funcione de verdad — es lo único que falta para tener una v1 vendible completa.

⚠️ Nota para quien retome: en la sesión anterior el usuario confundió dos artefactos distintos del
proyecto — el Tour de la app (`vista-previa-app.html`, maqueta fija de Sesión 2, ya cerrada) y el
Onboarding real (`app/onboarding/page.tsx`, funcional). Ya se resolvió (el logo y la barra de
pestañas del Tour ya están aplicados donde correspondía de verdad), pero si vuelve a pedir algo que
suene a esa maqueta, verificar primero A CUÁL pantalla real se refiere.

## Qué es esta app (3 líneas máximo)
Niki analiza fotos de cuerpo entero por IA y da feedback instantáneo de outfit, postura y actitud según el evento (cita, entrevista, fiesta), con hábitos diarios de presencia. Para jóvenes de 18-32 años LATAM con inseguridad de imagen. Monetiza con suscripción freemium por niveles + trial de 3 días.

## Promesa central
"Niki ayuda a jóvenes inseguros de su imagen a lograr un Glow-Up real en outfit, postura y actitud, sin depender de opiniones piadosas de amigos ni críticas destructivas de apps de rating, mediante un análisis de foto por IA con tono de coach constructivo."

## Reporte de validación (Sesión 1)
- Veredicto: Viable con ajustes — idea ya validada por el usuario (documento "IDEA VALIDADA PARA CONSTRUIR" con investigación de mercado propia), no se re-valida
- Apps de referencia: Fabulous (abstracta, sin feedback visual) · StyleDNA/Umax (rating cruel tipo "4/10", caro, solo colorimetría) · OutfitMind/AICO (solo catalogan ropa, no evalúan a la persona)
- Lo que los usuarios odian de la competencia (nuestra oportunidad): notas frías sin plan de acción, feedback genérico no personalizado al cuerpo real, no evalúan postura/actitud ni preparan para eventos específicos
- Brecha LATAM confirmada: no evaluada explícitamente en el documento — se asume por idioma español del documento y canal de venta Hotmart; validar con primeros usuarios
- Precio de referencia del mercado: $4.99/semana - $19.99/mes (apps de IA visual)

## Dirección de Arte (Sesión 2 — CERRADA, cosa juzgada)
- FICHA-ARTE.md: existe y aprobada — 2026-09-17
- ¿Hubo referencia visual del usuario?: NO — eligió Ruta 1 ("propóngamelo tú")
- Ruta de diseño: propuesta propia (Protocolo A/B/C) — Opción B elegida y ajustada 5 rondas por el usuario, luego confirmada con el Tour
- Resumen: "Glow Atardecer" — degradé naranja→amarillo `#FF9457→#FFE9B0` (sin sol) · acento marrón cálido `#7A3E1D` (neutral, reemplazó al magenta original) · 2ª nota verde-lima `#B7DE2A` · display Unbounded + body Manrope · anillo de progreso central como dispositivo ownable
- Descartadas: A "Coach Cálido" (crema+coral/Baloo2) y C "Revista de Estilo" (crema editorial/Fraunces)
- Evidencia archivada: `docs/revisiones/direcciones-abc.html` y `docs/revisiones/vista-previa-app.html`
- Registro anti-repetición: paleta atardecer+marrón y par Unbounded/Manrope vetados para el próximo proyecto del SO

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: existe y aprobada — 2026-09-17 (el copy de venta se DERIVA de ella)
- Resumen: avatar Mateo, 24 años, joven profesional LATAM inseguro de su imagen · dolor #1 "mi ropa se ve rara y nadie me lo dice" · deseo #1 "saber con 100% certeza que me veo impecable" · nivel de consciencia: Consciente del Problema · sofisticación: media-alta (ya rechazó competidores)
- Landing: sigue la ESTRUCTURA CANÓNICA de 10 secciones del 19 — carrusel con placeholders hasta tener seed de datos demo · footer legal: las 4 páginas existen (contenido real, con placeholders de identidad legal pendientes — ver "Problemas conocidos")

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Onboarding-first con preview→paywall (el usuario sube su primera foto en el onboarding, ve un resultado personalizado parcial, y ahí se le presenta el paywall con trial)
- Justificación: app de uso diario/hábito (4-7 veces/semana, no un resultado de una sola vez) con resultado altamente personalizable que vale la pena mostrar antes de pedir pago — patrón validado por Cal AI/Noom para nichos de bienestar personal con onboarding emocional
- Diseño del paywall: resultado personalizado visible (primer "Scan de Presencia"), 2 planes (Básico y VIP Pro), precio con ancla anual, garantía, CTA con beneficio concreto
- Trial: 3 días de acceso completo al plan VIP Pro — permite vivir el "aha" de un Scan completo +
  Modo Alto Impacto antes del primer cobro. ACTUALIZADO 2026-09-18 (a pedido explícito del
  usuario, tras revisar un benchmark de paywalls de alta conversión): el trial va SOLO en el plan
  Anual — el Mensual cobra desde el primer día, sin prueba. Implementado en `app/paywall/page.tsx`.
- Puente del trial D1-D7: pendiente de diseñar en Sesión 5 (momentos de valor por día)
- Pricing (NO TOCAR sin nueva investigación de mercado — 2026-09-18 se evaluó y se descartó a
  propósito bajarlo a $49.99/año por sugerencia externa sin respaldo de FICHA-MERCADO.md): UN plan
  "VIP Pro" con 2 frecuencias de pago (se elimina la separación Básico/VIP para reducir fricción
  de elección mientras el producto es nuevo): Anual $8.99/mes (se cobra $107.88/año, ~5 meses
  gratis vs. mensual, ≈$0.30/día) · Mensual $14.99/mes. Puede reintroducirse un tier Básico más
  adelante con datos reales de uso.
- Prueba social (estrellas/testimonios): PROHIBIDO agregarla hasta tener compradores reales —
  Niki no tiene usuarios todavía; se evaluó y se descartó a propósito por sugerencia externa
  (2026-09-18). Ver nota igual en `app/onboarding/page.tsx` y `app/paywall/page.tsx`.

## Gamificación y retención (Sesión 4-5 — pendiente)
- Loop del hábito: pendiente de documentar en Sesión 4
- Mecánicas candidatas (del propio documento del usuario): racha diaria, "Desafío Glow-Up de 21 días"
- Primera victoria que celebra el onboarding (<60s): sube foto + selecciona ocasión → recibe 3 correcciones concretas + 1 consejo de actitud
- Notificaciones de re-enganche: pendiente

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: landing con cierre pendiente (no bloquea) — Onboarding y Paywall con UI aprobada a ojo por el usuario — sigue Login (Paso 4)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: código de las 10 secciones canónicas hecho, pendiente de aprobación final (ver
  "Puertas de etapa" y "Problemas conocidos") — protagonista: el Check de Presencia (mecanismo
  bautizado) — CTA primario: "Hacer mi Check de Presencia gratis" → `/onboarding` (Modelo 2,
  variante anónima). Mecanismo bautizado: "el Check de Presencia" — 3 pasos (subís foto y
  ocasión → Niki analiza outfit/postura/actitud → recibís 3 ajustes). Copy completo y trazado en
  `docs/copy/landing.md`.
- Onboarding: v2 (2026-09-18), 8 pantallas — 1) apertura/hook · 2) objetivo (4 opciones, incluye
  "Mejorar mi imagen personal día con día") · 3) dolor que más frena · 4) reconocimiento "Tiene
  sentido" (ícono dinámico según el dolor) · 5) ocasión (6 opciones, grid 2 columnas) · 6) tiempo
  a dedicar (2 opciones + nota de ayuda) · 7) reconocimiento "¡Vamos avanzando!" (ícono cohete) ·
  8) resultado "¡Tu plan de Presencia está listo!" con 4 tarjetas bloqueadas (Outfit/Postura/
  Actitud/Racha, sin números inventados — decisión a propósito, ver comentario al inicio de
  `app/onboarding/page.tsx`) → CTA a `/paywall`. Logo "niki" (Anillo Niki) visible arriba a la
  izquierda en todas las pantallas. Aprobado a ojo por el usuario (no pasó el gate automático
  ≥36/40+16/20 del revisor-visual tras 5 rondas — quedó en ~28/40+13/20 con defectos residuales
  de gusto/espacio; el usuario revisó las capturas él mismo y dio el visto bueno, así que se
  prioriza su aprobación directa sobre el puntaje automático).
- Paywall: construido (2026-09-18) en `app/paywall/page.tsx` — 1 plan "VIP Pro" con selector
  Anual ($8.99/mes, facturado anual, badge "3 días gratis", preseleccionado) / Mensual
  ($14.99/mes) + 3 bullets de beneficios + CTA "¡Comienzo mi prueba de tres días gratis!" → lleva
  a `/login`. Sin conexión a Hotmart todavía (Servicios externos sigue bloqueado) — el botón no
  cobra nada. Aprobado a ojo por el usuario.
- Login/Auth: construido (2026-09-18) en `app/login/page.tsx` — sin contraseña, correo + código
  de 6 dígitos (decisión Hotmart-first de `26-AUTH-MODERNO.md`), con la ruta de rescate "compré y
  no me llega" que `18-VENTA-HOTMART.md` exige desde el día 1. Sin backend real todavía (Supabase/
  Resend no conectados) — el flujo está simulado (cualquier código de 6 dígitos completo avanza)
  para que se vea y se sienta terminado; se conecta de verdad en Servicios externos. Lleva a `/app`
  (nuevo stub honesto). Motivo de pedir cuenta: guardar historial de scans y desbloquear plan pagado.
- App interna: construida (2026-09-18) — 4 pantallas con barra de pestañas compartida
  (`app/app/layout.tsx`): Hoy (`app/app/page.tsx`, ritual M0 con foto+ocasión funcional, la IA
  responde con aviso honesto porque todavía no está conectada — nunca inventa un resultado),
  Historial (`historial/page.tsx`, empty state real de día 1), Hábitos (`habitos/page.tsx`,
  tracker semanal con fechas reales), Perfil (`perfil/page.tsx`, cuenta/plan/legales). Sin
  persistencia real (no hay Supabase): racha, hábito y plan mostrados son el estado de un usuario
  recién registrado, no datos guardados de verdad todavía. ACTUALIZADO 2026-09-18 a pedido del
  usuario: el contador de "Hoy" es de GEMAS, no de racha de días — se gana 1 gema por cada Check
  con calificación obtenida (mecánica de gamificación nueva, pendiente de: definir si las gemas
  desbloquean algo o son solo progreso visible — se decide cuando se diseñe el loop completo de
  `24-GAMIFICACION.md`). Ocasiones del Check: mismas 6 de la landing/onboarding (Entrevista, Cita,
  Negocios, Amigos, Cena formal, Vacaciones).
- Servicios externos: pendiente — GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart
- Regla: si una etapa anterior está pendiente, NO construir la etapa siguiente salvo prototipo marcado como tal.

## Puertas de etapa (aprobación antes de avanzar)
- Landing: código no aprobado — veredicto REAL del revisor-visual (docs/revisiones/landing-veredicto.md,
  2ª pasada tras corregir un bug de captura): Usabilidad 25/40, Craft 12/20, Copy 18/20 (el copy SÍ
  pasa el umbral de 16/20). NO llega a 36/40 y 16/20 por motivos ESPERADOS a esta altura del
  proyecto, no por errores de código: (1) el visual del hero es un placeholder honesto con texto
  de sugerencia visible, (2) las 4 tarjetas del carrusel "La app por dentro" están vacías con solo
  el nombre de la pantalla, (3) el anillo de progreso (dispositivo ownable de FICHA-ARTE.md) no
  aparece porque vive dentro de esos mismos placeholders. Los 3 se resuelven solos cuando exista
  la app interna real y se tomen sus screenshots (regla del 19 §5) — no antes. Un defecto SÍ real
  y ya corregido en esta sesión: `useReveal` en `components/landing/ui.tsx` no respetaba
  `prefers-reduced-motion` (contenido nacía en opacity:0); se corrigió para que nazca visible.
  Re-revisar con el revisor-visual cuando se monten los screenshots reales del carrusel.
- Onboarding: v2 aprobada A OJO por el usuario (2026-09-18) tras varias rondas de ajuste de
  contenido y estilo — el gate automático del revisor-visual NO se alcanzó (última medición:
  Usabilidad 28/40, Craft 13/20, bajo el umbral 36/40+16/20) por defectos menores de espacio y
  gusto donde el propio revisor se contradecía entre rondas; el usuario vio las 8 capturas y
  aprobó directamente. Pendiente si se quiere cerrar del todo: una pasada más del revisor-visual
  sobre la versión final (con logo, títulos centrados y copy actuales) — no bloqueante.
- Paywall: construida y aprobada a ojo por el usuario (2026-09-18) — sin pasar por revisor-visual
  todavía (pendiente si se quiere el veredicto formal antes de conectar Hotmart).
- Login/Auth: no iniciada (stub honesto en su lugar)
- App interna: no iniciada
- Servicios externos: bloqueados
- Certificado /100: pendiente

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (App Router) — decidido el 2026-09-17. Razón: landing con SEO/adquisición orgánica es canal #1 (TikTok/Reels + contenido), y la app comparte proyecto con la landing — regla del stack indica Next.js ante SEO/landing integrada
- Stack: Next.js + Supabase (auth, DB, RLS) + IA vía BFF (servidor, claves fuera del frontend) + Vercel (hosting) + Resend (emails) + Hotmart (checkout/venta)
- Features del MVP (orden de prioridad): 1) Scan de Presencia por Foto, 2) Motor de Feedback Niki (Outfit/Postura/Actitud), 3) Modo Alto Impacto (Eventos VIP), 4) Tracker de Hábitos de Presencia
- Qué NO se construye aún: sensores de salud, diario confidencial, tests psicológicos, red social/feed
- Modelo de IA: pendiente de elegir proveedor de visión (a definir en Sesión 3, `30-INTEGRACION-IA.md`) — siempre vía variable de entorno, nunca hardcodeado

## Sesiones completadas ✅
- Sesión 1 — idea recibida y validada, FICHA-AVATAR.md y FICHA-MODELO.md completas y aprobadas, framework/modelo de monetización decididos — 2026-09-17
- Sesión 2 — Dirección de Arte: comparativa A/B/C + Tour de la app, dirección "Glow Atardecer" (B) elegida y ajustada 5 rondas, FICHA-ARTE.md cerrada y aprobada — 2026-09-17

## Ajustes de diseño/copy pedidos por el usuario tras ver la landing (2026-09-17)
- Hero: H1 cambiado a "Revisa si tu outfit e imagen son las mejores en 30 segundos" (excede el tope de 10 palabras del componente por 2 — excepción aceptada a pedido explícito).
- Agitación: el bloque "En 6 meses" pasó de negativo ("si nada cambia...") a positivo ("¡Asómbrate de los cambios que has hecho en tu persona!"), con fondo dorado nuevo (`--gold`). Nota de diseño: esto suaviza la lógica de "costo de esperar" del PAS clásico — se mantiene igual porque el usuario lo pidió explícitamente; si la landing no convierte, este es un punto a revisar primero (60).
- Solución: "una devolución honesta" → "una retroalimentación honesta". Paso 1 ahora lista las 6 ocasiones completas. Antes/Después con fondo gris claro (`--gray-claro`) y dorado (`--gold`) respectivamente.
- AppPorDentro: título con signos de exclamación.
- CtaFinal: fondo cambiado de marrón sólido (`--text-primary`) a dorado (`--gold`) — el usuario lo describió como "muy emplastado"; se ajustaron todos los colores de texto del bloque para mantener contraste AA sobre el nuevo fondo.
- Se agregaron 2 tokens nuevos a `components/landing/tokens.css`: `--gold` (#D4A72C) y `--gold-text` (#3C2412), y `--gray-claro` (#ECECEC) — documentados ahí con el motivo (pedido explícito del usuario, no parte de la fusión original de FICHA-ARTE).
- Screenshot de evidencia (`docs/revisiones/landing-375.png`) re-generado tras estos cambios; el veredicto guardado en `docs/revisiones/landing-veredicto.md` es de la versión ANTERIOR a estos ajustes — falta re-correr el revisor-visual si se quiere un veredicto actualizado (no urgente: los motivos de "NO LISTA" — placeholders de la app — siguen iguales).

## Sesión en progreso 🔧
- Sesión 3 (landing) — código de las 10 secciones con veredicto real registrado (NO LISTA, ver "Puertas de etapa"); cierre pendiente de los screenshots reales de la app interna, no bloquea seguir con la etapa pendiente de Onboarding

## Próximas sesiones 📋
- Onboarding (Paso 2) — reutiliza la pregunta de ocasión y el tono ya validados en el tour de FICHA-ARTE
- Paywall, login, app interna, servicios externos (según secuencia maestra)
- Cuando exista la app interna: montar los screenshots reales en el carrusel de la landing y volver a pasar el revisor-visual para cerrar esa puerta del todo

## Problemas conocidos ⚠️
- Carrusel de "La app por dentro" (pantalla de Onboarding incluida entre sus frames): usa PLACEHOLDERS rotulados — la app interna está pendiente de existir; se reemplazan por screenshots reales cuando esa app se haga (Sesión de app interna). Este es el motivo #1 por el que el veredicto del revisor-visual sobre la landing quedó en "no aprobado" — pendiente y esperado a esta altura, no un bug.
- Visual del hero: placeholder honesto con sugerencia escrita (no hay app interna todavía para capturar) — mismo motivo que arriba.
- El anillo de progreso (dispositivo ownable de FICHA-ARTE.md) no es visible en la landing todavía porque vive dentro de los placeholders de arriba — aparecerá solo cuando se monten los screenshots reales.
- Garantía (sección 7 y /reembolsos): el copy público NO fija un número de días porque Hotmart todavía no está configurado (FICHA-MERCADO.md §4 guarda 7 días como plazo legal mínimo de referencia para uso interno, no publicado). Se confirma y se actualiza el copy al configurar Hotmart en la Sesión de servicios externos.
- Email de soporte "hola@niki.app": dominio provisional, pendiente de comprar el dominio real.
- FAQ de la landing: se recortó de 6 a 5 preguntas tras la revisión (gate de carga cognitiva ≤4-5 ítems) — ver docs/copy/landing.md.
- Registro voseo→tuteo: la primera pasada de copy salió en voseo (vos/sabés/tenés) por error — FICHA-AVATAR.md declara tuteo (coherente con México, país del responsable). Ya corregido (2026-09-17) en el copy de la landing y en el stub pendiente de onboarding; audit-conversion.sh confirma 0 hits de voseo tras el ajuste.
- audit-conversion.sh reporta 2 falsos positivos conocidos y verificados manualmente (no requieren cambio de código): (1) "HAIRLINES DEGRADÉ" no detecta el patrón padding-box/border-box porque el kit lo arma con template literals inline en components/landing/ui.tsx (`<Hairline>`), no en un archivo .css parseado ni con un componente llamado "GradientBorder"; se verificó visualmente el borde degradado en el plan recomendado y la garantía (screenshot de esta sesión). (2) "PROFUNDIDAD DE FONDO" no detecta el mesh radial del Hero (components/landing/Hero.tsx) porque el string del gradiente está en la línea siguiente a la palabra "background" dentro del `style={{ }}`, y el script exige ambos en la MISMA línea; se verificó visualmente el degradé sutil detrás del héroe.
- Pendiente (no crítico): el archivo direcciones-abc.html (comparador histórico, ya resuelto — el usuario ya eligió y aprobó la dirección B) tiene un emoji dentro de un COMENTARIO HTML del propio kit-plantilla (no visible al usuario) y ~85% de similitud de DOM entre sus 3 opciones — ambos hallazgos son sobre un artefacto de decisión ya cerrado, no sobre la landing en producción.
- 2 falsos positivos más de audit-conversion.sh, verificados y sin acción necesaria: (1) "VOZ vs FICHA-AVATAR" marca la palabra inglesa "animate" (prop de Framer Motion, `animate={{...}}`) como si fuera un verbo en voseo español — es una coincidencia de patrón, no hay voseo real ahí (confirmado leyendo Faq.tsx:89, Hero.tsx:86, ui.tsx:232: los 3 son la prop `animate` de motion, no una palabra en español). (2) "PRESUPUESTO DE COPY" marca el PS del CTA final (app/page.tsx:198, 43 palabras) contra el límite genérico de párrafo (30 palabras) sin saber que CtaFinal.tsx declara su propio presupuesto de 55 palabras para ese campo (`warnCopy('CtaFinal → PS', psMarked, 55)`) — 43 ≤ 55, cumple.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [x] Nombre/razón social y país del responsable legal — recibido: Raúl Valerio Nebradt, México (ya aplicado en /privacidad y /terminos)
- [ ] Más adelante: crear cuentas Hotmart/Supabase/Vercel/Resend, comprar dominio (se le pedirá guiado, paso a paso, en la Sesión de servicios externos)

## Notas para la próxima sesión
- El usuario no es técnico. Explicar todo en simple. Decidir por él salvo gustos visuales/identidad y gastos.
- El documento fuente de la idea está en: C:\Users\Raul Valerio\Documents\Z Rentas Inteligentes\Resumen de mi idea para la App Niki.pdf — ya fue leído e incorporado a FICHA-AVATAR.md, no hace falta releerlo salvo para citar textual.
