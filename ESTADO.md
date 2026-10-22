# ESTADO — Niki (AI Image & Outfit Feedback)
Última actualización: 2026-10-22 — SEGURIDAD: cerrado el abuso del formulario de login. Al revisar
Supabase buscando el "primer registro real" que el dueño creyó ver desde TikTok, se encontraron 22
cuentas creadas en la última semana (de 23 totales, sin contar la del dueño) con `objetivo IS NULL`
(ninguna completó el onboarding), cero eventos en event_log, y correos sin sentido para el nicho
(empresas como Intel/un despacho legal, Gmail con puntos insertados al azar, hasta una pasarela
SMS→correo `@vtext.com`) — patrón de un bot usando el formulario de "entrar con tu correo" para
disparar `signInWithOtp({shouldCreateUser:true})` con una lista de direcciones al azar (esa llamada
crea la fila en `auth.users` — y el profile — apenas se PIDE el código, sin verificarlo nunca).
Riesgo real: Resend manda un correo "tu código es…" a gente que nunca lo pidió; si lo marcan spam,
daña la reputación del dominio de envío y puede tirar a spam los correos importantes de verdad
(bienvenida, cobro fallido, recibos). CORREGIDO: `supabase/migrations/20261022000000_rate_limit_otp.sql`
(tabla `rate_limit_otp` + función `solicitar_otp_permitido`, solo `service_role`, máx 5 solicitudes
por IP cada 15 min) + nueva ruta `app/api/auth/solicitar-codigo` (valida con la función antes de
llamar a `signInWithOtp`) + `app/login/page.tsx` ya NO llama a Supabase directo desde el navegador,
pasa por esa ruta. Probado en real: 5 solicitudes seguidas OK, la 6ª bloqueada (429), datos de
prueba borrados. `tsc` + `npm run build` limpios. Pendiente de decidir: ¿purgar las 22 cuentas
fantasma de `profiles`/`auth.users`? (no hacen daño por sí solas, pero ensucian cualquier métrica
futura de registros — preguntar al dueño antes de borrar cuentas, aunque sean basura, por si acaso).

Última actualización anterior (2026-10-21) — revisión rápida del panel de TikTok semana 3 (dueño): el video
"Entrevista de trabajo, parte 2" (18-oct) mostraba 0 vistas y no aparecía al revisar desde el
propio celular del dueño — se sospechó restricción/revisión de TikTok. DESCARTADO: una tercera
persona ajena a la cuenta buscó el perfil y SÍ pudo ver y darle like al video — confirma que es
público y visible, las 0 vistas fueron solo floja distribución del algoritmo ese día, no un bug ni
un bloqueo. El video del 17-oct ("Cómo verte con seguridad en una reunión") es el mejor de la
semana con 244 vistas. Dueño también confirmó que ya subió la historia de IG pendiente del cierre
anterior.

