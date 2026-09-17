# ESTADO — Niki (AI Image & Outfit Feedback)
Última actualización: 2026-09-17 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: Landing con su código pendiente de cierre (veredicto real del revisor-visual: NO LISTA, placeholders pendientes de app real, ver "Problemas conocidos") / Siguiente acción exacta: avanzar a la etapa pendiente de Onboarding (el cierre de landing queda pendiente hasta tener screenshots reales de la app interna)

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
- Trial: 3 días de acceso completo al plan VIP Pro (definido por el usuario en su investigación) — permite vivir el "aha" de un Scan completo + Modo Alto Impacto antes del primer cobro
- Puente del trial D1-D7: pendiente de diseñar en Sesión 5 (momentos de valor por día)
- Pricing (ACTUALIZADO en la landing, 2026-09-17): se simplificó a UN plan "VIP Pro" con 2
  frecuencias de pago (se elimina la separación Básico/VIP para reducir fricción de elección
  mientras el producto es nuevo — decisión informada, no re-abierta sin avisar): Anual $8.99/mes
  (se cobra $107.88/año, ~5 meses gratis vs. mensual) · Mensual $14.99/mes · trial de 3 días en
  ambos. Puede reintroducirse un tier Básico más adelante con datos reales de uso.

## Gamificación y retención (Sesión 4-5 — pendiente)
- Loop del hábito: pendiente de documentar en Sesión 4
- Mecánicas candidatas (del propio documento del usuario): racha diaria, "Desafío Glow-Up de 21 días"
- Primera victoria que celebra el onboarding (<60s): sube foto + selecciona ocasión → recibe 3 correcciones concretas + 1 consejo de actitud
- Notificaciones de re-enganche: pendiente

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: landing con cierre pendiente — sigue la etapa pendiente de Onboarding en paralelo (el cierre de landing depende de tener la app real, no bloquea empezar la siguiente etapa de código)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: código de las 10 secciones canónicas hecho, pendiente de aprobación final (ver
  "Puertas de etapa" y "Problemas conocidos") — protagonista: el Check de Presencia (mecanismo
  bautizado) — CTA primario: "Hacer mi Check de Presencia gratis" → `/onboarding` (Modelo 2,
  variante anónima). Mecanismo bautizado: "el Check de Presencia" — 3 pasos (subís foto y
  ocasión → Niki analiza outfit/postura/actitud → recibís 3 ajustes). Copy completo y trazado en
  `docs/copy/landing.md`.
- Onboarding: pendiente de construir — primera decisión: seleccionar ocasión (entrevista / cita / negocios / salida / cena formal / vacaciones — 6 opciones ya diseñadas en el tour de FICHA-ARTE)
- Paywall: pendiente — oferta principal: VIP Pro con trial de 3 días
- Login/Auth: pendiente — motivo de pedir cuenta: guardar historial de scans y desbloquear plan pagado
- App interna: pendiente — secciones candidatas (a confirmar en Sesión 5): Hoy (nuevo scan) / Historial / Hábitos (tracker) / Cuenta-Plan
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
- Onboarding: no iniciada
- Paywall: no iniciada
- Login/Auth: no iniciada
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
