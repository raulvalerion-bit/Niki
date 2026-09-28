# CLAIMS LEDGER — Niki (61 Gate 3)

Auditoría: 2026-09-28 · commit de referencia en `RELEASE-MANIFEST.json`.
Estado: **real** = existe y se probó · **corregido** = el texto se ajustó a lo real hoy · **❌ sin capacidad** = bloquea.

| Claim exacto | Superficie | Capacidad / ruta | Plan y límite | Prueba | Estado |
|---|---|---|---|---|---|
| "Revisa si tu outfit e imagen son las mejores en 30 segundos" | landing hero | `/api/check` (Claude Sonnet 5) | trial + pago | Llamada real 5.4-5.7 s (ai_calls, 2026-09-28) | real |
| "Niki analiza tu outfit, postura y actitud" | landing, paywall | `lib/ia/check-presencia.ts` (3 ejes) | trial + pago | Check real del dueño, 2026-09-28 | real |
| "sin críticas crueles" / "tono de coach" | landing, FAQ | prompt con límites (nunca cuerpo/cara, nunca cruel) | — | revisión del prompt + resultado real | real |
| "Recibes 3 ajustes, concretos, accionables" | landing Solución | ajuste clave + ajuste en cada eje | — | esquema `ResultadoIA` + resultado real | real |
| "Hasta 3 Checks de Presencia al día" / "3 Checks de Presencia al día (12 meses)" | landing Oferta, paywall | RPC `reservar_check` (límite 3/día, fecha local) | trial + pago | SQL: 3 ok, 4º "limite" (2026-09-28) | real |
| "Historial completo de tus Scans" | landing Oferta | `/app/historial` + `/app/historial/[id]` | trial + pago | render + RLS | real |
| "Modo Alto Impacto para entrevistas, citas y reuniones" / "…para tus eventos" / "…para tu cita o entrevista" | landing Oferta (stack $39 + features), paywall beneficios | **no existe** una función con ese nombre (el Check ya elige ocasión, pero no hay "modo") | — | búsqueda en código: solo aparece en el copy | **❌ sin capacidad** |
| "Racha Glow-Up de 21 días" / "Racha Glow-Up y seguimiento de hábitos" / "Tu Racha Glow-Up de 21 días, completa" | landing Oferta (stack $27), paywall | `/app/habitos` es un tracker semanal; **no hay racha de 21 días** | — | lectura de `app/app/habitos/page.tsx` | **❌ sin capacidad** |
| "Tus fotos son privadas: solo tú las ves" | landing, FAQ, privacidad | bucket privado `checks-fotos`, RLS por carpeta | — | prueba IDOR SQL: B ve 0 fotos de A | real |
| "no se usan para entrenar nada" | FAQ, privacidad | Anthropic API no entrena con datos de la API | — | política pública del proveedor | real |
| "Garantía del Primer Ajuste Honesto… escribes un correo y te devolvemos todo" | landing Garantía, PS | reembolso vía Hotmart (7 días, panel) + correo `hola@holaniki.com` | — | ⚠️ el buzón `hola@holaniki.com` **todavía no recibe correos** | **❌ canal roto** |
| "Respaldada por la garantía Hotmart de 7 días" | landing | garantía 7 días configurada en el panel | — | panel Hotmart (2026-09-27) | real |
| "Trial VIP de 3 días" / "Empezar mi prueba gratis de 3 días" | landing, paywall | oferta Anual con prueba de 3 días en Hotmart | Anual | compra real 2026-09-27 → trialing | real |
| "Se cobra hoy, sin prueba gratis" (Mensual) | landing, paywall | oferta Mensual sin prueba | Mensual | panel Hotmart | real |
| "Cancelas cuando quieras" / "cancelas gratis desde Hotmart" | landing, paywall | portal del comprador de Hotmart + enlace en Perfil | — | cancelación real 2026-09-27 | real |
| "Te avisamos un día antes" (correo pre-cobro) | paywall pasos | cron `/api/cron/aviso-prueba` + Resend | Anual trial | correo real recibido 2026-09-27 | real |
| "Hacer mi Check de Presencia gratis" | landing CTA | lleva a onboarding → planes; el Check requiere prueba (con tarjeta) | — | recorrido | ⚠️ "gratis" = prueba de 3 días con tarjeta; aceptable pero revisar en test de estreno |
| "¿Me va a destrozar con una nota cruel? Nunca. Ves tu puntaje…" | FAQ | resultado muestra puntaje /10 | — | — | corregido 2026-09-28 (antes decía "no pone notas") |
| "El pago se procesa por Hotmart… con tarjeta de débito o crédito" | FAQ | checkout real | — | checkout real 2026-09-27 | corregido 2026-09-28 (antes "métodos locales / cuotas") |
| Capturas "Así se ve tu Check de Presencia" | landing hero + carrusel | pantallas reales de la app con datos de ejemplo | — | `public/capturas/*.jpg` | corregido 2026-09-28 (antes placeholders) |

## Bloqueantes de este ledger
1. **Modo Alto Impacto** — construirlo o quitarlo del copy (landing + paywall). Decisión del dueño.
2. **Racha Glow-Up de 21 días** — construirla o quitarla del copy (landing + paywall). Decisión del dueño.
3. **Buzón hola@holaniki.com** — activar el reenvío en Namecheap (acción del dueño, gratis).