Última actualización anterior: 2026-10-20 (cierre de sesión) — Sesión larga, todo publicado (producción =
1269497): (1) guardado de lo acumulado del 17-oct; (2) pulido de Hoy/Progreso, aprobado por el
dueño; (3) re-certificación a 88/100 — APTO para tráfico pagado; (4) /velocidad contra producción
real (favicon corregido y aligerado; se probó inlinear el CSS, empeoró todo, se revirtió el mismo
día); (5) /adquisicion: etapa confirmada en 0 clientes — se prioriza afiliados + orgánico sobre
paid; programa de afiliados de Hotmart ACTIVADO Y COMPLETO (comisión 30%+20%, Marketplace, kit de
materiales subido); (6) semana 3 de contenido armada y PUBLICADA el mismo día (carrusel "5 señales
de buena impresión" + el video de cena pendiente de semana 2) en TikTok+IG+FB — falta solo que el
dueño suba la historia de Instagram con el link (en curso al cerrar la sesión).

▶️ CIERRE DE SESIÓN 2026-10-20 — todo guardado y publicado, nada pendiente de mi lado. Lo único
que queda abierto es que el dueño suba la historia de IG del carrusel de hoy (sticker de enlace
`?src=ig_impresion`) — tarea suya, no bloquea nada. Siguiente sesión: revisar si subió la historia,
seguir con el calendario de semana 3 (vie 23 video postura, dom 25 video búsqueda, mar 27 video
amigos), y vigilar Panel → Ventas / Supabase por si ya hay la primera señal de tráfico real.

Resumen de la sesión de hoy: al retomar, la re-certificación del 2026-10-17 (84/100, APTA para
tráfico pagado) seguía SIN GUARDAR NI PUBLICAR (solo en disco). El dueño pidió pulir Hoy y Progreso
(las 2 pantallas de la app interna que seguían NO LISTA desde el certificado) antes de guardar todo
junto. Se hizo:

- **Hoy** (pantalla principal/M0): 4 rondas de corrección + revisor-visual sobre el código real.
  Arrancó en 32/40·16/20 (16-oct). Se resolvió el defecto de jerarquía pendiente desde el 16-oct
  (la tarjeta "Pendiente" y "Misión de la semana" competían sin jerarquía clara — ahora Misión va
  primero con meta+gemas+CTA propio, y el resumen del último Check bajó a un tratamiento "hundido"
  de recapitulación, el mismo patrón que ya usa paywall), más 7 defectos menores encontrados en el
  camino (grids duplicados, bordes inconsistentes, toggle sin affordance, tamaños/pesos de título
  desalineados entre las 3 tarjetas apiladas, ícono de Misión 4px más grande que el resto).
  ESTADO FINAL: **35/40 · 19/20 · NO LISTA** (craft pasa con holgura; usabilidad se quedó 4 rondas
  seguidas a 1 punto del gate de 36, cada vez por un defecto nuevo y más leve — el propio revisor
  señaló que seguir invirtiendo pasadas por 1 punto ya no es un fix puntual, es el mismo patrón de
  "pulido acumulado" que onboarding). Captura: docs/revisiones/hoy-375.png (+ detalle de las 4
  rondas en docs/revisiones/repaso-2026-10-20/hoy-v1..v4-375-*.png). Veredicto:
  docs/revisiones/hoy-veredicto.md.
- **Progreso** ("Tu Ruta de Presencia"): al revisar el código, los 5 defectos del veredicto viejo
  (2026-10-04, 29/40·14/20) ya estaban resueltos de una sesión anterior sin re-certificar. El
  revisor-visual encontró 5 defectos NUEVOS (lista de Checks sin filtro ni tope — regla UX #14,
  demasiados tamaños de texto, celebración sin motion, chips de filtro sin techo de carga cognitiva,
  tamaño táctil). Se corrigieron en 3 rondas: filtro por ocasión (solo las que el usuario realmente
  usó, ordenadas por frecuencia, con techo de 3 + "Otras" y corte de lista a 15 + "ver más"),
  consolidación de tamaños de texto, motion real en la celebración del resumen mensual, chips a
  44px. ESTADO FINAL: **29/40 · 15/20 · NO LISTA** (mejora real desde 28/40·15/20, pero lejos del
  gate — el mismo patrón: heurísticas estancadas en "bien" sin un bug puntual que las explique).
  Defecto real que quedó sin resolver a propósito (fuera de alcance de hoy): la lista "Tus meses con
  Niki" no tiene el mismo tope que ya se aplicó a "Tus Checks" — se romperá igual con 6+ meses de
  uso; corregir con el mismo patrón cuando se retome esta pantalla. Captura:
  docs/revisiones/progreso-375.png. Veredicto: docs/revisiones/progreso-veredicto.md.

✅ Ninguna de las dos cruzó el gate automático del revisor (≥36/40 y ≥16/20), pero el dueño VIO las
capturas (docs/revisiones/{hoy,progreso}-375.png) y las APROBÓ DIRECTAMENTE 2026-10-20 ("ya las vi,
las encontré bien") — mismo criterio ya usado con el onboarding el 2026-09-18 y el 2026-10-17: se
prioriza la aprobación directa del dueño sobre el puntaje automático del revisor-visual.

Tras esa aprobación, se resolvieron los 2 pendientes reales que habían quedado fuera de alcance:
- **Hoy**: la mascota Niki (aprobada en FICHA-ARTE.md) apareció, arriba del título, con la misma
  animación de entrada (spring) que ya usa onboarding — `niki-feliz.webp`, sin usar todavía en
  ningún otro punto de la app.
- **Progreso**: "Tus meses con Niki" ahora tiene el mismo tope que ya tenía "Tus Checks" (techo de
  4 meses + botón "ver los N restantes") — ya no se rompe con 6+ meses de uso.
Ajustes menores post-aprobación, verificados con `tsc`+build+capturas pero SIN una 5ª/4ª pasada del
revisor (ya había aprobación directa del dueño, no se justificaba el costo de otra pasada completa).

Se corrió `tsc`, `npm run build` y `npm run test` (62/62) limpios después de cada ronda. Se guardó
(commit) y publicó todo lo acumulado desde el 17-oct (API de conversiones de Hotmart, 3 correcciones
de landing/onboarding/paywall) junto con el pulido de Hoy/Progreso y estos 2 últimos ajustes — ver
los commits del 2026-10-20 en el historial de git para el detalle exacto de archivos.

Última actualización anterior (2026-10-16, tarde) — PUNTOS 2 Y 3 DEL PLAN DEL VIERNES: (2) ✅ el dueño
apagó "Coincidencia avanzada automática" en Meta (ya estaba apagada de una sesión anterior,
confirmado). (3) ✅ API de conversiones de Hotmart (CAPI) CONECTADA Y VERIFICADA — el dueño generó
el token en Meta (Administrador de eventos → píxel …098022 → Configuración → API de conversiones →
"Configurar sin Dataset Quality API" → Generar token de acceso) y lo pegó en Hotmart (Herramientas
→ Píxeles de rastreo → Facebook+Instagram → Detalles de la configuración), verificado con palomita
verde. ✅ Compra de prueba real hecha (plan Mensual, $14.99, checkout
`pay.hotmart.com/G107766783O?off=f7q8q4tt`) y YA REEMBOLSADA desde Hotmart — webhook de Niki
respondió 200/procesado, confirmado en la app: Perfil → "Aún no tienes un plan activo" (el acceso
de la cuenta del dueño a /app NO se corta nunca pese al reembolso porque es la cuenta `role=admin`,
que siempre entra — comportamiento esperado, no es bug, ver `lib/acceso.ts:16`). ⚠️ PENDIENTE DE
VERIFICAR: en Meta (Administrador de eventos → píxel → Resumen → "Últimos 7 días") SÍ llegaron
`ViewContent` e `InitiateCheckout` por la API de conversiones (confirma que el envío automático
funciona), pero el evento **"Compra"/"Purchase"** de esta transacción TODAVÍA NO aparecía ~40 min
después de la compra — sin error visible en Diagnóstico. Según la investigación (sin documentación
oficial de Hotmart sobre el tiempo exacto), este tipo de aviso servidor-a-servidor puede tardar
varias horas en plataformas similares. Revisar de nuevo más tarde hoy o mañana: Administrador de
eventos → píxel …098022 → Resumen → "Últimos 7 días" → buscar "Compra". Si sigue sin aparecer
después de varias horas, ahí sí investigar más a fondo (podría ser un paso de Hotmart sin completar,
no algo de nuestro código — el webhook propio de Niki SÍ funcionó, es un sistema aparte del de
Meta). El punto 4 (re-certificar) se deja para cuando se confirme esto, o para la próxima sesión.

Última actualización anterior (misma fecha, antes): PUNTO 1 DEL PLAN DEL VIERNES CERRADO: revisor-visual de landing,
onboarding, paywall y Hoy (las 4 pantallas del dinero) corrido de cero sobre el código real, con 2
rondas de corrección y re-publicación (commits ec364f0, 261358e, 358ae1e, 87e4f36 — todos en
producción, tsc+vitest 62/62 limpios en cada ronda). Resultado por pantalla (detalle completo y
veredictos vigentes en "Puertas de etapa"): Onboarding y Paywall quedaron LISTA al cierre del día
(paywall 36/40·16/20·18/20 sin re-revisar tras la 2ª ronda por ser cambios menores ya cubiertos;
onboarding con 5 defectos reales corregidos — letrero singular con tokens de FICHA-ARTE, lema que
se repetía en cada paso, aire muerto en 2 pasos, botones táctiles a 48px, bug del check final del
loading — pendiente de una 3ª pasada formal del revisor si se quiere el número exacto, pero las
capturas ya no muestran los defectos señalados). Landing y Hoy quedan NO LISTA con defectos
puntuales documentados abajo (no se agotó el ciclo completo de corrección-re-revisión en esas 2 por
presupuesto de tokens del día — ver "Problemas conocidos"). Puntos 2-4 del plan (apagar
Coincidencia avanzada del píxel, API de conversiones de Hotmart + compra de prueba, re-certificar)
siguen pendientes, a decidir si se retoman hoy mismo o quedan para la próxima sesión.

Última actualización anterior: 2026-10-15 (pre-lanzamiento) — ▶️ PLAN PARA MAÑANA VIE 16 (acordado con el dueño, sesión larga, dejar lo más posible listo para anuncios): (1) revisor-visual de la landing + re-revisión de onboarding, paywall y Hoy (cerrar veredictos pospuestos; corregir defectos y re-pasar); (2) dueño apaga Coincidencia avanzada automática del píxel; (3) API de conversiones de Hotmart (token lo pega el dueño directo en Hotmart) + compra de prueba con reembolso → ver Purchase en Meta; (4) re-certificar. HOY 15 entre 9-10 pm: dueño fija comentario en TikTok + historia IG con enlace ?src=ig_cita. Sáb 17 7 pm: video reunión. ✅ 15-oct: correo de cobro fallido verificado en real + cuenta del dueño restaurada · /velocidad hecho (ver VELOCIDAD en Problemas conocidos) + bug del login con la letra "s" corregido. Carrusel de la cita: ✅ PROGRAMADO por el dueño para hoy 19:00 en TikTok + IG + FB (confirmado 15-oct 11:00) (TikTok Studio + Meta Business Suite) por reunión a esa hora; comentario fijado en TikTok e historia IG con enlace los hace a mano entre 9 y 10 pm. ▶️ PLAN PARA MAÑANA JUE 15 (acordado con el dueño): (1) confirmar que llegó el correo de cobro fallido (~11 am México) → restaurar la cuenta del dueño y limpiar sus eventos de prueba (ver punto ⚠️ PRUEBA EN CURSO abajo); (2) /velocidad (medir → mejorar → medir); (3) re-certificar con /pre-lanzamiento y repasar PILARES-DEL-EXITO.md para decidir qué más es importante para avanzar (meta: ≥80 → anuncios); (4) 7 pm: el dueño publica el carrusel de la cita. ▶️ PLAN PARA MAÑANA MIÉ 14 (acordado con el dueño al cerrar el 13-oct): (1) ✅ 14-oct: Meta marcó "Configurar píxel" con palomita (holaniki.com ya envía datos); dueño agregó a Permisos de tráfico (lista de autorizados) holaniki.com + pay.hotmart.com + hotmart.com (sin captura, confirmado por el dueño). "Configurar eventos" (50%) se deja así a propósito: la herramienta de eventos de Meta reactivaría la lectura automática de la página. (2) ✅ DUNNING CONSTRUIDO Y PUBLICADO 14-oct (commit 6338dc7): migración dunning (profiles.past_due_desde, dunning_paso, pago_metodo + trigger dunning_marcar → event_log dunning_inicio/dunning_recuperado/dunning_perdido), cron diario /api/cron/dunning 17:00 UTC (4 correos días 1/3/5/7, versión tarjeta vs ficha en efectivo, event_log dunning_correo), aviso no bloqueante en /app (components/app/AvisoCobro.tsx, captura docs/revisiones/aviso-cobro-375.png, sin revisor: componente secundario), gracia de atraso 5→8 días (lib/dunning.ts). Probado: 9 pruebas nuevas (55 en total), trigger inicio+recuperación en BD real, correos previsualizados. ✅ PRUEBA TERMINADA 15-oct: correo 1 real (tarjeta) salió 17:00:48 UTC y llegó al Gmail del dueño; cuenta RESTAURADA y eventos de prueba borrados (lo corrió el dueño en el SQL Editor; verificado: refunded/ninguno/past_due_desde null/dunning_paso 0, 0 eventos 14-15 oct). Historial: la cuenta del dueño (42eb8558…) está en past_due A PROPÓSITO para que el cron de producción le mande el correo 1 real el 15-oct ~11:00 México; DESPUÉS RESTAURAR a suscripcion_estado=refunded, plan=ninguno, plan_activo_hasta=2026-09-29 03:36:58.562483+00, pago_metodo=null (y borrar de event_log los eventos de prueba del dueño del 14-15 oct: dunning_*, prueba_*, bienvenida_pro_vista). Churn base: 0 clientes reales, sin datos (hipótesis: involuntario domina en LATAM). Capas pendientes: cancelación retentiva, win-back 30/60/90, aviso pre-renovación anual. (3) ✅ PUENTE DE LA PRUEBA CONSTRUIDO Y PUBLICADO 14-oct (f42a40c): mapa de 3 días — D1 primer Check + correo "Nadie te dice por pena si tu outfit funciona. Niki sí." si a las ≥18 h no hizo ningún Check (cron aviso-prueba, columna aviso_reenganche_at, event prueba_reenganche_correo) · D2 aviso pre-cobro por correo (ya existía) + panel in-app · D3 cobro → tarjeta "¡Ya eres VIP Pro!" 7 días tras first_paid_at, una vez (localStorage). Etiqueta neutra "Día X de 3 de tu prueba gratis" en Hoy (components/app/EstadoPlan.tsx) → panel con lo construido (Checks, mejor puntaje, racha), lo que incluye VIP Pro, fecha+monto exactos ($59.99 USD) y "Cancelar mi prueba en Hotmart" en 1 toque. Eventos: prueba_panel_abierto, prueba_cancelar_click, bienvenida_pro_vista. Constantes únicas en lib/prueba.ts (DIAS_PRUEBA, PRECIO_ANUAL). Capturas docs/revisiones/prueba-dia-375(-panel).png y bienvenida-pro-375.png (sin revisor: componentes secundarios dentro de Hoy). 60 pruebas OK. Siguiente: /velocidad, luego re-certificar /pre-lanzamiento.  Jue 15 7 pm: carrusel de la cita (contenido/semana-02/COMO-SUBIRLO.md). ✅ Video 3 PUBLICADO 2026-10-13 en TikTok + IG/FB (reel), confirmado por el dueño. REVISIÓN SEMANA 1 (2026-10-13): TikTok vistas — carrusel "5 errores que arruinan tu entrevista" 546 (GANADOR, 5x), Video 2 110, aviso 6-oct 119, aviso 5-oct 94, Video 1 83, aviso 7-oct 83. Vercel 7 días: 7 visitantes, 14 vistas, rebote 86%; referrers m.facebook 2, facebook 1, l.instagram 1, TikTok 0 (sin enlace tocable); 1 onboarding; 0 visitas desde 10-oct pese al carrusel; 0 registros, 0 pruebas, 0 ventas (Supabase). Facebook (15-sep→12-oct): 174 visualizaciones (92.5% no seguidores), 119 espectadores, 10 reproducciones de 3 s, 1 seguidor, 3 visitas a la Página, 0 conversaciones — FB manda menos vistas pero la mejor proporción vista→visita a holaniki (3 de ~174). Instagram (15-sep→12-oct): 63 visualizaciones, ALCANCE 5 personas (2 seguidores + 3 no), 66.7% de vistas de seguidores, 5 interacciones todas de seguidores — IG casi NO reparte el contenido a gente nueva (FB y TikTok sí); CAUSA HALLADA 2026-10-13: Estado de la cuenta IG → advertencia "Presencia establecida" (cuenta nueva aún sin historial suficiente para recomendarse a no seguidores; lo demás en verde). No es castigo: se resuelve con constancia (publicar seguido, perfil completo, seguidores reales, interacciones). Hasta entonces IG = canal para seguidores + historias con enlace; el alcance nuevo viene de TikTok y FB. Conclusión: el tema concreto (entrevista) + formato para guardar gana; el cuello de botella es el PUENTE contenido→página (TikTok no manda visitas). Semana 2: situaciones concretas en formato guardable + holaniki.com grande en la última lámina + comentario fijado en TikTok + historia IG con enlace por pieza. ✅ SEMANA 2 ARMADA 2026-10-13 → contenido/semana-02/COMO-SUBIRLO.md (textos, horarios, enlaces): Jue 15 carrusel "5 errores en tu primera cita" (src ig_cita) · Sáb 17 VIDEO-SAB17-reunion-LISTO.mp4 30 s (ig_reunion) · Dom 18 carrusel "Tu postura habla antes que tú" entrevista parte 2 (ig_entrevista2) · Mar 20 VIDEO-MAR20-cena-LISTO.mp4 30 s (ig_cena); todo 7 pm; cada pieza con holaniki.com grande + comentario fijado TikTok + historia IG con sticker de enlace propio; la voz dice "holaniki punto com" (TikTok sin enlace). Experimento: ¿pesa el TEMA o el FORMATO? Fuentes: carruseles.html, videos.html; exportar con scripts/exportar-piezas.mjs. Voz: msedge-tts 2.0.9 dejó de conectar el 13-oct (403) → parche local en carpeta temporal: endpoint wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1 con Ocp-Apim-Subscription-Key (lo que trae 2.1.0, publicada ese mismo día; no instalada por ser recién salida). Racha de cadencia: 1 semana cumplida. Siguiente: el dueño publica la semana 2; revisión el Mar 20. ✅ PÍXEL DE META CONECTADO Y PUBLICADO 2026-10-13 (ID 1634146378098022, creado por el dueño): lib/pixel.ts + components/AvisoCookies.tsx (Aceptar/Rechazar con el mismo peso; decisión en localStorage niki_cookies v1) — solo en /, /onboarding y /paywall y SOLO tras Aceptar; eventos PageView, OnboardingInicio (custom), ViewContent (resultado), InitiateCheckout (clic a Hotmart); autoConfig=false (sin coincidencia automática: el píxel tomaba hola@holaniki.com del pie); CSP abre connect.facebook.net + www.facebook.com; privacidad v3 (sección Cookies + botón para cambiar la decisión). Verificado en producción con scripts/prueba-pixel.mjs (9/9 OK; Meta descarta navegadores automáticos → la prueba simula un celular). Pendiente del píxel: (a) dueño apaga "Coincidencia avanzada automática" en Administrador de eventos → Configuración; (b) ✅ píxel CONECTADO EN HOTMART 2026-10-13 (Herramientas → Píxel de rastreo → Facebook+Instagram, "Evento vía Web" Configurado, ID 1634146378098022, checkout 8595742); falta: API de conversiones de Hotmart (token secreto: el dueño lo pega directo en Hotmart) + compra de prueba con reembolso para ver Purchase en Meta → ambos JUSTO ANTES del primer anuncio (gate del 34). Dueño revisa mañana Resumen del píxel con fechas que incluyan 13-oct (Probar eventos no mostró nada en su Chrome; desde aquí Meta respondió 200 al PageView en producción). Luego subir 73→80. ✅ Video 3 ARMADO 2026-10-11 → contenido/semana-01/video-3/VIDEO-3-LISTO.mp4 (30 s, voz Dalia alegre, escenas en escenas.html; subir Mar 13 según COMO-SUBIRLO.md). Dom 11: carrusel SUBIDO a IG+FB 2026-10-11 desde Business Suite (sin música: en la laptop solo TikTok deja poner música a fotos; está bien así). ✅ Carrusel en TikTok (fotos + música) y ✅ nombre TikTok cambiado a "Niki - Check de Presencia" 2026-10-11. Plan acordado con el dueño 2026-10-11 para el MARTES 13: (a) subir Video 3, (b) revisión semana 1, (c) píxel de Meta (el dueño lo crea en Meta, yo lo conecto + aviso de cookies), (d) empezar a subir de 73→80: dunning, puente D1-D7 de la prueba, velocidad. Tiendas de apps: NO por ahora (comisión 15-30% + pago dentro de la tienda en vez de Hotmart; revisar cuando haya ventas). Antes: revisión de la semana 1 (vistas y visitas al perfil por video → ganador define semana 2). ✅ Video 2 ARMADO EN LA LAPTOP 2026-10-10 (el dueño prefiere laptop: el celular le complica) → contenido/semana-01/video-2/VIDEO-2-LISTO.mp4, 25 s con voz neural es-MX-DaliaNeural ALEGRE (rate +14%, pitch +7%, exclamaciones — elegida por el dueño sobre Paloma/Salomé) (msedge-tts + ffmpeg-static vía npm en carpeta temporal, sin tocar el proyecto); ✅ PUBLICADO en TikTok 2026-10-10 (desde la laptop); ✅ IG+FB compartido 2026-10-10 como REEL en Meta Business Suite (OJO: "Crear publicación" rechaza el 9:16 por relación de aspecto — siempre "Crear reel"; nunca recortar). Siguiente: carrusel Dom 11 + cambiar nombre TikTok. Desde ahora: videos se arman así, ya listos. ✅ Día 3 del aviso COMPLETO 2026-10-07 (publicación programada IG+FB + historia IG con enlace + TikTok foto, confirmado por el dueño 2026-10-08). ✅ Video 1 PUBLICADO en TikTok 2026-10-08 ~21:00 (6 escenas en contenido/semana-01/video-1, armado en CapCut web, SIN voz — el TTS de CapCut web no cargó la lista de voces; música en tendencia elegida en la app; desde el Video 2 probar voz en CapCut del celular; entrar por el + central, NO el + de la foto de perfil = modo historia). ✅ IG Reel publicado 2026-10-08 (etiqueta IA NO: mascota caricatura + capturas, no realista). Verificar que salió también en FB. Semana-01: calendario Jue 8 Video 1 · Sáb 10 Video 2 (escenas LISTAS en contenido/semana-01/video-2 + COMO-ARMARLO.md, con voz en CapCut del celular) · Dom 11 carrusel · Mar 13 Video 3 (todo en IG+FB Reels y TikTok). ✅ Enlace de bio IG puesto 2026-10-08 (estaba VACÍO): https://holaniki.com/?src=ig, título "Pruébame 3 días gratis" (IG exige https://; editar enlaces solo desde el celular). Categoría IG: se QUEDA cuenta Creador + "Creador digital" (decisión 2026-10-08: cuenta Empresa pierde la música popular en Reels; la categoría es cosmética). FB 2026-10-08: categoría "Producto/servicio" (se queda), botón de acción con https://holaniki.com/?src=fb ✅, emoji roto de la presentación quitado ✅, portada subida ✅ (contenido/portada/portada-facebook.png, 1640x624). TikTok 2026-10-08: cuenta PERSONAL (decisión: conservar música popular); sin enlace tocable hasta 1,000 seguidores → bio con texto "👉 holaniki.com" (≤80 letras); las visitas de TikTok llegarán sin ?src (directas). Nombre de TikTok cambiado a "Niki - Check de Presencia" ✅ 2026-10-11. Al llegar a 1,000 seguidores: poner enlace https://holaniki.com/?src=tiktok | Re-certificación: **73/100 → NO APTO para tráfico PAGADO** (sube de 57; ver "Certificado /100" en Puertas de etapa). Producción = `461f48e`. Hecho hoy: Next 16.3.5→16.4.0 (falla CRÍTICA RCE en next/og) + 0 vulnerabilidades, 404 con marca, kill-switch de IA (`AI_DAILY_BUDGET_USD=0`), índice FK error_log, onboarding y paywall re-revisados → LISTA 36/40·16/20 ambos (2 pasadas), medición anónima del embudo (Vercel Web Analytics + eventos onboarding_inicio / onboarding_resultado / paywall_pago_click — Analytics ACTIVADO por el dueño en Vercel 2026-10-06), auto-QA del embudo en producción (scripts/qa-funnel.mjs). Siguiente: (1) ✅ Web Analytics activado; (1b) ✅ Día 2 TikTok PUBLICADO 2026-10-06 (desde la laptop, foto + melodía, título "Mañana llego para ayudarte 🧡"); historia IG Día 2 con encuesta ✅ PUBLICADA. (2) ✅ Día 3 PROGRAMADO en Business Suite IG+FB (miércoles 7-oct 7 pm, confirmado por el dueño 2026-10-06); a mano el miércoles 7 pm: historia IG con sticker Enlace holaniki.com/?src=ig (texto "Pruébalo gratis") + TikTok foto. Día 3 ("¡Ya llegué!") — CLAIM CORREGIDO 2026-10-06: "Haz tu Check gratis" → "Pruébalo 3 días gratis" (el Check exige iniciar la prueba con tarjeta en Hotmart); también en semana-01 (carrusel lámina 7 + 3 guiones). Re-exportar piezas: node scripts/exportar-aviso.mjs <ids> (IG+FB Business Suite + TikTok a mano); (3) dueño cambia categoría en IG (Editar perfil → Categoría; si no aparece: cuenta de Empresa), FB (Información → Categorías) y TikTok (app → Configuración → Cuenta → Cuenta de empresa → Categoría) — guía dada 2026-10-06; el dueño NO lo encontró → pedirle captura de Editar perfil (IG) y de la Página (FB); (4) jueves 8: semana 1 de contenido; (5) para llegar a ≥80 antes de ads: /retener-ingresos (dunning), puente D1-D7 de la prueba (02C), /velocidad (LCP).

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
  ⚠️ DESACTUALIZADO, NO ES EL PRECIO VIGENTE: el Anual bajó a $59.99/año ($4.99/mes efectivo) el
  2026-10-04 (ver nota "PRECIO ANUAL $59.99 PUBLICADO" en Problemas conocidos) — el código del
  paywall y la landing son la fuente de verdad real, este párrafo quedó sin actualizar. Corregido
  al notarlo 2026-10-17 durante la certificación /pre-lanzamiento.
- LÍMITE DE USO DE IA (aprobado por el usuario 2026-09-28): 3 Checks de Presencia AL DÍA por
  persona (se renuevan a medianoche hora del usuario), igual en prueba y en pago. Fórmula del cupo
  (02C), con el precio REAL vigente: $4.99 (plan más barato real) × 20% = $1.00/mes ÷ $0.0101 por
  análisis (medido con llamadas reales, 2026-09-28) ≈ 99/mes ≈ 3/día — sigue cumpliendo el cupo de
  3/día con el precio actual, aunque con menos margen que con el $8.99 original (el heavy-user-tope
  de 90/mes representa ≈18.2% del plan, cerca del límite de 20%, no holgado).
  Tope global de gasto diario (AI_DAILY_BUDGET_USD) arranca en ~$5. Al llegar al tope: mensaje
  cálido ("Ya hiciste tus 3 Checks de hoy, mañana tienes 3 nuevos"), nunca un error. El límite se
  valida EN SERVIDOR en el endpoint de IA (por construir). Copy "ilimitado" reemplazado en landing,
  paywall y docs/copy/landing.md por "3 Checks de Presencia al día" (commit 7bc589c).
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
  3. IA real (BFF): ✅ CONECTADA Y PUBLICADA (2026-09-28). Clave de Anthropic puesta por el usuario
     en .env.local y Vercel (Sensitive); la clave NO está asignada a un workspace → se manda el header
     con ANTHROPIC_WORKSPACE_ID=wrkspc_014axPkBKU2Go7jtQFsWxA7s (no secreto, en .env.local y Vercel).
     Probado en real: llamada OK en 5.4 s, US$0.0065 con imagen chica (foto sin persona → sin_persona).
     Local: la red del usuario intercepta TLS → para probar con Node usar NODE_OPTIONS=--use-system-ca.
     Decisiones técnicas: síncrono (1 foto → JSON, ~5-15 s, maxDuration 60) · modelo AI_MODEL=
     claude-sonnet-5 (thinking off, max_tokens 1024, salida estructurada zod) · foto achicada en el
     celular a 1280px JPEG → Storage → /api/check la descarga con la clave de servicio · RPC
     `reservar_check` (límite 3/día por fecha local con zona horaria fijada en profiles.zona_horaria,
     máx 6 intentos/día, tope global día/mes con reserva de $0.05 en ai_calls bajo advisory lock) y
     `finalizar_check` (liquida costo real, +1 gema) — solo service_role · se quitaron las políticas
     insert/update de `checks` (el usuario ya no puede escribirse su resultado) · foto inválida o
     error de IA NO descuentan Check · tope alcanzado → email a admins 1 vez/día · Vercel:
     AI_MODEL/AI_DAILY_BUDGET_USD=5 (sensitive, heredadas) + AI_MONTHLY_BUDGET_USD=50.
     Pantallas: resultado (components/app/ResultadoCheck.tsx, captura docs/revisiones/resultado-check-375.png
     con datos semilla), estados analizando/límite/error en app/app/page.tsx, detalle
     app/app/historial/[id], transición entre pestañas app/app/template.tsx. revisor-visual resultado:
     LISTA 37/40 · 16/20 (6 pasadas) → docs/revisiones/resultado-check-veredicto.md. ✅ Probado por el usuario con
     su foto real en el celular (2026-09-28): funcionó, consejo de postura útil. COSTO REAL MEDIDO:
     US$0.0101 por análisis (3855 tokens entrada / 240 salida, 5.7 s) → la mitad de lo estimado; con
     la fórmula del cupo daría hasta ~5/día ($1.80 ÷ 0.0101 ≈ 178/mes). Se mantiene 3/día hasta que el
     usuario decida. Pendiente: definir para qué sirven las gemas (el chip solo dice cuántas lleva).
     Sin fallback a otro proveedor (degradación = mensaje amable); anotar para después.
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
  7. Hotmart: ✅ CONECTADO Y PROBADO CON COMPRA REAL (2026-09-27). Producto `niki` id 8595742, checkout https://pay.hotmart.com/G107766783O con `off=foybda2j` (Anual) / `off=f7q8q4tt` (Mensual) — sin `off` Hotmart abre el Mensual. Anual: "Momento de cobro" corregido a GRATUITO (estaba en "Período de prueba"). Planes: Mensual $14.99 SIN prueba (se le quitó la prueba de 3 días que tenía) · Anual $107.88 con 3 días gratis · garantía 7 días (7 > 3, regla dura OK). Webhook v2.0.0 → https://holaniki.com/api/hotmart/webhook (ya registrado en Hotmart). HOTMART_HOTTOK puesto por el usuario en Vercel. Código: `app/api/hotmart/webhook/route.ts` + `lib/hotmart/evento.ts` + RPC `apply_hotmart_event` (migración 20260927000000). Acceso a /app solo con plan vigente (`lib/acceso.ts`, middleware); sin plan → /paywall?sin_plan=1. Botón del paywall → checkout con `sck=paywall_<plan>` y correo precargado si hay sesión. Probado local con 9 eventos simulados (prueba gratis, primer cobro, compra completa sin doble ingreso, producto ajeno, cancelación, reembolso, cobro viejo bloqueado, recompra). ✅ "Enviar prueba" de Hotmart OK (2026-09-27): llegaron los 8 eventos configurados (APPROVED, COMPLETE, DELAYED, PROTEST, REFUNDED, CHARGEBACK, SUBSCRIPTION_CANCELLATION, SWITCH_PLAN), hottok aceptado, todos "Sin efecto" por ser producto de prueba (id 0) — correcto. Resend: dominio `mail.holaniki.com` VERIFICADO (2026-09-27; DKIM TXT + 2 CNAME de envío + DMARC p=none en `_dmarc.holaniki.com`, agregados a mano en Namecheap). Supabase SMTP: remitente `Niki <acceso@mail.holaniki.com>`. Probado por el usuario: código llegó a un correo ajeno, login → /paywall (sin plan) → checkout Hotmart OK. ✅ COMPRA REAL E2E (2026-09-27, correo de prueba del usuario, transacción HP0454215247): Hotmart manda el inicio de la prueba como PURCHASE_APPROVED con price.value = 0 (MXN) y original_offer_price 0 USD, subscription.status ACTIVE, recurrence_number 1, con date_next_charge → VERIFICADO que se mapea a trialing (trial_ends_at 2026-09-30, sin fila en el ledger, first_paid_at vacío). Checkout real: solo Débito/Crédito visible; precio en MXN $2,014 + IVA $322.24 = $2,336.24/año; la prueba sale como casilla "Quiero un periodo gratis" (marcada), pero el pie dice "Total a pagar $2,336.24" (confuso); Hotmart cobra un valor simbólico para validar la tarjeta. ✅ Login con ese correo → /app (acceso por prueba OK). ✅ Cancelación desde el portal del comprador → SUBSCRIPTION_CANCELLATION aplicado: plan cancelado, acceso hasta el fin de la prueba (2026-09-30), sin cobro. Pantalla de planes: aviso de moneda local + impuestos y de dejar marcada la casilla de prueba.
  8. Aviso "tu prueba termina mañana": ✅ (2026-09-27). Cron diario de Vercel (`vercel.json`, 16:00 UTC) → `/api/cron/aviso-prueba` (protegido con CRON_SECRET, puesto por el agente como Sensitive) → correo vía API de Resend (`lib/email/`, RESEND_API_KEY puesta por el usuario, remitente `Niki <acceso@mail.holaniki.com>`, reply-to hola@holaniki.com) a pruebas que terminan en 12-36 h; marca `profiles.aviso_fin_prueba_at` (migración 20260927010000). Probado en real: correo recibido y aprobado por el usuario. El aviso DENTRO de la app (pantalla Hoy) no se hizo: el usuario eligió solo el correo.
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
- RE-REVISIÓN 2026-10-16 (las 4 pantallas del dinero, de cero, con el `revisor-visual`, sin arrastrar
  puntajes viejos — capturas en docs/revisiones/repaso-2026-10-16(d)/):
  · Onboarding: NO LISTA 29/40·15/20·copy 17/20 en la 2ª pasada (tras corregir los 5 defectos de la
    1ª: letrero singular con tokens de ficha, lema repetido, aire muerto, notaAyuda faltante, mascota
    estática) — la 2ª pasada encontró 5 defectos NUEVOS, de los cuales se corrigieron 3 en una 3ª
    ronda (aire muerto del paso "tiempo", botones táctiles 44→48px, bug del check final del loading)
    SIN volver a correr el revisor (créditos) — verificado solo con captura. Pendientes sin tocar:
    asimetría de centrado en las 2 pantallas de reconocimiento (defecto moderado), 6 opciones en
    "ocasión" (decisión de producto ya documentada, no es bug).
  · Paywall: LISTA 36/40·16/20·copy 18/20 (justo en el umbral, 3ª pasada consecutiva igual de
    ajustada) — se corrigieron de paso 3 defectos heredados desde el 2026-10-06 (precio $4.99→$5
    para que cuadre con el cobro real de $59.99/año, palabra "gratis" huérfana con espacios
    irrompibles, "$0" repetido) SIN re-correr el revisor. Quedan sin tocar: 4 tamaños de texto en la
    tarjeta (pulido, no bloqueante) y una duda de metodología de captura (franja fija vs fullPage).
  · Landing: NO LISTA 30/40·15/20·copy 18/20 — los 5 defectos del 2026-10-04 SÍ estaban resueltos
    (verificado en código), pero aparecieron 5 NUEVOS: (1) los frames 2 y 3 del carrusel "La app por
    dentro" son el MISMO scroll de la pantalla de Resultado, casi duplicados — requiere una captura
    NUEVA de una pantalla realmente distinta (Historial/Hábitos/Progreso); (2) el frame 1 muestra el
    selector de foto VACÍO en vez de una foto ya puesta; (3) el stack de valor Hormozi ($120+$39+$27)
    tenía cifras SIN FUENTE en FICHA-MERCADO.md — SE QUITÓ por completo (no se inventó un número para
    reemplazarlo: `app/page.tsx`, la sección Oferta ya no recibe `stack`); (4) "Se cobra $59.99 al
    año" se repetía 2 veces a <150px — CORREGIDO (la nota del stack ahora habla del ahorro, no del
    monto); (5) el plazo de la garantía no estaba dentro de su propia condición — CORREGIDO ("en tus
    primeros 7 días"). Sigue pendiente SOLO el punto (1) y (2): necesitan screenshots nuevos de la
    app con datos semilla, no un cambio de copy — próxima sesión o con el visto bueno para usar la
    cuenta real del dueño con ese fin.
  · Hoy: NO LISTA 32/40·16/20 (sin veredicto formal desde el 2026-09-28; la pantalla sumó racha,
    misión semanal y tarjeta de outfit pendiente desde entonces) — se corrigieron 3 de los 5
    defectos (borde de "Misión de la semana" ahora consistente con las otras 2 tarjetas, grid de
    racha en 21 círculos vacíos colapsado a 1 fila cuando la racha está en 0, contraste del subtítulo
    del encabezado subido a semibold) SIN re-correr el revisor. Defecto #1 del revisor (traducir
    "Check"/"Glow-Up" al español) SE DESCARTÓ A PROPÓSITO: son el mecanismo bautizado y el nombre de
    función ya decididos como "cosa juzgada" en Sesión 1 y registrados en FICHA-ARTE/ESTADO — el
    revisor no tiene ese contexto. Defecto #4 (Pendiente vs Misión compitiendo por prioridad) sigue
    sin tocar, es una decisión de jerarquía de contenido, no un bug de una línea.
  Ninguna de las 4 recibió una 3ª/4ª pasada formal del revisor tras estas últimas correcciones —
  decisión explícita de cuidar presupuesto de tokens (Regla de Oro 7); las capturas más recientes en
  docs/revisiones/repaso-2026-10-16(d)/ ya no muestran los defectos corregidos a simple vista.
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
- Certificado /100 (RE-CERTIFICACIÓN 2026-10-20, producción = 06cfa14, verificado en vivo en
  holaniki.com): **88/100 → banda 80-89 "lista para vender" — APTO para tráfico pagado** (sube de
  84). Nada de seguridad/datos/pago cambió desde el 17-oct (confirmado: sin migraciones nuevas
  desde el 20261014, `npm audit` 0, advisors de Supabase sin hallazgos nuevos — solo los 3 ya
  conocidos e intencionales); lo único que subió es PRODUCTO, por el pulido de Hoy y Progreso de
  hoy (ver "Problemas conocidos" → `veredicto:hoy`/`veredicto:progreso` para el detalle completo).
  VENTA 19/20 (sin cambios) · FUNNEL 20/20 (sin cambios) ·
  PRODUCTO 17/20 (sube de 13 — Resultado-check LISTA 37/40·16/20 sin cambios de fondo desde
  2026-09-28 [único cambio: 1 línea de imagen .webp el 15-oct, cosmético] · Hoy 35/40·19/20
  craft YA CRUZA el gate, usabilidad a 1 punto, APROBADA por el dueño viendo la captura en vivo ·
  Progreso 29/40·15/20, mejora real desde 28/40·14/20, APROBADA por el dueño — 1 de 3 pantallas
  pasa el gate automático limpio, pero las otras 2 tienen aprobación directa del dueño, que el SO
  prioriza sobre el puntaje cuando el dueño ya vio la pantalla en vivo) ·
  CONFIANZA 13/15 (sin cambios — RLS con `with check` en las 13 tablas intacto, advisors de
  seguridad re-verificados hoy con la API de Supabase: solo WARN/INFO esperados [`processed_events`
  sin políticas = solo servidor, `mision_semana`/`reclamar_mision` SECURITY DEFINER sobre
  auth.uid(), contraseñas filtradas N/A]; −2 sin cambio: se confirmó por SQL que el único
  `first_paid_at` real en `profiles` es la cuenta del DUEÑO (prueba del 16-oct, ya reembolsada) —
  CERO clientes reales han completado prueba→cobro todavía; restauración de respaldo de Supabase
  Pro sigue sin ensayarse en real) ·
  VELOCIDAD 5/10 (RE-MEDIDA el mismo día en producción tras esta certificación — ver entrada
  `/velocidad 2026-10-20` más abajo: favicon corregido [-6 KB/página, gana poco en LCP porque no
  estaba en la ruta crítica], se probó inlinear el CSS y se revirtió por empeorar todo. Mismo nivel
  que antes: LCP 3.1-3.7 s en las 4 pantallas clave, todavía sobre la meta de 2.5 s — el tope real
  es el JS de React+Next+motion antes del LCP, sin solución sin sacrificar animaciones o migrar
  arquitectura) ·
  RETENCIÓN 14/15 (sin cambios: loop 5/5, analítica 5/5, dunning 4/5 — faltan cancelación
  retentiva y win-back).
  ⚠️ ÚNICO PILAR BAJO EL 80%: VELOCIDAD (50%) — es la prioridad real del primer mes según la banda
  80-89 del certificado (mejorar los pilares <80%). Los otros 2 pendientes reales (restauración de
  respaldo sin ensayar, primer cobro de un cliente real todavía no ocurre) no bajan puntaje más de
  lo ya descontado, pero siguen abiertos — vigilar el panel de Hotmart/admin en los primeros días
  de tráfico pagado real.
  Smoke test de producción hoy (holaniki.com): `/` `/onboarding` `/paywall` `/login` → 200 ·
  `/app` → 307 (redirige a login sin sesión, esperado) · `/api/check` y `/api/hotmart/webhook` →
  405 en GET (esperado, son POST-only) — deploy del commit 06cfa14 confirmado sano.
- Certificado anterior (2026-10-17, producción = ec364f0): **84/100 → banda 80-89 "lista para
  vender" — APTO para tráfico pagado.** Las 3 condiciones del
  certificado anterior (10-15) YA ESTÁN CERRADAS: (a) landing re-revisada y LISTA 36/40·16/20·copy
  19/20 hoy, (b) API de conversiones de Hotmart conectada + Purchase confirmado en Meta hoy, (c)
  Coincidencia avanzada ya estaba apagada (confirmado). Mismo número total que el 10-15 (84), pero
  la composición cambió: subió VENTA/FUNNEL (landing y paywall re-certificadas con margen hoy),
  bajó PRODUCTO (al revisar Hoy y Progreso con lupa, confirmaron NO LISTA de verdad — antes el
  certificado asumía el número viejo de Hoy "previo a los avisos de prueba/cobro", hoy se usó su
  medición real del 16-oct). Auditoría completa (11 bloques del checklist de pre-lanzamiento)
  hecha hoy con evidencia de código, no supuestos.
  VENTA 19/20 (landing LISTA 36/40·16/20·copy 19/20 hoy, estructura canónica de 10 secciones ✓;
  −1: Hero/CTA final dicen "Prueba VIP gratis" sin aclarar que es solo del plan Anual — pulido
  menor, no bloqueante) ·
  FUNNEL 20/20 (paywall LISTA 37/40·18/20·copy 18/20 CON margen hoy — antes pasaba justo en el
  mínimo; onboarding aprobado directo por el dueño viendo el recorrido en vivo hoy, 31/40·16/20;
  E2E landing→onboarding→paywall→Hotmart probado en producción; puente D1-D7 construido; Purchase
  de Meta confirmado) ·
  PRODUCTO 13/20 (de las 3 pantallas de la app interna con veredicto: Resultado-check LISTA
  37/40·16/20 pero con 19 días sin re-verificar; Hoy NO LISTA 32/40·16/20 medido real el 16-oct —
  compite "Pendiente" vs "Misión de la semana" por atención, defecto de jerarquía sin resolver;
  Progreso NO LISTA 29/40·14/20 con 13 días sin re-verificar — y es justo la pantalla que hoy se
  usó para la captura real del carrusel de la landing. Solo 1 de 3 pasa el gate limpio hoy) ·
  CONFIANZA 13/15 (auditoría de seguridad hoy CONFIRMA: RLS con `with check` en las 13 tablas,
  `checks` sin insert/update del usuario — solo RPC `reservar_check`/`finalizar_check` vía
  service_role, `/api/check` valida que la foto esté en SU carpeta (anti-IDOR explícito), webhook
  de Hotmart con comparación de hottok a prueba de timing-attack + idempotencia real con tabla
  `processed_events`, CSP acotada, cero secretos en código de cliente; −2 sin cambio: primer cobro
  real tras prueba con un cliente real todavía no ocurre (0 clientes reales — normal antes de la
  primera campaña, se cierra solo con las primeras ventas) + restauración de respaldo nunca
  ensayada en real) ·
  VELOCIDAD 5/10 (sin re-medir hoy — última medición 2026-10-15 sigue vigente: LCP real de campo
  1.1-1.4 s ✓ en las 4 pantallas clave, LCP simulado con antivirus/4G lenta 3.4-3.8 s ✗, JS de la
  landing sobre presupuesto) ·
  RETENCIÓN 14/15 (sin cambios: loop 5/5, analítica 5/5, dunning 4/5 — faltan cancelación
  retentiva y win-back, nunca construidos).
  ⚠️ Corrección de un dato desactualizado: la sección "Estrategia de monetización" de este archivo
  decía precio más barato $8.99/mes — el código real del paywall (vigente desde el 2026-10-04) es
  $4.99/mes efectivo (plan Anual $59.99/año). Con el costo de IA real ($0.0101/análisis × 90/mes
  tope = $0.909/mes), el heavy-user-tope representa 18.2% del plan más barato — pasa el gate de
  20% pero con margen angosto (la mediana de uso real es mucho menor).
  BLOQUEANTES REALES para el primer mes (no impiden empezar, sí hay que vigilarlos/cerrarlos):
  (1) Hoy y Progreso (2 de las pantallas de la app interna) siguen NO LISTA de verdad — re-pasar
  revisor-visual + corregir cuando haya presupuesto de sesión; (2) restauración de respaldo de la
  base de datos nunca ensayada en real (Supabase Pro ya la ofrece, falta probarla); (3) el primer
  ciclo real de prueba→cobro con un cliente real todavía no ha ocurrido — se cierra solo con las
  primeras ventas, vigilar de cerca el panel de Hotmart/admin en los primeros días de tráfico
  pagado. Mejorable, no bloqueante: sin Sentry/alertas de error en tiempo real (hay un sustituto
  casero con `error_log` + `/admin/salud`), sin runbook de incidentes propio, `MANUAL-DEL-DUENO.md`
  con 11 días de desfase (no menciona dunning/D1-D7/racha/reconciliación), nunca se hizo un "test
  de estreno" formal encarnando al avatar ni un pre-mortem documentado.
  Evidencia: docs/revisiones/repaso-2026-10-17{,b,c}/ (landing, onboarding, paywall), veredictos en
  docs/revisiones/{landing,onboarding,paywall}-veredicto.md, auditoría de seguridad/datos/pago/
  legal hecha hoy sobre el código real (RLS, webhook, RPCs, CSP, secretos — sin hallazgos nuevos).
  VENTA 17/20 (sin cambios: estructura ✓ · copy 18/20 · render landing 33/40·16/20 sin re-revisar) ·
  FUNNEL 19/20 (E2E en producción hoy ✓: landing→10 pasos de onboarding→paywall→link Hotmart off=foybda2j sck=tiktok_paywall_anual, eventos onboarding_inicio/resultado/paywall_pago_click, botón de pago visible sin conexión, login vacío con mensaje; puente D1-D7 CONSTRUIDO 14-oct ✓; bug del login con "s" corregido hoy; −1: veredictos de onboarding/paywall por re-pasar tras cambios no visuales de hoy) ·
  PRODUCTO 16/20 (sin cambios: Hoy 36/40·17/20 previo a los avisos de prueba/cobro, Resultado 37/40·16/20, Progreso 29/40·14/20 sin re-revisar) ·
  CONFIANZA 13/15 (npm audit 0 · RLS en las 13 tablas · columnas de profiles que el usuario puede editar = solo objetivo/dolor/ocasion_preferida/habito_ritmo (sin escalada a plan/rol/dunning) · CSP/HSTS/XFO/nosniff/Permissions-Policy en producción · webhook 401, /api/check 401, 3 crons 401, eliminar cuenta 401, admin 403, /app y /admin → login · advisors: solo INFO/WARN esperados (processed_events sin políticas = solo servidor; mision_semana/reclamar_mision SECURITY DEFINER sobre auth.uid(); contraseñas filtradas N/A, login sin contraseña); −2: primer cobro tras prueba sin verificar + restauración de respaldo sin probar) ·
  VELOCIDAD 5/10 (medido limpio hoy, ver VELOCIDAD en Problemas conocidos: CLS 0 ✓ · LCP real observado 1.1-1.4 s ✓ · imágenes optimizadas ✓ · LCP simulado 3.4-3.8 s ✗ · JS de la landing 252 KB vs presupuesto 130 KB ✗) ·
  RETENCIÓN 14/15 (loop 5/5 · analítica 5/5: Vercel Analytics + event_log + píxel con consentimiento · dunning 4/5: 4 correos + aviso in-app + correo 1 verificado en real hoy; faltan cancelación retentiva y win-back).
  Economía: 3 llamadas de IA reales, $0.0114 por Check (sin cambios; heavy user en el tope ≈22% del Anual — vigilar).
  Evidencia: docs/revisiones/repaso-2026-10-15/qa-ob-*.png (recorrido del embudo en producción), mediciones Lighthouse en VELOCIDAD.
- Certificado anterior (2026-10-06, producción = 461f48e = RELEASE-MANIFEST): **73/100 → NO APTO para tráfico pagado** (banda <80). Recomendación: el lanzamiento ORGÁNICO del miércoles puede seguir (pago, acceso, reembolso, seguridad y legal verificados); NO invertir en anuncios hasta ≥80.
  VENTA 17/20 (estructura canónica ✓ · copy 18/20 · render landing 33/40·16/20 último veredicto, defectos de la 6ª ronda aplicados sin re-revisar) ·
  FUNNEL 15/20 (onboarding LISTA 36/40·16/20·copy 18 y paywall LISTA 36/40·16/20·copy 17, ambos re-revisados hoy; embudo E2E en producción ✓ landing→onboarding→paywall→link Hotmart con sck por red; −5: puente D1-D7 de la prueba no diseñado) ·
  PRODUCTO 16/20 (Hoy 36/40·17/20, Resultado 37/40·16/20, Progreso 29/40·14/20 con defectos aplicados sin re-revisar; momentos del 56: racha 21 días, misión semanal, niveles, resumen mensual, mascota; 404 con marca; offline dentro de la app no probado) ·
  CONFIANZA 13/15 (Next 16.4.0 + npm audit 0; IDOR re-probado en 12 tablas + storage con usuario no-admin = 0 filas ajenas; escalada role/plan bloqueada; CSP/HSTS/XFO en producción; webhook 401 sin hottok, /api/check 401 sin sesión, cron 401 sin secreto; legal ✓ y privacidad v2; compra/cancelación/reembolso reales ✓; −2: primer cobro tras prueba sin verificar + restauración de respaldo/clean-room sin probar) ·
  VELOCIDAD 4/10 (última medición limpia LCP 3.9 s / 82; hoy NO se pudo medir limpio: Kaspersky inyecta script y quita compresión — Lighthouse local 64-74, LCP 4.9-5.7 s contaminado; PageSpeed API sin cuota; LCP = el H1 del hero) ·
  RETENCIÓN 8/15 (loop 5/5: racha, gemas, misión, niveles, resumen mensual · analítica 3/5: event_log + embudo nuevo, falta activar Analytics · dunning 0/5).
  BLOQUEANTES para ≥80 / tráfico pagado: (1) dunning de pagos fallidos (58) — /retener-ingresos; (2) puente D1-D7 de la prueba (02C) — correos/avisos días 1-3 para convertir prueba en cobro; (3) velocidad LCP ≤2.5 s — /velocidad (medir con antivirus pausado o desde otra red); (4) pago: primer cobro tras prueba se certifica con el primer cliente real (vigilar Panel → Ventas).
  ⚠️ Economía: heavy user en el tope (90 Checks) = US$1.13/mes = 22.6% del Anual (regla 20%); mediana ≈ 6% — vigilar.
  Evidencia: docs/revisiones/repaso-2026-10-06/ (onboarding 00-09, paywall pliegue/mensual, app hoy/progreso/hábitos/perfil), docs/revisiones/{onboarding,paywall}-veredicto.md, docs/revisiones/404-375.png, docs/release/* actualizados.
- Certificado anterior (2026-09-28, de50a9e): 57/100 NO APTO (VENTA 15 · FUNNEL 15 · PRODUCTO 10 · CONFIANZA 9 · VELOCIDAD 4 · RETENCIÓN 4) — sus 5 bloqueantes 61 quedaron: claims ✅, buzón ✅, pagos ⚠️ (solo falta cobro tras prueba), respaldos ✅ (Supabase Pro), Vercel Pro ✅.

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Ruta de Presencia (2026-10-04): IA devuelve `tema` por eje (enum en lib/ia/resultado.ts TEMAS; Checks viejos sin tema → fallback al último comentario). Niveles/recomendaciones/resumen mensual = funciones puras en lib/progreso.ts (tests/progreso.test.ts, 8 pruebas; total 42): nivel 1-10 por eje = mejor promedio de 5 Checks seguidos (mín. 3 Checks), NUNCA baja; <5→1, +1 nivel cada 0.5 desde 5. Misión semanal en servidor: tabla misiones_semana (RLS select own, sin insert/update directo) + RPC security definer mision_semana(p_hoy)/reclamar_mision(p_hoy) (p_hoy ±1 día de UTC; eje = menor promedio últimos 5; meta = clamp(floor(prom)+1, 6, 9); 3 Checks de la semana con nota ≥ meta → +3 gemas una sola vez). Migración 20261004000000_mision_semana aplicada y probada (incompleta / ok / ya_reclamada, en transacción revertida). Advisor: las 2 RPC marcadas como "definer ejecutable por authenticated" — intencional (usan auth.uid()). Pestaña Historial → Progreso (/app/historial redirige; /app/historial/[id] sigue).
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
- diseno:login — 2026-10-22: el linter de diseño (post-edit-diseno.sh) marca valores arbitrarios
  fuera de la escala 4·8·12·16·24·32·48·64 en `app/login/page.tsx` (text-[15px]/[10px]/[17px],
  rounded-[9px], max-w-[480px]) — TODOS preexistentes de la Sesión de servicios externos
  (2026-09-19), no tocados en el arreglo de rate-limit del 2026-10-22. Fuera de alcance de esa
  tarea (cambios mínimos); pendiente de un pulido aparte si se decide revisar `login` a fondo
  (pantalla secundaria, no una de las 4 del dinero).
- veredicto:landing / veredicto:paywall — 2026-10-21: el hook pre-stop vuelve a marcarlos
- veredicto:landing / veredicto:paywall — 2026-10-21: el hook pre-stop vuelve a marcarlos
  CADUCADOS porque compara contra CUALQUIER .tsx más nuevo del repo, y la sesión del 2026-10-20
  tocó `app/app/progreso/page.tsx`, `components/app/HoyInicio.tsx` y `components/app/MisionSemana.tsx`
  (todos de Hoy/Progreso). Ni `app/page.tsx` (landing) ni `app/paywall/page.tsx` cambiaron desde
  sus re-certificaciones del 2026-10-17 (landing LISTA 36/40·16/20·copy 19/20; paywall LISTA
  37/40·18/20·copy 18/20) — mismo falso positivo ya documentado para paywall el 2026-10-17 (ver
  nota de esa fecha abajo), ahora recurre también con landing por los mismos archivos ajenos. No
  se re-renderizan porque el código real de esas 2 pantallas no cambió.
- veredicto:onboarding — 2026-10-21: sigue NO LISTA por el puntaje automático (31/40·16/20·copy
  17/20, docs/revisiones/onboarding-veredicto.md), pero el dueño lo aprobó DIRECTAMENTE viendo las
  capturas en vivo el 2026-09-18 y de nuevo el 2026-10-17 ("yo la veo bien hasta ahora") — se
  prioriza esa aprobación sobre el gate automático (detalle completo en la nota de 2026-10-17 más
  abajo). Sin cambios de código en `app/onboarding/page.tsx` desde esa aprobación.
- veredicto:hoy — PULIDO 2026-10-20 (4 rondas de revisor-visual sobre components/app/HoyInicio.tsx
  + MisionSemana.tsx + RachaGlowUp.tsx). Subió de 32/40·16/20 (16-oct) a **35/40 · 19/20 · NO LISTA**:
  craft pasa con holgura, usabilidad se quedó 4 rondas seguidas a 1 solo punto del gate de 36, cada
  vez por un defecto distinto y cada vez más fino (jerarquía de tarjetas → peso de fuente → tamaño
  de ícono). El propio revisor-visual lo señaló: a este nivel ya no es un fix de 1 línea, es el
  mismo patrón de "pulido acumulado" que el onboarding. Se PARÓ ahí la cadena automática.
  ✅ APROBADA DIRECTAMENTE POR EL DUEÑO 2026-10-20 viendo docs/revisiones/hoy-375.png ("ya las vi,
  las encontré bien") — mismo criterio que onboarding el 2026-09-18 y 2026-10-17. Tras la
  aprobación se agregó la mascota Niki (`niki-feliz.webp`, arriba del título, con el mismo patrón
  de entrada que onboarding) que faltaba. Pendiente real sin resolver (menor, no bloqueante): el
  concepto "gemas" no tiene explicación la primera vez (a diferencia de "congeladores", que sí la
  tiene). Veredicto en docs/revisiones/hoy-veredicto.md, histórico de las 4 rondas en
  docs/revisiones/repaso-2026-10-20/.
- veredicto:progreso — PULIDO 2026-10-20 (3 rondas de revisor-visual sobre app/app/progreso/page.tsx
  + components/app/RutaPresencia.tsx). Los 5 defectos del veredicto de 2026-10-04 (29/40·14/20) YA
  ESTABAN RESUELTOS de una sesión anterior sin re-certificar (dato héroe, CTA de acción, sin --gold
  fuera de la landing, meses con enlace fijo, ícono por ocasión) — al re-certificar aparecieron 5
  defectos NUEVOS: la lista "Tus Checks" sin filtro ni tope (regla UX #14), demasiados tamaños de
  texto simultáneos, celebración del resumen mensual sin movimiento real, chips de filtro sin techo
  de carga cognitiva, tamaño táctil bajo 44px. Se corrigieron: filtro por ocasión (solo las que el
  usuario usó, ordenadas por frecuencia, techo de 3 + chip "Otras", corte de lista a 15 + "ver más"),
  tamaños de texto consolidados, spring real en la celebración, chips a 44px. ESTADO FINAL:
  **29/40 · 15/20 · NO LISTA** (mejora real desde 28/40·15/20, lejos del gate — mismo patrón de
  heurísticas estancadas en "bien" sin bug puntual que lo explique).
  ✅ APROBADA DIRECTAMENTE POR EL DUEÑO 2026-10-20 viendo docs/revisiones/progreso-375.png (mismo
  criterio que Hoy). Tras la aprobación se agregó el tope que faltaba en "Tus meses con Niki"
  (CORTE_MESES=4 + "ver los N restantes", mismo patrón que "Tus Checks") — ya no se rompe con 6+
  meses de uso. Pendientes reales sin resolver (menores, no bloqueantes): falta tooltip para "Nivel X
  al promediar Y · vas en Z"; el tagline del header no cambia según el contexto. Veredicto en
  docs/revisiones/progreso-veredicto.md, histórico de las 3 rondas en docs/revisiones/repaso-2026-10-20/.
- ✅ PURCHASE EN META CONFIRMADO 2026-10-17: el evento "Comprar" ya aparece en Administrador de
  eventos → píxel …098022 → Resumen, Activo, calidad de coincidencia 8.0/10, "Última recepción:
  hace un día" (de la compra de prueba del 16-oct). Cierra del todo el punto 3 del plan del
  viernes (confirmado con captura del dueño). Sigue el punto 4: re-certificar.
- veredicto:onboarding — 2026-10-17, 5 pasadas del día, ESTADO FINAL: usabilidad 29→31/40, craft
  14→16/20 (craft YA CRUZA el gate), copy 17/20 (estable). Se corrigieron en cadena: aire muerto
  en "tiempo", asimetría de las 2 pantallas de reconocimiento, `ConteoPct` mostrando "0%" con el
  anillo ya relleno, el stagger de `PantallaPregunta` sin apagar con `reduce`, y el wrapper de
  transición entre pasos con el mismo problema (los 3 últimos eran variantes del mismo patrón
  "reduce no se propaga", ya corregidas las 6 instancias del archivo). Usabilidad sigue 5 puntos
  bajo el gate de 36/40, pero YA NO por bugs puntuales: el propio revisor de la 5ª pasada dice que
  9/10 heurísticas caen en "3 — bien, se le nota qué afinar" en vez de "4 — ejemplar", y que
  cruzar el gate exige pulido acumulado (variar las 2 tarjetas de reconocimiento para que no se
  sientan plantilla repetida, microcopy de error más rico), no un fix de 1-2 líneas más. Dado el
  costo del revisor (~100-130k tokens cada pasada, 5 corridas hoy) se PARA aquí la cadena
  automática y se deja a decisión del dueño: mismo patrón que la Sesión 2 (2026-09-18), donde
  aprobó el onboarding a ojo con las capturas pese a no cruzar el gate automático. Capturas
  vigentes: docs/revisiones/repaso-2026-10-17c/qa-ob-00.png a qa-ob-10.png. Veredicto en
  docs/revisiones/onboarding-veredicto.md. EN REVISIÓN DIRECTA DEL DUEÑO 2026-10-17: ante la
  pregunta explícita de cómo seguir, eligió "apruébalo tú viendo las capturas" (no más rondas
  automáticas por ahora) y está entrando a http://localhost:3000/onboarding desde su propia
  computadora para verlo en vivo antes de dar su veredicto — mismo patrón ya aceptado una vez con
  esta pantalla el 2026-09-18 ("el usuario revisó las capturas él mismo y dio el visto bueno, así
  que se prioriza su aprobación directa sobre el puntaje automático"). Pendiente de su respuesta;
  ✅ APROBADO DIRECTAMENTE POR EL DUEÑO 2026-10-17: entró en vivo a http://localhost:3000/onboarding
  desde su computadora y dijo "yo la veo bien hasta ahora" — se prioriza esta aprobación directa
  sobre el puntaje automático (31/40·16/20·copy 17/20), mismo criterio ya usado el 2026-09-18 con
  esta misma pantalla. El veredicto automático del revisor-visual (docs/revisiones/onboarding-
  veredicto.md) queda como referencia técnica, no como bloqueante.
- ✅ veredicto:paywall — RE-CERTIFICADO 2026-10-17, LISTA 37/40·18/20·copy 18/20 (CON margen, antes
  pasaba exacto en el mínimo). Se corrigió el defecto #3 que faltaba (4 tamaños de texto → el
  precio de la tarjeta bajó de 20px a 16px, se funde con el nombre del plan) y se confirmó que el
  defecto #2 ("gratis" huérfano) ya estaba resuelto con un espacio que no se rompe. Veredicto en
  docs/revisiones/paywall-veredicto.md, capturas docs/revisiones/repaso-2026-10-17/qa-paywall-0{1,2,3}.png.
  Nota: el hook pre-stop puede seguir marcándolo "CADUCADO" después de esto porque compara contra
  CUALQUIER .tsx más nuevo del repo (p. ej. app/onboarding/page.tsx, tocado después para otros 2
  defectos) — `app/paywall/page.tsx` en sí NO cambió desde la re-certificación; falso positivo del
  mismo tipo ya documentado antes para onboarding (ver notas de 2026-09-27/28 más abajo).
- ✅ veredicto:landing — RE-CERTIFICADA 2026-10-17, LISTA 36/40·16/20·copy 19/20 (3 pasadas del
  día). Se corrigieron los 2 defectos de las capturas del carrusel (`/capturas/ocasion.webp` ahora
  muestra "Cita" elegida + una foto YA puesta — silueta genérica neutra, nadie identificable,
  decisión explícita del dueño: "usa una genérica" en vez de esperar una foto real suya;
  `/capturas/resultado-ejes.webp` ahora es la pantalla real Progreso/Ruta de Presencia de su
  cuenta, ya no repite el scroll del frame 2 — ambas tomadas en producción con su sesión real y
  convertidas a webp con el canvas de Chromium, sin instalar sharp/cwebp), el contraste del label
  "DESPUÉS" (se quitó `opacity-70` que bajaba el contraste a ~3.55:1, ahora ~6.4:1) y la
  inconsistencia de nombre "VIP" (Hero decía "Prueba VIP gratis" pero la sección Oferta llamaba a
  los planes solo "Anual"/"Mensual" — se alinearon a "VIP Pro Anual"/"VIP Pro Mensual", igual que
  ya dice la pantalla de planes real). Los otros 3 defectos del veredicto viejo (2026-10-16 00:00)
  — duplicado "$59.99 al año", stack de precios $120/$39/$27 sin fuente, plazo de garantía
  ambiguo — ya estaban corregidos desde antes (commit ec364f0), solo sin re-certificar. Pendientes
  de pulido NO bloqueantes (anotados por el revisor, no urgentes): aclarar que la prueba gratis es
  solo del plan Anual en el Hero/CTA final; el label del frame 3 del carrusel ("Outfit, postura y
  actitud, explicados") describe mejor el resultado inmediato que la pantalla de Progreso que
  ahora se muestra ahí — considerar ajustar el texto o la captura en el próximo pulido; falta el
  nivel "hundido" de profundidad en toda la página. Veredicto en docs/revisiones/landing-veredicto.md,
  captura docs/revisiones/repaso-2026-10-17c/landing-375.png.
- veredicto:hoy — ✅ RESUELTO 2026-10-20: el defecto #4 de abajo (de la ronda 2026-10-16: "Pendiente"
  y "Misión de la semana" compitiendo por ser "la próxima acción") se corrigió reordenando las
  tarjetas (Misión primero, con CTA propio) y bajando "Pendiente" a un tratamiento de recapitulación
  — ver la entrada nueva de `veredicto:hoy` al inicio de esta sección para el estado actual completo.
- "Check"/"Glow-Up" en español — el revisor-visual de Hoy (2026-10-16) sugirió traducirlos
  ("Check"→"revisión", "Glow-Up"→algo en español). DESCARTADO A PROPÓSITO: "Check de Presencia" es
  el mecanismo bautizado de la app (decidido en Sesión 1, usado en landing/onboarding/paywall/
  correos/Hotmart) y "Glow-Up" es la ÚNICA excepción de anglicismo ya aprobada y registrada (ver
  nota de `veredicto:landing` del pulido 2026-10-04: "anglicismos fuera (salvo Glow-Up, nombre de
  función)"). El revisor no tiene ese contexto histórico — si un futuro revisor lo vuelve a marcar,
  no es un bug nuevo, es este mismo punto.
- veredicto:onboarding y veredicto:paywall — POSPUESTO 2026-10-15 (/velocidad): cambios SIN efecto visual en el estado final — onboarding: banner .png→.webp del mismo tamaño + primer paso sin fade inicial (AnimatePresence initial={false}); paywall: titular sin fade inicial (el resto sigue escalonado) + Supabase cargado bajo demanda. Verificado a 375px (capturas de la sesión, sin diferencias). Re-lanzar revisor-visual de ambas en la próxima pasada de pulido (cuidando créditos por decisión del dueño).
- veredicto:hoy — POSPUESTO 2026-10-14: la pantalla principal (Hoy, app/app/page.tsx) ganó elementos que solo ven ciertos estados: etiqueta "Día X de 3" + panel (prueba), tarjeta "¡Ya eres VIP Pro!" (recién pagado) y aviso de cobro fallido arriba (past_due, app/app/layout.tsx). Capturas: docs/revisiones/prueba-dia-375(-panel).png, bienvenida-pro-375.png, aviso-cobro-375.png. Re-lanzar revisor-visual de Hoy en la próxima pasada de pulido junto con onboarding y paywall (cuidando créditos por decisión del dueño).
- veredicto:onboarding y veredicto:paywall — POSPUESTO 2026-10-13 (re-revisión): el código de esas pantallas NO cambió; lo nuevo es el aviso de cookies global (components/AvisoCookies.tsx, montado en app/layout.tsx) que aparece abajo UNA vez hasta que la persona elige Aceptar/Rechazar — en onboarding y planes tapa el botón fijo hasta ese toque. Captura: docs/revisiones/aviso-cookies-375.png (sin revisor: componente secundario). Los veredictos LISTA del 6-oct siguen describiendo las pantallas; re-lanzar revisor-visual de ambas en la próxima pasada de pulido (cuidando créditos por decisión del dueño). Si la tasa onboarding→resultado cae tras el aviso, considerar mostrarlo solo en la página principal.
- veredicto:onboarding y veredicto:paywall — 3ª PASADA FINAL 2026-10-06 sobre el código actual (commit del 6-oct): onboarding LISTA 36/40·16/20·copy 18; paywall LISTA 36/40·16/20·copy 18 — vigentes. Siguiente pulido del paywall (no tocado para no caducar el veredicto la víspera del lanzamiento): bajo el botón Anual volver a aclarar el precio ("Hoy pagas $0 · Hotmart muestra $59.99 del año"), gap-3 entre planes, "$5/mes" en landing+planes, paso Hoy de la prueba sin repetir $0. Onboarding: chips de ejes con borde fino (no parecer filtros) y mt-4. Historial: RE-REVISADOS 2026-10-06 (2 pasadas c/u): LISTA 36/40·16/20 ambos (copy 18 y 17). Después del veredicto se aplicaron SOLO defectos señalados por el propio revisor en la 2ª pasada: onboarding → candados de "Lo que Niki va a revisar" compactados en 3 chips de una línea (el CTA fijo los tapaba); paywall → bajo el botón "Garantía del Primer Ajuste Honesto · 7 días" (recupera el plazo) y en Mensual "Se renueva cada mes · cancelas cuando quieras" (antes quedaba tapada). Capturas actualizadas en docs/revisiones/repaso-2026-10-06/. Pendientes del revisor, no bloqueantes: banner "¡Bienvenidos!" (decisión del DUEÑO: amarillo fuera de FICHA-ARTE y plural masculino — si lo confirma, registrarlo en FICHA-ARTE; si no, quitarlo), lema repetido en el encabezado de cada paso, aire muerto en "No es falta de estilo", mascota de apertura estática, $4.99×12≠$59.99 (proponer "$5/mes" en landing+planes), 4 tamaños de letra en planes.
- ANALÍTICA: Vercel Web Analytics ACTIVADO 2026-10-06 (requirió volver a publicar). Ver en Vercel → niki → Analytics: visitas por página y eventos onboarding_inicio / onboarding_resultado / paywall_pago_click (con plan y red).
- VELOCIDAD (/velocidad 2026-10-20, commits a92f6f8 + 68e5bb5): CAMBIO DE MÉTODO respecto al
  15-oct: se midió contra PRODUCCIÓN real (holaniki.com) en vez de una copia local — una copia
  local con `next start` sirve SIN comprimir (hallazgo nuevo: 36 KB de HTML sin gzip/brotli,
  mientras que Vercel sí comprime), así que los números locales eran pesimistas y no comparables
  contra producción. Desde hoy, medir SIEMPRE contra holaniki.com. Mediana de 2-3 corridas por
  página, Lighthouse móvil, `--blocked-url-patterns="*kaspersky-labs.com*"` (la inyección de
  Kaspersky sigue viva y contamina quien mida sin este flag — confirmado de nuevo hoy).
  ANTES → DESPUÉS (producción): landing LCP 3.54→3.56 s (497→511 KB tras quitarle solo el favicon;
  sin cambio relevante — el favicon no estaba en la ruta crítica de pintado) · onboarding LCP
  3.23→3.26 s, 369→363 KB · paywall LCP 3.12→3.25 s, 456→450 KB · login LCP 3.11→3.11 s,
  429→423 KB · CLS 0 en las 4, antes y después (confirmado limpio tras revertir el experimento,
  ver abajo). La variación de LCP entre mediciones (hasta ±0.5 s en la misma página sin tocar
  nada) es RUIDO DE RED REAL de medir contra internet, no del código — normal y más honesto que
  medir en localhost.
  HECHO (gana, bajo riesgo, en producción):
  (1) `app/favicon.ico` pesaba 26 KB y ni siquiera era la marca real (un círculo con un triángulo
  genérico, resto de algún scaffold) — reconstruido desde el Anillo Niki real (mismo degradé/trazo
  que el resto de la app) en 16/32/48px, 3.3 KB (ahorro real medido: ~6 KB por página, confirmado
  en producción). Dato aparte de velocidad: corrige un error de marca que llevaba desde el
  2026-09-17 sin que nadie lo notara (el ícono de la pestaña del navegador no era el de Niki).
  PROBADO Y DESCARTADO (no acumular esto de nuevo sin volver a medir):
  (2) `experimental.inlineCss` de Next.js — la documentación de esta versión (bundleada en
  node_modules/next/dist/docs) lo recomienda para CSS atómico (Tailwind) + tráfico frío de
  anuncios, que es justo nuestro caso. Medido en producción: EMPEORA todo — +238 KB (el CSS se
  duplica entre el `<style>` inline y el payload de hidratación RSC, advertencia que la propia
  doc ya menciona pero cuyo impacto real no se puede saber sin medir), LCP peor (4.8 s vs 3.5 s) y
  apareció un salto visual (CLS 0.045) que antes no existía. Revertido el mismo día (commit
  68e5bb5) tras medir "después" y ver la regresión — nunca se declaró mejora sin la medición.
  NO SE TOCÓ, evaluado y descartado por riesgo (no es "pendiente", es decisión tomada hoy):
  (3) Quitar algún grosor de letra de Manrope (se cargan 400/500/600/700): `font-normal` (400) no
  aparece como clase explícita en ningún componente, PERO el CSS global no fija un peso base
  distinto — cualquier texto sin clase de peso explícita en algún rincón de la app cae en 400 por
  default del navegador. Sin poder auditar eso al 100% con confianza, no se quitó: el riesgo de
  texto invisible/con peso incorrecto en un lugar no revisado pesa más que el ahorro (~15-25 KB).
  (4) La imagen `niki-celebrando.webp` en el CTA final de la landing — Lighthouse la marcó como
  "servida más grande de lo que se ve" (48px vs 192px), pero es un ARTEFACTO DE MEDICIÓN: esa
  imagen entra con `whileInView` + `scale: 0.6` inicial (80px × 0.6 = 48px, coincide exacto); la
  herramienta la midió a mitad de su animación de entrada, no en su tamaño real. No hacía falta
  tocar nada.
  SIGUE PENDIENTE (de sesiones anteriores, sin cambios): el límite real hoy es el JS base de
  React+Next+motion que debe cargar y correr ANTES del LCP bajo CPU limitada de un Android gama
  media — no hay forma de bajarlo sin sacrificar las animaciones baseline (prohibido) o migrar a
  componentes de servidor (ya evaluado y descartado: riesgo alto, ahorro mínimo). Además, "Hoy" y
  "Progreso" (las pantallas post-login) no se pudieron medir hoy con este método — dependen de un
  `fetch` del cliente a Supabase DESPUÉS de hidratar, así que buena parte de su demora percibida
  es arquitectónica (pedir los datos en el servidor antes de mandar el HTML eliminaría ese viaje
  redondo, pero es un cambio de arquitectura, no un ajuste de pulido — queda anotado para una
  sesión dedicada si se decide atacarlo).
  PRESUPUESTO (sin cambios): landing JS ≤252 KB y total ≤520 KB; planes/entrar JS ≤320 KB;
  imágenes nuevas siempre webp a 2x su tamaño en pantalla; favicon ≤5 KB (nuevo, por lo de hoy).
  Capturas de verificación visual (sin romper nada) en
  docs/revisiones/repaso-2026-10-20/velocidad-{landing,onboarding,paywall,login}-375.png.
- VELOCIDAD anterior (/velocidad 2026-10-15, commits 9c3ea9d + d2db25e): medición = Lighthouse 13.5 móvil (Moto G Power simulado, 4G lenta) desde la laptop con --blocked-url-patterns="*kaspersky-labs.com*" (anula la inyección de Kaspersky), mediana de 3 corridas por página; PageSpeed web agotó su cuota anónima. ANTES → DESPUÉS: landing puntaje 79→82, LCP 4.16→3.66 s, peso total 657→514 KB · onboarding 87→86, LCP 3.71→3.42 s, 479→378 KB · planes 76→81, LCP 3.87→3.82 s, JS 347→318 KB · login 77→82, LCP 3.95→3.74 s, JS 336→306 KB · CLS 0 en todas. LCP REAL observado (sin simular) = primer pintado en las 4 (1.1-1.4 s): el titular/imagen ya sale del HTML del servidor. HECHO: imágenes a webp de su tamaño (capturas 500px, banners 720px, mascota 192px, gema animada 60px; originales intactos), zod fuera del navegador (lib/env.ts sin zod; servidor sigue con zod en env-server.ts), Supabase cargado bajo demanda en planes y entrar (lib/supabase/diferido.ts), titular de planes y primer paso del onboarding sin fade inicial (initial={false}; el resto sigue escalonado). Meta LCP <2.0/2.5 s NO cumplida en el simulador: el límite restante es el JS base (React+Next ≈125 KB brotli + motion ≈47 KB) que el modelo de Lighthouse carga antes del LCP; quitar motion de la landing = descartado (rompe animaciones baseline). DESCARTADO: convertir la landing a componentes de servidor (todas las secciones usan motion → ahorro mínimo, riesgo alto). PRESUPUESTO para nuevas funciones: landing JS ≤252 KB y total ≤520 KB; planes/entrar JS ≤320 KB; imágenes nuevas siempre webp a 2x su tamaño en pantalla. Pendiente: datos de CAMPO (usuarios reales) cuando haya tráfico — PageSpeed web/CrUX.
- BUG CRÍTICO CORREGIDO 2026-10-15 (9c3ea9d): el login rechazaba todo correo con la letra "s" (regex sin barras: /^[^s@]+@.../ desde el 2026-10-03) mostrando "Escribe tu correo completo" — p. ej. sofia@gmail.com, luis@hotmail.com, cualquier @yahoo.es. Ahora lib/correo.ts + tests/correo.test.ts (62 pruebas OK).
- veredicto:paywall — 5ª edición (2026-10-04): solo LÓGICA, sin cambio visual: el link de pago agrega la red de origen al sck (leerOrigen). Probado: /?src=tiktok → sck=tiktok_paywall_anual.
- veredicto:paywall — 4ª edición (2026-10-04): solo CIFRAS del plan Anual ($4.99 · $59.99/año · $0.17/día · ~8 meses gratis), mismo largo de texto y layout; verificado en producción (holaniki.com/paywall muestra $59.99). No requiere re-revisión visual.
- veredicto:progreso — RUTA DE PRESENCIA CONSTRUIDA 2026-10-04 (aprobada por el dueño desde vista-previa-progreso.html). Revisor-visual 1ª pasada: NO LISTA 29/40 · 14/20; sus 5 defectos APLICADOS sin re-revisión (créditos): dato héroe "Tu nivel de presencia" (suma de niveles, cuenta animada), niveles "N/10" + barra y meta del siguiente nivel por eje, CTA "Hacer un Check para subir <eje foco>", sin --gold fuera de la landing (aviso y foco del mes en superficie + borde acento), "Tus meses con Niki" con enlace fijo a cada resumen, ícono por ocasión. Capturas con sesión real: docs/revisiones/{progreso,progreso-eje,progreso-mes,hoy-mision}-375.png (script scripts/captura-sesion.mjs: magic link generado con la clave de servidor, sin correo). Pendiente opcional: 2ª pasada del revisor.
- veredicto:landing — PULIDO 2026-10-04 (6 rondas de revisor-visual, último veredicto escrito: NO LISTA 33/40 · 16/20 · copy 18/20; el revisor estimó ≈37/40 con sus defectos 1, 2 y 4 corregidos — los 5 de la 6ª ronda APLICADOS sin re-revisión por decisión del dueño de cuidar créditos: plan elegido viaja ?plan= → localStorage niki_plan_preferido → paywall lo preselecciona (probado anual/mensual/sin elegir), párrafo repetido de "6 meses" quitado, texto del CTA final al 100% (AA), aviso de falla en sr-only role=status siempre montado, "Quiero el plan mensual"; historia 25→29→28→30→32→33). Hecho: anillo 7.3 animado (AnilloCaptura), logo Anillo Niki en hero/footer (LogoAnillo), --gold y --gray-claro registrados en FICHA-ARTE, anglicismos fuera (salvo Glow-Up, nombre de función), copy dentro del presupuesto de 52, CTAs unificados con next/link + spinner + aviso a los 8 s ("Revisa tu conexión…"), botones todos h-12 (final h-14), Oferta simplificada, footer en grilla, "plata"→"dinero", frase cruel de "En 6 meses" suavizada, mascota del hero arriba a la derecha (no tapa datos). Pendiente si se quiere el LISTA formal: 7ª pasada del revisor (opcional).
- veredicto:onboarding y veredicto:paywall — MASCOTA colocada 2026-10-04: onboarding apertura=niki-saludando, "¡Ya casi está!"=niki-pensando (sin chip, 80px), resultado=niki-celebrando; Hoy procesando=niki-pensando; Perfil despedida=niki-ok; landing: ver veredicto:landing. Perfil y Hoy-procesando sin captura (requieren sesión), mismo tamaño que el asset anterior (antes: niki-feliz en apertura y resultado del onboarding, mismo tamaño que las caritas; capturas docs/revisiones/onboarding-mascota-{apertura,resultado}-375.png, CTA arriba del pliegue). El hook de cierre los marca CADUCADOS (2026-10-04) por fecha de archivos de /admin (gastos, layout, salud), NO por cambios en esas pantallas; sus cambios posteriores ya están documentados abajo. Se re-lanza el revisor-visual de ambas cuando entre la MASCOTA 3D (en curso 2026-10-04: el dueño probará 3 prompts A tierno / B clay / C juguetón con manitas en ChatGPT/Gemini; al elegir → guardar descripción canónica en FICHA-ARTE.md y generar los estados: neutro, celebrando, preocupado, dormido, saludando + OK y esperando; reemplaza las caritas genéricas en onboarding, Hoy, Perfil, ResultadoCheck y landing; el logo pequeño/favicon sigue plano).
- veredicto:onboarding — cambio VISUAL MENOR posterior al veredicto LISTA (2026-10-03, pedido del dueño): banner "¡Bienvenidos!" regenerado con letra más grande (public/iconos/banner-bienvenidos-v2.png, mismo degradé/colores/contorno) y ancho 280→335px. Captura docs/revisiones/onboarding-banner-375.png: CTA sigue arriba del pliegue, sin desbordes. No se re-lanzó el revisor (solo tamaño de un asset aprobado). Igual en Perfil: banner de despedida v2 (3 líneas, letra ~2x) a 335px.
- LOGIN SIN RESPUESTA corregido (2026-10-03, reportado por el dueño): con el campo de correo vacío o incompleto, "Enviarme el acceso" no decía nada (solo el globito nativo del navegador) y el paso de correo ni siquiera mostraba el error de envío. Ahora: validación propia con mensaje visible, error de envío visible en correo y en rescate, correo recortado de espacios, y el rescate decía que el código llega desde hola@ cuando sale de acceso@mail.holaniki.com (corregido). Captura docs/revisiones/login-error-correo-375.png. Pantalla secundaria: sin revisor.
- veredicto:paywall — 3ª edición (2026-10-04): solo LÓGICA, sin cambio visual: preselecciona el plan elegido en la landing (useSyncExternalStore de niki_plan_preferido; default Anual). Probado.
- veredicto:paywall — 2ª edición posterior al veredicto (2026-09-29): solo LÓGICA, sin cambio visual: al cargar, si la sesión tiene plan vigente (tieneAcceso) redirige a /app. Probado: sin sesión sigue mostrando los planes, sin errores de consola. No requiere re-revisión visual.
- PLANES PAGADOS (2026-09-28): Supabase Pro (org Niki, Spend Cap activado, verificado por el dueño) y Vercel Pro (sin miembros extra). Tras el cambio: proyecto niki mismo id, dominios holaniki.com/www intactos, producción = último commit; se verifica publicación automática con el commit de esta nota.
- Buzón hola@holaniki.com: reenvío ACTIVADO en Namecheap (2026-09-28): Mail Settings = Email Forwarding (TXT spf efwd automático) + alias hola → raulvalerion@gmail.com. ✅ Prueba de recepción OK (correo desde Yahoo llegó a Gmail, 2026-09-28; MX eforward1-5 + SPF efwd verificados).
- BUG REAL CORREGIDO (2026-09-29): SUBSCRIPTION_CANCELLATION trajo date_next_charge en SEGUNDOS → plan_activo_hasta quedó en 1970 (un cliente real habría perdido el acceso pagado al cancelar). fecha() ahora toma <10^12 como segundos y una cancelación con fecha pasada no recorta el acceso; +2 pruebas (23 en total). Dato del admin corregido a 2026-10-15. Reembolso de prueba: ✅ PURCHASE_REFUNDED llegó y se aplicó (2026-09-29 03:36 UTC): plan=ninguno, estado refunded, reembolso en el ledger; el dueño confirmó el correo de Hotmart (2026-10-03). Pagos pendientes: cobro tras prueba (con primer cliente real) + job de reconciliación semanal.
- COMPRA REAL MENSUAL (2026-09-28/29): PURCHASE_APPROVED aplicado a raulvalerion@gmail.com → plan mensual active hasta 2026-11-01 (MXN 285, original_offer_price 15.83 USD). Bug encontrado: la pantalla de planes no detectaba plan activo (el suscriptor veía la venta otra vez) → ahora redirige a /app si tieneAcceso. Página de agradecimiento sugerida para Hotmart: https://holaniki.com/login?compra=1 (muestra "¡Gracias por tu compra!"). ✅ Página de agradecimiento CONFIGURADA en Hotmart (verificado con captura 2026-10-03, Herramientas → Configuraciones de pago → Posventa → Página externa): aprobadas → /login?compra=1; espera de pago y análisis de crédito → /login?compra=pendiente. (Reembolso ya hecho y verificado.) RECONCILIACIÓN SEMANAL (2026-10-03): construida — lib/hotmart/{api,reconciliar,correr-reconciliacion}.ts, cron lunes 14:00 UTC /api/cron/reconciliar, botón "Revisar ahora" en /admin/salud (/api/admin/reconciliar), tabla reconciliacion_hotmart (admin-only, migración 20261003000000 aplicada), 11 pruebas (34 en total). Decisión: SOLO REPORTA (correo a admins si hay diferencias o falla), no corrige — el dueño arregla desde Usuarios. Probado local: 401 sin secreto, 403 sin admin, corrida registra faltan_credenciales sin mandar correo. ✅ Credencial API Hotmart creada por el dueño (producción, no sandbox) y puesta en Vercel (Sensitive, solo production); 1ª corrida real OK 2026-10-04 00:23 UTC: 2 suscripciones (las de prueba, canceladas/reembolsadas), 0 con acceso, TODO CUADRA — endpoints y formato de la API confirmados.
- Panel → Gastos (/admin/gastos, 2026-09-28, pedido del dueño): tabla costos_operacion (solo admin, RLS probado: cliente lee 0 e insertar bloqueado) con 7 gastos semilla; totales: inversión inicial $61.48 (pagado $16.48, falta $45 + $14.99 recuperable), fijo ≈$45.96/mes, IA del mes real desde ai_calls, clientes para cubrir gastos (margen anual $7.14, estimado). Pantalla secundaria: sin revisor (medición + checklist); sin captura porque requiere sesión de admin.
- Pantalla Hoy: revisor-visual LISTA 36/40 · 17/20 (5ª pasada) → docs/revisiones/hoy-veredicto.md, captura hoy-375.png (viewport 812).
- Racha Glow-Up de 21 días y Modo Alto Impacto: CONSTRUIDOS 2026-09-28 (migraciones racha_glowup + habito_registros_delete_own aplicadas; 7 casos de racha probados en SQL; esquema de IA con plan_alto_impacto probado contra la API). Resultado LISTA 37/40·16/20 con ambos bloques. ✅ PROBADOS EN REAL por el dueño (2026-10-03): racha 0→1, gema +1, y Check de entrevista con plan Alto Impacto de 3 pasos. Bloqueante 1 del certificado CERRADO en CLAIMS-LEDGER.md. Observado: el mismo outfit sacó 6.3 en Amigos y 5.3 en Entrevista (correcto: se juzga según la ocasión), y comparar entre ocasiones distintas desanimaba → CORREGIDO (2026-10-03, aprobado por el dueño): Hoy compara solo contra el Check anterior de la MISMA ocasión y muestra la ocasión en la línea del puntaje (captura docs/revisiones/hoy-comparacion-ocasion-375.png, 1 línea incluso con "Cena formal"). Cambio de 1 línea de copy/lógica: no se re-lanzó el revisor de Hoy (veredicto LISTA 36/40·17/20 vigente en layout).
- veredicto:paywall — el código del paywall cambió DESPUÉS de su veredicto LISTA (2026-09-28), pero SOLO en 1 línea de copy ("Check de Presencia ilimitado antes de cada salida" → "3 Checks de Presencia al día", por el límite de IA aprobado). Verificado en captura a 375px (cabe en 1 línea, sin huérfanas) → docs/revisiones/paywall-375.png. Se re-lanza el revisor-visual la próxima vez que cambie el layout o más copy del paywall.
- veredicto:onboarding — CADUCADO según el hook pre-stop (falso positivo, verificado 2026-09-28): el hook compara contra CUALQUIER .tsx más nuevo (app/page.tsx, app/paywall, app/admin), pero `git log -- app/onboarding` muestra que el último cambio del onboarding (2f6aef0, 2026-09-25 18:36) es ANTERIOR al veredicto (e0e2a1e, 18:37). Se re-lanza el revisor solo si se toca app/onboarding.
- Veredicto onboarding CADUCADO solo por fecha (2026-09-27): el código del onboarding NO cambió en la sesión Hotmart (el hook compara contra cualquier .tsx más nuevo, p. ej. app/page.tsx o app/paywall/page.tsx). Se re-lanza el revisor-visual del onboarding la próxima vez que se toque su código. El paywall ya tiene veredicto nuevo LISTA (36/40 · 16/20 · copy 18/20, 2026-09-27, 3 pasadas).
- Carrusel de "La app por dentro" (pantalla de Onboarding incluida entre sus frames): usa PLACEHOLDERS rotulados — la app interna está pendiente de existir; se reemplazan por screenshots reales cuando esa app se haga (Sesión de app interna). Este es el motivo #1 por el que el veredicto del revisor-visual sobre la landing quedó en "no aprobado" — pendiente y esperado a esta altura, no un bug.
- Visual del hero: placeholder honesto con sugerencia escrita (no hay app interna todavía para capturar) — mismo motivo que arriba.
- El anillo de progreso (dispositivo ownable de FICHA-ARTE.md) no es visible en la landing todavía porque vive dentro de los placeholders de arriba — aparecerá solo cuando se monten los screenshots reales.
- Garantía (sección 7 y /reembolsos): el copy público NO fija un número de días porque Hotmart todavía no está configurado (FICHA-MERCADO.md §4 guarda 7 días como plazo legal mínimo de referencia para uso interno, no publicado). Se confirma y se actualiza el copy al configurar Hotmart en la Sesión de servicios externos.
- Email de soporte: cambiado a "hola@holaniki.com" en el código (2026-09-25). Ese buzón AÚN NO RECIBE correos: falta activar el reenvío gratis de Namecheap (Email Forwarding → Gmail del usuario) y verificar holaniki.com en Resend para enviar desde ahí. El código de acceso ya sale de acceso@mail.holaniki.com (2026-09-27); sigue pendiente el reenvío de hola@holaniki.com para RECIBIR correos de soporte.
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
- Veredicto del onboarding (2026-09-25): LISTA (36/40·16/20·18/20). Histórico: antes decía NO LISTA
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
- [x] 2026-10-20 (/adquisicion): PROGRAMA DE AFILIADOS DE HOTMART COMPLETO — comisión 30% primera
  venta + 20% recurrencia, presentación ajustada, visible en el Mercado/Marketplace, materiales
  subidos (PDF del kit en una carpeta de Drive compartida pegada en "Link para una carpeta en la
  nube" + los 4 correos del swipe pegados en "Modelo de email"). Fuente del kit:
  docs/copy/kit-afiliados.md (y `Kit-Afiliados-Niki.pdf`, generado localmente, no versionado en
  git). Queda a la espera de que algún afiliado se sume — "riesgo cero no es esfuerzo cero": no
  esperar que se active solo, toca reclutar (ver PASO 4 de 34-ADQUISICION-Y-TRAFICO.md) cuando
  haya ventas propias que mostrar.

## Notas para la próxima sesión
- USUARIO EN REDES (2026-10-04): @holaniki_app — Instagram LISTO; TikTok creado (usuario ok; nombre visible "Niki - Check de Presencia" se puede cambiar hasta el 2026-10-11); Facebook: Página creada 2026-10-04 (tipo Empresa); usuario holanikiapp (FB no acepta "_") 2026-10-05; Instagram VINCULADO 2026-10-05. Las 3 redes abiertas en la laptop (IG vía cambio de cuenta desde la personal; TikTok con contraseña propia). Hoja de cuentas sin contraseñas: contenido/MIS-CUENTAS.md. Nombre visible: "Niki - Check de Presencia" (guion).
- ADQUISICIÓN (2026-10-04, /adquisicion, PLAN APROBADO — formato 2: Niki protagonista, sin salir a cámara): ETAPA 0 (0 clientes, ~$0 en ads). HECHO: medición por red (?src= → localStorage niki_src 30 días → sck "tiktok_paywall_anual" en Hotmart; probado de punta a punta) + lote semana 1 en contenido/semana-01 (GUIONES.md con 3 videos + carrusel de 7 PNG 1080x1350 + Niki 1000px sin fondo + capturas). Bio: holaniki.com/?src=tiktok | ig | fb. Siguiente: afiliados Hotmart (kit) y semana 2 según el ganador. Canal principal propuesto: orgánico short-form (mismo video vertical en TikTok + IG Reels + FB Reels, 3 videos + 1 carrusel/semana, TikTok SEO) + afiliados Hotmart. Antes de publicar: medir canal (?src= en landing → sck del checkout) — PENDIENTE de construir. Cuentas: el dueño aún no las tiene; se crean con hola@holaniki.com (reenvía a su Gmail), mismo @usuario en las 3, TikTok empresa, IG profesional, FB como Página + Meta Business Suite, 2FA. Esperando: formato de video (a cámara / Niki protagonista / mezcla) = OK del plan.
- ADQUISICIÓN (2026-10-20, /adquisicion): el dueño preguntó por arrancar tráfico PAGADO; se le
  explicó el criterio del 34 (etapa 0 = 0 clientes reales todavía, confirmado por SQL — paid ads es
  etapa 1, DESPUÉS de las primeras 10-30 ventas y testimonios) y eligió seguir con ETAPA 0: afiliados
  + orgánico primero, paid se deja para cuando haya ventas reales que lo justifiquen. Comisión
  PROPUESTA 35% recurrente; el dueño en Hotmart ya tenía 30% solo-primera-venta configurado de
  antes y decidió agregar 20% de recurrencia en vez de cambiar a 35% parejo — resultado: 30% la
  primera factura + 20% cada renovación. Margen con esto: MEJOR que la propuesta (primer mes neto
  ~$9.5, meses siguientes ~$11/cliente en el plan Mensual $14.99, tras comisión y costo de IA) —
  pasa el gate del 40 con margen sano. KIT
  COMPLETO generado en docs/copy/kit-afiliados.md (5 ángulos, 15 copys IG/TikTok, guion UGC de
  30-45s, 5 stories, swipe de 4 correos, ideas de creativos, FAQ, reglas del programa) — fuente:
  FICHA-AVATAR.md. Pendiente del dueño: activar la afiliación en Hotmart (ver "Pendientes del
  usuario" arriba) y subir el kit. No se tocó código en esta tarea.
- CONTENIDO SEMANA 3 (2026-10-20, /contenido-semanal): REVISIÓN SEMANA 2 — TikTok: carrusel cita
  (15-oct) 2 vistas, video reunión (17-oct) **210 vistas** (el mejor desde la semana 1), carrusel
  postura (18-oct) 0 vistas; video cena (20-oct) programado 19:00, pendiente de confirmar.
  Instagram+Facebook (30 días): 317 vistas totales, 80.5% ya seguidores — mismo problema de
  siempre, se resuelve con constancia, no de un día para otro. Confirmado por SQL: 0 eventos en
  `event_log` desde el 15-oct — el puente contenido→sitio sigue roto, es la prioridad real, no el
  tema del video. LECTURA: situación de trabajo + número concreto ganó 2 semanas seguidas (carrusel
  entrevista 546 vistas semana 1, video reunión 210 semana 2); cita y postura no se movieron,
  pero la muestra es chica para descartarlos del todo. SEMANA 3 ARMADA (mix aprobado por el dueño)
  en contenido/semana-03/ (GUIONES.md + COMO-SUBIRLO.md + carrusel ya exportado a PNG): Mié 21
  carrusel "5 señales de buena impresión" (repite la fórmula ganadora, candidata a Spark Ad si
  algún día hay paid) · Vie 23 video "Cómo mejorar tu postura" (mismo tema que el carrusel que no
  se movió, ahora en video — para separar tema de formato) · Dom 25 video "Cómo saber si tu
  outfit combina" (apunta a búsqueda en TikTok, se mide en semanas no en días) · Mar 27 video "Qué
  ponerte para salir con amigos" (situación nueva, nunca probada). Racha de cadencia: 2 semanas
  cumplidas. Siguiente revisión: martes 27-oct.
- AVISO PREVIO (2026-10-05, pedido del dueño, opción 1 = solo expectativa, sin lista de espera ni premio): 3 días antes de la semana 1 — contenido/aviso-previo/ (GUIA.md + 3 publicaciones 4:5 + 3 historias 9:16, fuente aviso-previo.html): Día 1 "Muy pronto estaré contigo", Día 2 problema "¿saliste sin saber si te veías bien?", Día 3 "¡Ya llegué!" + link. Enlace del perfil sin cambios. Después arranca semana-01.
- IDEA PARA DESPUÉS (2026-10-05): versión en inglés (botón "English version", pedido del dueño). Decisión: V2, NO ahora — todo el contenido de redes es en español, inglés exige i18n completa (UI, IA, correos, legales, checkout) + contenido en inglés + competencia directa con Umax/apps US. Reabrir tras primeras ventas en LATAM o si la analítica muestra tráfico angloparlante (archivo 39). Logo: se mantiene el Anillo plano en esquinas/favicon; la mascota 3D solo ≥40px (regla FICHA-ARTE, reconfirmada al dueño).
- ✅ SEMANA 2 — Jue 15 carrusel "5 errores en tu primera cita" PUBLICADO. ✅ Sáb 17 video "Reunión
  de trabajo" PUBLICADO 2026-10-17 ~18:10 (TikTok + Meta Business Suite como reel + historia IG con
  enlace ?src=ig_reunion, los 3 confirmados por el dueño — se adelantó de la hora habitual 7 pm por
  decisión del agente: 50 min antes no vale la pena rehacerlo). ✅ Dom 18 carrusel "Tu postura habla
  antes que tú" (entrevista parte 2) PROGRAMADO 2026-10-17 para mañana 19:00 en TikTok + Facebook +
  Instagram (feed) — confirmado por el dueño; la historia IG con sticker de enlace (?src=
  ig_entrevista2) NO se puede programar, queda pendiente de que el dueño la suba a mano desde el
  celular mañana a esa misma hora. Mar 20 (video "Cena formal") sigue para después, sin tocar hoy.
- PLAN 2026-10-05: ✅ Día 1 del aviso previo PUBLICADO 2026-10-05 18:03 (IG+FB vía Meta Business Suite con "Personalizar" por red; TikTok vía TikTok Studio); próxima sesión /pre-lanzamiento (revisión completa) ANTES del Día 3 (miércoles 7-oct, que manda tráfico con "link en mi perfil").
- IDEA PARA DESPUÉS (2026-10-04): página "madre" de marca (propia imagen/logo/dominio para Niki + futuros proyectos), sugerida en el curso. Decisión del dueño: NO por ahora. Hacerla cuando haya un 2º producto o ventas constantes (1 sesión). Opcional: reservar el dominio si ya tiene el nombre.
- ✅ PRECIO ANUAL $59.99 PUBLICADO 2026-10-04 (rama precio-anual-59 integrada). Hotmart verificado en el checkout real: mismo plan off=foybda2j, $59.99 USD → "$1,334.00 / año" en MXN con impuestos, prueba gratis presente; Mensual sin cambio ($335.24/mes con IVA). Historia:: landing, pantalla de planes, correo de fin de prueba, margen del panel, ECONOMICS y regla anual/mensual del webhook (≥$30 USD = anual; antes ≥$100 habría registrado el anual nuevo como mensual). Falta: el dueño cambia el precio del plan Anual en Hotmart (mismo plan/oferta foybda2j o uno nuevo → si cambia el código `off`, actualizar lib/hotmart/checkout.ts), y recién ahí merge a main + push.
- RUTA DE PRESENCIA (APROBADA y CONSTRUIDA 2026-10-04 — ver veredicto:progreso y Decisiones técnicas): vista-previa-progreso.html + docs/revisiones/vista-previa-progreso.png — nivel 1-10 por eje (Outfit/Postura/Actitud, nunca baja), Misión de la semana desde el eje más débil (+3 gemas), pestaña Historial→Progreso con "siguiente paso" por eje, detalle de eje con "Lo que más te sube" (frecuencia de ajustes en sus Checks), resumen mensual con reto del mes nuevo. Todo derivado de checks.resultado, sin IA extra.
- El usuario no es técnico. Explicar todo en simple. Decidir por él salvo gustos visuales/identidad y gastos.
- El documento fuente de la idea está en: C:\Users\Raul Valerio\Documents\Z Rentas Inteligentes\Resumen de mi idea para la App Niki.pdf — ya fue leído e incorporado a FICHA-AVATAR.md, no hace falta releerlo salvo para citar textual.

## Sesión 2026-09-25 (dominio + revisión formal de planes/onboarding)
- Dominio `holaniki.com` comprado (Namecheap) y en línea con SSL — ver "Servicios externos" punto 6.
- Paywall: veredicto revisor-visual LISTA (36/40 · 16/20 · copy 17/20) tras 9 pasadas — docs/revisiones/paywall-veredicto.md.
- Onboarding: veredicto revisor-visual LISTA (36/40 · 16/20 · copy 18/20) en la 9ª pasada — docs/revisiones/onboarding-veredicto.md. Mejoras menores anotadas en el veredicto (franja del botón a 667px, "ejes" en 05, espera en "Desbloquear").
- Corregido: promesa FALSA "tus fotos nunca se guardan" (landing, FAQ, onboarding, privacidad) → "son privadas, solo tú las ves"; landing mostraba trial en el Mensual (la prueba es solo Anual); voseo en páginas legales.
- Pendiente para Hotmart: configurar garantía de 7 días en el panel y recién ahí publicar el plazo; webhook en https://holaniki.com/api/hotmart/webhook (por construir).
