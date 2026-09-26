# ESTADO — Niki (AI Image & Outfit Feedback)
Última actualización: 2026-09-22 | Sesión actual: 1

▶️ CIERRE DE SESIÓN 2026-09-22 — TODO GUARDADO Y SUBIDO (working tree limpio, `git push` al día,
último commit `1abcc6d`). Resumen de lo que se hizo hoy:
1. Cerrado el pendiente de seguridad de las fotos de los Checks (Storage) y un permiso de más en
   `handle_new_user` — ver "Servicios externos" punto 2(d).
2. Construido, probado EN VIVO por el usuario y aprobado el BACKOFFICE completo (6 pantallas en
   `/admin`) — ver sección propia abajo. Incluyó un hallazgo de seguridad real (RLS de `profiles`
   sin `with check`, corregido) y 2 bugs de código (React key duplicada, ícono de Lucide cruzando
   la frontera servidor→cliente sin renderizar) — todo corregido.
3. Conectado y publicado en Vercel — proyecto `niki` con deploy automático confirmado (push → build
   solo). App en línea en https://holaniki.com (antes niki-ad3k.vercel.app, sigue funcionando). Ver "Servicios externos" punto 4 para los
   tropiezos de esta sesión (variables de entorno, proyecto duplicado) y sus lecciones.
