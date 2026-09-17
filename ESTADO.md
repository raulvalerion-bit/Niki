# ESTADO — Niki (AI Image & Outfit Feedback)
Última actualización: 2026-09-17 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: Landing de ventas construida (10 secciones canónicas), verificada a 375px y en desktop, dev server corriendo en localhost:3000 / Siguiente acción exacta: Puerta de Etapa de la landing (revisor-visual + rúbricas /40 y /20) y luego avanzar a la Sesión de Onboarding

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
- Estado de la secuencia: Landing construida — sigue Onboarding
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: CONSTRUIDA (2026-09-17) — protagonista: el Check de Presencia (mecanismo bautizado) —
  CTA primario: "Hacer mi Check de Presencia gratis" → `/onboarding` (Modelo 2, variante anónima).
  Mecanismo bautizado: "el Check de Presencia" — 3 pasos (subís foto y ocasión → Niki analiza
  outfit/postura/actitud → recibís 3 ajustes). Copy completo y trazado en `docs/copy/landing.md`.
- Onboarding: pendiente — primera decisión: seleccionar ocasión (entrevista / cita / negocios / salida / cena formal / vacaciones — 6 opciones ya diseñadas en el tour de FICHA-ARTE)
- Paywall: pendiente — oferta principal: VIP Pro con trial de 3 días
- Login/Auth: pendiente — motivo de pedir cuenta: guardar historial de scans y desbloquear plan pagado
- App interna: pendiente — secciones candidatas (a confirmar en Sesión 5): Hoy (nuevo scan) / Historial / Hábitos (tracker) / Cuenta-Plan
- Servicios externos: pendiente — GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart
- Regla: si una etapa anterior está pendiente, NO construir la etapa siguiente salvo prototipo marcado como tal.

## Puertas de etapa (aprobación antes de avanzar)
- Landing: construida, no aprobada todavía — falta el Reporte de Puerta formal (revisor-visual
  independiente, rúbricas /40 usabilidad y /20 craft de RUBRICAS-DE-PANTALLA.md, y /20 copy de
  52) antes de declararla cerrada. Verificación propia ya hecha: tsc limpio, screenshot real a
  375px y desktop revisados sección por sección, 0 enlaces rotos (las 4 páginas legales y los
  stubs de /onboarding y /entrar existen).
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
- Sesión 3 (landing) — construida y verificada por el propio agente; falta el Reporte de Puerta con revisor-visual independiente antes de cerrarla del todo

## Próximas sesiones 📋
- Cerrar la puerta de la landing (revisor-visual + rúbricas) y avanzar a Onboarding
- Onboarding, paywall, login, app interna, servicios externos (según secuencia maestra)

## Problemas conocidos ⚠️
- Carrusel de "La app por dentro": usa PLACEHOLDERS rotulados (Hoy / Onboarding / Scan completo / Hábitos) — la app interna todavía no existe; se reemplazan por screenshots reales cuando se construya (Sesión de app interna).
- Visual del hero: placeholder honesto con sugerencia escrita (no hay app interna todavía para capturar).
- Garantía (sección 7 y /reembolsos): NO se prometió un número de días concreto porque Hotmart todavía no está configurado — se define en la Sesión de servicios externos y ahí se actualiza el copy.
- Páginas legales (/privacidad, /terminos): tienen placeholders "[Nombre o razón social del responsable — completar]" y "[país — completar]" — el agente NO puede inventar la identidad legal del negocio; falta que el usuario los provea antes de publicar.
- Email de soporte "hola@niki.app": dominio provisional, pendiente de comprar el dominio real.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Cuando quiera publicar de verdad: darnos su nombre/razón social y país para completar las páginas legales (dato que el agente no puede inventar)
- [ ] Más adelante: crear cuentas Hotmart/Supabase/Vercel/Resend, comprar dominio (se le pedirá guiado, paso a paso, en la Sesión de servicios externos)

## Notas para la próxima sesión
- El usuario no es técnico. Explicar todo en simple. Decidir por él salvo gustos visuales/identidad y gastos.
- El documento fuente de la idea está en: C:\Users\Raul Valerio\Documents\Z Rentas Inteligentes\Resumen de mi idea para la App Niki.pdf — ya fue leído e incorporado a FICHA-AVATAR.md, no hace falta releerlo salvo para citar textual.
