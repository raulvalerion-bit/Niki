# ESTADO — Niki (AI Image & Outfit Feedback)
Última actualización: 2026-09-17 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: FICHA-AVATAR.md creada y aprobada / Siguiente acción exacta: decidir stack + modelo de monetización + longitud de onboarding, luego construir la landing de ventas (Paso 1 de la secuencia maestra)

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

## Dirección de Arte (Sesión 2 — pendiente)
- FICHA-ARTE.md: NO existe todavía — se crea en la Sesión 2
- ¿Hubo referencia visual del usuario?: NO — se preguntará con opciones concretas en Sesión 2
- Resumen: pendiente
- Personalidad: pendiente (candidatos a explorar: cercano/coach, premium/editorial de moda, motivador sin ser agresivo)

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: existe y aprobada — 2026-09-17 (el copy de venta se DERIVA de ella)
- Resumen: avatar Mateo, 24 años, joven profesional LATAM inseguro de su imagen · dolor #1 "mi ropa se ve rara y nadie me lo dice" · deseo #1 "saber con 100% certeza que me veo impecable" · nivel de consciencia: Consciente del Problema · sofisticación: media-alta (ya rechazó competidores)
- Landing: sigue la ESTRUCTURA CANÓNICA de 10 secciones del 19 — carrusel con placeholders hasta tener seed de datos demo · footer legal: páginas pendientes

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Onboarding-first con preview→paywall (el usuario sube su primera foto en el onboarding, ve un resultado personalizado parcial, y ahí se le presenta el paywall con trial)
- Justificación: app de uso diario/hábito (4-7 veces/semana, no un resultado de una sola vez) con resultado altamente personalizable que vale la pena mostrar antes de pedir pago — patrón validado por Cal AI/Noom para nichos de bienestar personal con onboarding emocional
- Diseño del paywall: resultado personalizado visible (primer "Scan de Presencia"), 2 planes (Básico y VIP Pro), precio con ancla anual, garantía, CTA con beneficio concreto
- Trial: 3 días de acceso completo al plan VIP Pro (definido por el usuario en su investigación) — permite vivir el "aha" de un Scan completo + Modo Alto Impacto antes del primer cobro
- Puente del trial D1-D7: pendiente de diseñar en Sesión 5 (momentos de valor por día)
- Pricing: Básico $8.99/mes · $49.99/año ($4.17/mes) — VIP Pro $14.99/mes · $79.99/año ($6.67/mes)

## Gamificación y retención (Sesión 4-5 — pendiente)
- Loop del hábito: pendiente de documentar en Sesión 4
- Mecánicas candidatas (del propio documento del usuario): racha diaria, "Desafío Glow-Up de 21 días"
- Primera victoria que celebra el onboarding (<60s): sube foto + selecciona ocasión → recibe 3 correcciones concretas + 1 consejo de actitud
- Notificaciones de re-enganche: pendiente

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Landing (siguiente paso)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: pendiente — protagonista: Scan de Presencia (demo del análisis) — CTA primario: "Hacé tu Check de Presencia gratis"
- Onboarding: pendiente — primera decisión: seleccionar ocasión (día de trabajo / cita / entrevista / evento)
- Paywall: pendiente — oferta principal: VIP Pro con trial de 3 días
- Login/Auth: pendiente — motivo de pedir cuenta: guardar historial de scans y desbloquear plan pagado
- App interna: pendiente — secciones candidatas (a confirmar en Sesión 5): Hoy (nuevo scan) / Historial / Hábitos (tracker) / Cuenta-Plan
- Servicios externos: pendiente — GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart
- Regla: si una etapa anterior está pendiente, NO construir la etapa siguiente salvo prototipo marcado como tal.

## Puertas de etapa (aprobación antes de avanzar)
- Landing: no iniciada
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
- Sesión 1 (parcial) — idea recibida y validada por el usuario, FICHA-AVATAR.md completa y aprobada, decisiones de framework/modelo de monetización tomadas — 2026-09-17

## Sesión en progreso 🔧
- Sesión 1 — falta: confirmar longitud de onboarding y mecánicas de gamificación iniciales, luego iniciar construcción de la landing (Paso 1 de la secuencia maestra)

## Próximas sesiones 📋
- Sesión 1 (cont.): landing de ventas completa (10 secciones canónicas) con copy trazado a FICHA-AVATAR.md
- Sesión 2: Dirección de Arte (FICHA-ARTE.md) — preguntar referencia visual al usuario con opciones concretas
- Sesión 3+: onboarding, paywall, login, app interna, servicios externos (según secuencia maestra)

## Problemas conocidos ⚠️
- Ninguno todavía.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguna acción todavía — se le pedirá cuando lleguemos a servicios externos (crear cuentas Hotmart/Supabase/Vercel/Resend, comprar dominio)

## Notas para la próxima sesión
- El usuario no es técnico. Explicar todo en simple. Decidir por él salvo gustos visuales/identidad y gastos.
- El documento fuente de la idea está en: C:\Users\Raul Valerio\Documents\Z Rentas Inteligentes\Resumen de mi idea para la App Niki.pdf — ya fue leído e incorporado a FICHA-AVATAR.md, no hace falta releerlo salvo para citar textual.