4. Corregidos 2 bugs reportados por el usuario probando en el celular: el link "Entrar" de la
   landing apuntaba a un stub viejo (`/entrar`, ya borrado) en vez de `/login`; y el botón
   "Analizar mi presencia" se deshabilitaba en silencio sin explicar qué faltaba (ahora siempre
   responde y avisa). Lección: ningún botón debe quedar deshabilitado sin explicar por qué (Regla
   de UX #11).
5. Retoque de estilo: efecto 3D (borde inferior tipo "labio", se adelgaza al elegir) en los botones
   de ocasión, en las 2 pantallas donde aparecen (onboarding y Check de Presencia).

Siguiente acción al retomar: IA real (BFF) — es la pieza que falta para que el Check de Presencia
dé un resultado de verdad en vez del aviso honesto de "todavía sin conectar". Alcance esperado (ya
conversado con el usuario): elegir/conectar el proveedor de visión, construir el endpoint seguro,
diseñar la pantalla de RESULTADO (no existe todavía) con el anillo de progreso de FICHA-ARTE, y
conectarla al historial. Requiere que el usuario cree una cuenta con el proveedor de IA (costo
pequeño por análisis) — explicárselo simple antes de arrancar.

⚠️ Nota para quien retome: en una sesión anterior el usuario confundió el Tour de la app
(`vista-previa-app.html`, maqueta fija de Sesión 2, ya cerrada) con el Onboarding real
(`app/onboarding/page.tsx`, funcional). Ya resuelto, pero si algo suena a esa maqueta, verificar
primero A CUÁL pantalla real se refiere.

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
- Íconos de marca (2026-09-19): el usuario mandó assets propios (GIF/PNG) para reemplazar
  íconos de librería en momentos clave — se guardan en `public/iconos/`. Aplicados:
  - Onboarding apertura: banner "¡Bienvenidos!" (`banner-bienvenidos.png`) arriba de todo,
    carita (`icono-7-carita-apertura.gif`) bajo el título.
  - Onboarding reconocimiento2 ("¡Vamos avanzando!"): ícono de espera (`icono-4-esperando.gif`,
    el mismo que en Hoy) — reemplazó al ícono Rocket de librería.
  - Onboarding resultado: solo la carita (`carita-resultado.png`) bajo el título — el banner de
    despedida que estaba aquí se movió a Perfil (ver abajo).
  - Hoy (app interna): gema (`icono-3-gema.gif`, tarjeta de gemas) e ícono de espera
    (`icono-4-esperando.gif`, pantalla "procesando").
  - Perfil (app interna): banner de despedida (`banner-despedida.png`, "¡Me complace haberte
    ayudado hoy, te espero pronto!") + carita (`carita-resultado.png`), debajo del enlace
    "Cerrar sesión", sin título.
  Pendientes sin resolver: estrella y corazón que el usuario quería agregar — nunca llegaron
  como archivo (solo se vieron en el chat), quedan pendientes si el usuario los vuelve a mandar.
  Varios GIFs que mandó primero (`icono-1/5/6/8.gif`, `icono-9-carita-resultado.gif`) resultaron
  ser texto animado con marca de agua/frases reveladas letra por letra, no íconos — se
  descartaron (quedan sin usar en `public/iconos/` por si hace falta revisar el motivo). Lección
  para la próxima sesión: si un GIF que manda el usuario se ve como un glifo pequeño y oscuro
  sobre el degradé de la app, verificar SIEMPRE en el navegador en 2 momentos distintos de su
  animación antes de darlo por bueno — puede ser texto revelándose, no un ícono.
- Servicios externos (2026-09-19, en progreso — orden de `SECUENCIA-MAESTRA-CONSTRUCCION.md` §Paso 6):
  1. GitHub: ✅ conectado — repo privado `raulvalerion-bit/Niki`, rama `main`, todo commiteado.
  2. Supabase: ✅ proyecto creado (`yniyllfhoydkdqowiunr`, región Oregon US) + esquema aplicado
     (`supabase/migrations/20260919000000_esquema_inicial.sql`: profiles/checks/habito_registros,
     RLS con el patrón `(select auth.uid())`, trigger que crea el profile al registrarse). Auth
     real conectado: `/login` usa `signInWithOtp`/`verifyOtp` de verdad (antes estaba simulado).
     Las 4 pantallas de la App interna ya leen/escriben datos reales (gemas, historial de checks,
     hábito semanal, correo/plan en Perfil — antes eran placeholders). `middleware.ts` protege
     `/app/*` (redirige a `/login` sin sesión) y saca de `/login` a quien ya está adentro.
     (a) RESUELTO 2026-09-21: se activó SMTP propio con Resend (necesario porque Supabase no deja
     editar el contenido de los correos sin un proveedor de correo propio conectado) y se agregó
     `{{ .Token }}` a las plantillas "Confirm signup" y "Magic Link OTP". Login real probado de
     punta a punta por primera vez: funciona. Hallazgo importante: el código que genera Supabase
     para este proyecto es de **8 dígitos**, no 6 — se ajustó `app/login/page.tsx` (8 casillas,
     copy actualizado) para que coincida; no se puede cambiar la longitud desde el dashboard.
     (b) RESUELTO 2026-09-21: bucket privado `checks-fotos` creado en Storage (carpeta = user_id)
     y `app/app/page.tsx` ya sube la foto de verdad antes de guardar el Check — probado con un
     registro real (ver `supabase/migrations/20260921000000_storage_fotos_checks.sql`).
     (c) RESUELTO 2026-09-21: el onboarding guarda sus respuestas en localStorage al llegar al
     resultado; el login, justo después de verificar el código, las escribe en el profile
     (objetivo/dolor/ocasion_preferida/habito_ritmo) y limpia el localStorage — probado con una
     cuenta real de punta a punta (onboarding → login → profile con los 4 campos llenos).
     (d) RESUELTO 2026-09-22: se volvió a restringir el candado de Storage de `checks-fotos` a
     "cada usuario solo ve/sube las suyas" (`20260922000000_restringir_rls_fotos_checks_por_usuario.sql`).
     Se verificó con una simulación de `auth.uid()` en SQL que la condición carpeta=usuario
     coincide exactamente con la ruta que arma `app/app/page.tsx` — el error de RLS que se vio el
     2026-09-21 no volvió a reproducirse; probablemente fue una sesión no propagada a tiempo, no un
     bug de la política. También se corrigió un hallazgo de la auditoría de seguridad de Supabase:
     la función que crea el profile al registrarse (`handle_new_user`) tenía permiso de ejecución
     público que no hacía falta — se le quitó (`20260922000001_restringir_execute_handle_new_user.sql`),
     el registro de usuarios nuevos sigue funcionando igual. Queda 1 aviso menor sin acción: Supabase
     sugiere activar "protección contra contraseñas filtradas", pero Niki no usa contraseñas (el
     login es con código por correo), así que no aplica.
  3. IA real (BFF): pendiente.
  4. Vercel: ✅ conectado y publicado (2026-09-22) — proyecto `niki` (id
     `prj_4sginvELVjRwcqKRKACly36blcrh`, cuenta `raulvalerion-bit`, sin team) con
     `Connected Git Repository = raulvalerion-bit/Niki`, rama `main`. Deploy automático
     confirmado: un `git push` a `main` disparó un build solo, sin `vercel --prod` manual
     (62-PUBLICACION-SEGURA-Y-CONTINUA.md, gate cumplido). URL en línea (temporal, sin dominio
     propio todavía): https://niki-ad3k.vercel.app — el nombre "ad3k" quedó de un tropiezo al
     crear el proyecto por duplicado (ver abajo), se corrige solo al conectar el dominio real.
     Variables de entorno puestas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
     `SUPABASE_URL` (las 3 las creó el agente por API, valores públicos verificados) y
     `SUPABASE_SECRET_KEY` (la puso el usuario a mano, marcada Sensitive). Quedaron además 6
     variables VACÍAS que Vercel creó solo al importar (léidas de `.env.example`): `AI_MODEL`,
     `ANTHROPIC_API_KEY`, `AI_DAILY_BUDGET_USD`, `RESEND_API_KEY`, `EMAIL_FROM`,
     `HOTMART_HOTTOK` — no rompen nada hoy (ese código no existe todavía); se llenan en las
     sesiones de IA real/Resend real en Vercel/Hotmart.
     ⚠️ Tropiezos de esta sesión (documentados para no repetirlos): (a) al fallar el primer
     intento de importar por un valor mal copiado en `NEXT_PUBLIC_SUPABASE_URL`, el usuario creó
     un SEGUNDO proyecto en vez de corregir el primero → quedaron 2 proyectos duplicados
     (`niki` roto + `niki-ad3k` funcionando); se resolvió borrando el roto y renombrando el bueno
     a `niki` (el nombre corto `niki.vercel.app` no se pudo usar: ya es de otra cuenta, ver
     dominio arriba). (b) el usuario marcó las 4 variables como "Sensitive" (el candado), lo que
     impide releerlas después — cuando `SUPABASE_URL` también quedó mal, hubo que BORRAR Y
     RECREAR las 4 a ciegas porque no se podían inspeccionar; la 2ª vez se dejaron las 3 públicas
     SIN marcar Sensitive a propósito (solo la secreta) para poder depurar si vuelve a fallar.
     Regla para la próxima vez que se toquen variables de Vercel: NUNCA marcar Sensitive las que
     no son secretas.
  5. Resend: ✅ conectado (2026-09-21) — SMTP propio activo en Supabase para el correo de acceso
     (usa el remitente de prueba `onboarding@resend.dev`, que SOLO puede mandar correos a la
     cuenta con la que te registraste en Resend — no a cualquier destinatario; eso se resuelve
     solo verificando un dominio propio, ver punto 6).
  6. Dominio: `holaniki.com` COMPRADO en Namecheap (2026-09-25, US$11.48, privacidad WHOIS gratis activa, auto-renew). Agregado al proyecto Vercel `niki`: apex principal + `www.holaniki.com` redirige 308 al apex. DNS en Namecheap (Advanced DNS): A `@` → 76.76.21.21 · CNAME `www` → cname.vercel-dns.com — ✅ VERIFICADO 2026-09-25: https://holaniki.com responde 200 con SSL, www redirige 308 al apex, deploy con el correo nuevo en línea. Después: actualizar URLs de la app (metadata/sitemap/Supabase Auth redirect URLs), veredictos paywall/onboarding, y webhook Hotmart en `https://holaniki.com/api/hotmart/webhook`.
  7. Hotmart: pendiente.
  Variables de entorno: `.env.example` (commiteado, plantilla) y `.env.local` (real, en
  `.gitignore` — NUNCA se sube). La clave secreta de Supabase que el usuario compartió sin querer
  en el chat el 2026-09-19 se le pidió rotar — no quedó guardada en ningún archivo del proyecto.
- Regla: si una etapa anterior está pendiente, NO construir la etapa siguiente salvo prototipo marcado como tal.

## Backoffice — panel de administración del dueño (2026-09-22, en construcción)
- Alcance acordado con el usuario (plan aprobado antes de construir): 6 pantallas en `/admin` —
  Resumen (avisos automáticos), Ventas (ingresos/ganancia real/costo IA), Usuarios (lista + alta
  manual + cambio de plan), Uso (activación/retención/función principal), Negocio (LTV/CAC/gasto
  por canal) y Salud (errores + estado del webhook). Decisión de alcance explícita: SIN PostHog
  (analítica externa, se evalúa en una sesión futura de `36-ANALITICA-Y-EVENTOS.md`) y SIN inventar
  todavía la tabla de ventas/webhook de Hotmart (`18-VENTA-HOTMART.md` define su esquema propio —
  se construye junto con la conexión real de Hotmart, no antes, para no tener que rehacerla).
- Acceso: columna `profiles.role` ('user'/'admin', default 'user') + función `private.es_admin()`
  (SECURITY DEFINER) usada en las políticas RLS de todas las tablas nuevas. El middleware
  (`lib/supabase/middleware.ts`) exige sesión en `/admin/*`; el layout (`app/admin/layout.tsx`)
  verifica el ROL en el servidor y redirige a `/app` si no es admin — dos capas, ninguna es "ocultar
  el botón" (09-SEGURIDAD). La única cuenta que existe hoy (`raulvalerion@gmail.com`) quedó como
  admin en la migración.
- Tablas nuevas (`supabase/migrations/20260922020000_backoffice_esquema.sql`): `event_log`
  (activación/retención/uso, RLS: inserta el propio usuario, lee solo el admin), `error_log`
  (solo el servidor escribe vía `/api/log-error`, solo el admin lee), `ai_calls` (esquema canónico
  de `31`, vacía hasta que la Sesión de IA empiece a escribir ahí — el backoffice ya sabe leerla),
  `acquisition_spend` (el dueño anota a mano el gasto por canal, 100% admin).
- ⚠️ HALLAZGO DE SEGURIDAD corregido de paso: la política `profiles_update_own` original no tenía
  `with check` (forma "ingenua" que `09-SEGURIDAD.md` prohíbe expresamente) — cualquier usuario
  logueado podía, desde la consola del navegador, escribir CUALQUIER columna de su propia fila,
  incluyendo `plan` (regalarse un plan pagado gratis) y, tras agregar `role` en esta sesión, incluso
  auto-nombrarse admin. Se corrigió con `with check` + GRANT por columna: el navegador (rol
  `authenticated`) ahora SOLO puede escribir `objetivo/dolor/ocasion_preferida/habito_ritmo` (las
  mismas 4 que ya usaba `app/login/page.tsx`); `role`/`plan`/`nombre`/etc. quedan fuera de su
  alcance — solo se tocan desde rutas de servidor con la clave de servicio.
- Alta manual de usuarios: `POST /api/admin/usuarios/crear` (email + nombre + plan opcional) usa
  `supabase.auth.admin.createUser` SIN contraseña (mismo patrón passwordless que Hotmart) — el
  usuario entra después con el código de 8 dígitos por correo, igual que un comprador real. Cambiar
  el plan de alguien ya existente: `PATCH /api/admin/usuarios/[id]/plan`. Ambas rutas verifican
  `private.es_admin()` en el servidor antes de tocar nada.
- Instrumentación mínima de `event_log` (decisión de alcance: sin tocar las 8 pantallas del
  onboarding paso a paso, eso es una sesión de analítica aparte): `app_abierta` y `sesion_iniciada`
  en el primer login exitoso (`app/login/page.tsx`), `onboarding_completado` en ese mismo momento
  (el onboarding es anónimo — sin sesión no se puede escribir en `event_log`, así que se registra
  al login, no en el paso real), y `check_creado` al guardar un Check (`app/app/page.tsx`).
- Error Boundaries nuevos (cerraban un hueco real de la regla de UX #18, "la app nunca muestra
  pantalla blanca" — no existían antes de esta sesión): `app/error.tsx`, `app/app/error.tsx` y
  `app/admin/error.tsx`, todos usando `components/ErrorFallback.tsx` → `POST /api/log-error` →
  tabla `error_log`. Alimentan la sección Salud del backoffice.
- Tokens de diseño agregados a `components/landing/tokens.css` (mismo archivo que tematiza toda la
  app): `--chart-1/-2`, `--chart-positivo/-negativo`, `--border-default`, `--surface-elevated`
  (para los gráficos Recharts del panel, instalado en esta sesión) y `--sunset-1/-2` + `--error`
  (para reemplazar 4 hex sueltos que tenía `app/login/page.tsx` y que el linter de diseño marcó al
  tocar ese archivo — cero cambio visual, mismos colores, ahora como token).
- ⚠️ Pendiente de deuda de diseño (NO de esta sesión, preexistente): el linter de diseño
  (`.claude/hooks/post-edit-diseno.sh`) marca en `app/login/page.tsx` varios tamaños de texto y el
  ancho `max-w-[480px]` como "fuera de la escala 4·8·12·16·24·32·48·64" — son el MISMO patrón ya
  usado (y ya aprobado por el usuario) en onboarding/paywall/app-interna/perfil; no se tocó para no
  arriesgar una regresión visual en una pantalla ya probada de punta a punta. Si se quiere cerrar
  del todo, es una pasada de pulido (`07-PULIDO.md`/`43`) sobre TODA la app a la vez, no archivo por
  archivo.
- Instalado: `recharts` (gráficos del panel, único uso hasta ahora).
- Verificado en esta sesión (2026-09-22): `SUPABASE_SECRET_KEY` configurada por el usuario (paso a
  paso guiado, sin pedir el valor — Protocolo Cero Secretos) · `npx tsc --noEmit` ✓ limpio ·
  `npm run build` ✓ limpio, las 6 rutas de /admin + las 2 rutas de API compilan · `npm run dev`
  arranca sin errores en consola · probado con curl (sin sesión): `GET /admin` y
  `GET /admin/usuarios` → 307 a `/login` (el middleware bloquea) · `POST /api/admin/usuarios/crear`
  → 403 (la ruta rechaza sin admin) · `GET /` sigue en 200 (no se rompió nada existente).
  ✅ VERIFICADO EN VIVO por el usuario (2026-09-22): entró con su cuenta, probó las 6 pantallas,
  reportó un bug real (ver abajo) y pidió un retoque visual — ambos resueltos en la misma sesión.
  El veredicto del revisor-visual NO aplica aquí (el backoffice es una pantalla interna/de
  administración, no una de las 4 pantallas del dinero — Regla de Oro 7); la aprobación directa del
  dueño en vivo es la evidencia de cierre.
- Bug real encontrado y corregido (2026-09-22): dos hallazgos durante la prueba en vivo —
  (a) `React key` duplicada en el gráfico de la sección Uso (el arreglo de 7 días usaba la
  inicial del día — martes y miércoles comparten "M" en español — y la tabla accesible del gráfico
  usaba esa letra como key); se corrigió usando el índice como parte de la key en
  `components/admin/chart.tsx`. (b) Al pulir el diseño se introdujo un bug de React Server
  Components: los íconos de Lucide se pasaban SIN RENDERIZAR (`icon={Users}`) desde páginas
  servidor hacia piezas de cliente (`NavAdmin`, el chip de ícono de `StatCard`) — Next.js lo
  prohíbe (no se pueden pasar funciones/componentes crudos a través de esa frontera). Se corrigió
  renderizando el ícono EN EL SERVIDOR antes de pasarlo (`icon={<Users size={20} />}` en vez de
  `icon={Users}`) en `components/admin/ui.tsx`, `components/admin/nav.tsx` y las 4 páginas que
  usan `StatCard` con ícono — patrón a seguir si se agregan más íconos dinámicos al panel. De
  paso quedaron 2 filas de prueba en `error_log` (mensaje "Link is not defined", de un instante de
  la propia corrección) — se borraron por no tener valor real.
- Retoque visual pedido por el usuario ("se ve plano, dale algo premium") y aplicado: chips de
  ícono con fondo de acento en cada StatCard, borde degradado (`Hairline`, reutilizado del kit de
  landing) en la tarjeta más importante de cada sección, barra de acento junto a cada título de
  sección, fondo del panel con una textura radial sutil, sección activa resaltada en el menú
  lateral (antes no existía), entrada con animación escalonada (`components/admin/reveal.tsx`,
  Motion) en las tarjetas de cada pantalla, y gráficas reales: "Evolución de ingresos" en Ventas
  (vacía hasta Hotmart, ya lista) y "Gasto por canal" en Negocio (con datos reales de
  `acquisition_spend` en cuanto el dueño anota un gasto).

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
- Login/Auth: construida y probada de punta a punta con datos reales (2026-09-21) — sin pasar
  por revisor-visual todavía (pendiente si se quiere el veredicto formal)
- App interna: construida y con datos reales conectados (gemas, checks con foto, hábito, perfil) —
  sin pasar por revisor-visual todavía
- Servicios externos: en progreso, ya no bloqueados — ver detalle en la sección de arriba
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
- Email de soporte: cambiado a "hola@holaniki.com" en el código (2026-09-25). Ese buzón AÚN NO RECIBE correos: falta activar el reenvío gratis de Namecheap (Email Forwarding → Gmail del usuario) y verificar holaniki.com en Resend para enviar desde ahí. Hasta entonces el código de acceso sigue saliendo de onboarding@resend.dev.
- FAQ de la landing: se recortó de 6 a 5 preguntas tras la revisión (gate de carga cognitiva ≤4-5 ítems) — ver docs/copy/landing.md.
- Registro voseo→tuteo: la primera pasada de copy salió en voseo (vos/sabés/tenés) por error — FICHA-AVATAR.md declara tuteo (coherente con México, país del responsable). Ya corregido (2026-09-17) en el copy de la landing y en el stub pendiente de onboarding; audit-conversion.sh confirma 0 hits de voseo tras el ajuste.
- audit-conversion.sh reporta 2 falsos positivos conocidos y verificados manualmente (no requieren cambio de código): (1) "HAIRLINES DEGRADÉ" no detecta el patrón padding-box/border-box porque el kit lo arma con template literals inline en components/landing/ui.tsx (`<Hairline>`), no en un archivo .css parseado ni con un componente llamado "GradientBorder"; se verificó visualmente el borde degradado en el plan recomendado y la garantía (screenshot de esta sesión). (2) "PROFUNDIDAD DE FONDO" no detecta el mesh radial del Hero (components/landing/Hero.tsx) porque el string del gradiente está en la línea siguiente a la palabra "background" dentro del `style={{ }}`, y el script exige ambos en la MISMA línea; se verificó visualmente el degradé sutil detrás del héroe.
- Pendiente (no crítico): el archivo direcciones-abc.html (comparador histórico, ya resuelto — el usuario ya eligió y aprobó la dirección B) tiene un emoji dentro de un COMENTARIO HTML del propio kit-plantilla (no visible al usuario) y ~85% de similitud de DOM entre sus 3 opciones — ambos hallazgos son sobre un artefacto de decisión ya cerrado, no sobre la landing en producción.
- 2 falsos positivos más de audit-conversion.sh, verificados y sin acción necesaria: (1) "VOZ vs FICHA-AVATAR" marca la palabra inglesa "animate" (prop de Framer Motion, `animate={{...}}`) como si fuera un verbo en voseo español — es una coincidencia de patrón, no hay voseo real ahí (confirmado leyendo Faq.tsx:89, Hero.tsx:86, ui.tsx:232: los 3 son la prop `animate` de motion, no una palabra en español). (2) "PRESUPUESTO DE COPY" marca el PS del CTA final (app/page.tsx:198, 43 palabras) contra el límite genérico de párrafo (30 palabras) sin saber que CtaFinal.tsx declara su propio presupuesto de 55 palabras para ese campo (`warnCopy('CtaFinal → PS', psMarked, 55)`) — 43 ≤ 55, cumple.

- Veredicto del paywall: pendiente. El paywall fue aprobado a ojo por el usuario (2026-09-18) pero
  todavía no pasó por el subagente revisor-visual (no existe docs/revisiones/paywall-veredicto.md
  ni docs/revisiones/paywall-375.png). Se pospone a propósito: es una de las 4 pantallas del dinero,
  así que el veredicto formal se corre antes de conectar Hotmart, no antes de continuar con IA real/
  Vercel/dominio.
- Veredicto del onboarding (2026-09-25): a 1 punto de LISTA (35/40·16/20·17/20), pospuesto por presupuesto del usuario. Antes decía NO LISTA
  (última medición: Usabilidad 28/40, Craft 13/20, bajo el umbral 36/40+16/20 — detalle completo en
  "Puertas de etapa" arriba). Se pospone a propósito: el usuario ya vio las 8 capturas y aprobó
  directamente por su cuenta (2026-09-18); re-lanzar el revisor-visual sobre la versión final queda
  como pulido no bloqueante, no antes de Hotmart/IA real.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [x] Nombre/razón social y país del responsable legal — recibido: Raúl Valerio Nebradt, México (ya aplicado en /privacidad y /terminos)
- [x] Configurar `SUPABASE_SECRET_KEY` en `.env.local` — hecho 2026-09-22
- [x] Probar el panel en vivo — hecho 2026-09-22, aprobado por el usuario tras el retoque visual
- [x] Autorizar y conectar Vercel↔GitHub — hecho 2026-09-22, app publicada en https://niki-ad3k.vercel.app
- [ ] Próxima sesión: crear una cuenta con el proveedor de IA elegido (tiene un costo pequeño por
  análisis) — se le pedirá guiado, paso a paso, al empezar la conexión de la IA real
- [ ] Más adelante: crear cuentas Hotmart/Resend, comprar dominio (se le pedirá guiado, paso a paso, en la Sesión de servicios externos)

## Notas para la próxima sesión
- El usuario no es técnico. Explicar todo en simple. Decidir por él salvo gustos visuales/identidad y gastos.
- El documento fuente de la idea está en: C:\Users\Raul Valerio\Documents\Z Rentas Inteligentes\Resumen de mi idea para la App Niki.pdf — ya fue leído e incorporado a FICHA-AVATAR.md, no hace falta releerlo salvo para citar textual.

## Sesión 2026-09-25 (dominio + revisión formal de planes/onboarding)
- Dominio `holaniki.com` comprado (Namecheap) y en línea con SSL — ver "Servicios externos" punto 6.
- Paywall: veredicto revisor-visual LISTA (36/40 · 16/20 · copy 17/20) tras 9 pasadas — docs/revisiones/paywall-veredicto.md.
- Onboarding: 8 pasadas, última medida 35/40 · 16/20 · copy 17/20 (a 1 punto de LISTA); la 9ª pasada quedó corriendo al cerrar.
- Corregido: promesa FALSA "tus fotos nunca se guardan" (landing, FAQ, onboarding, privacidad) → "son privadas, solo tú las ves"; landing mostraba trial en el Mensual (la prueba es solo Anual); voseo en páginas legales.
- Pendiente para Hotmart: configurar garantía de 7 días en el panel y recién ahí publicar el plazo; webhook en https://holaniki.com/api/hotmart/webhook (por construir).
