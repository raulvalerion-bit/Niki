# PRIVACY DATA MAP — Niki (61 Gate 4 + 47)

Auditoría: 2026-09-28. Responsable: Raúl Valerio Nebradt (México).

| Dato | Dónde vive | Finalidad | Base | Retención | Quién accede | Borrado |
|---|---|---|---|---|---|---|
| Correo | Supabase Auth + `profiles.email` | acceso con código, avisos de cuenta | contrato | mientras exista la cuenta | el usuario; admin (panel) | "Eliminar mi cuenta" (Perfil) → borra Auth + cascada |
| Respuestas del onboarding (objetivo, dolor, ocasión, ritmo) | `profiles` | personalizar el análisis | contrato | cuenta | usuario; admin | cascada |
| Fotos de cuerpo entero | Storage `checks-fotos` (privado, carpeta = user_id) | análisis del Check + historial | contrato | cuenta | solo el usuario (RLS); servidor con clave de servicio | "Eliminar mi cuenta" borra la carpeta — **probado E2E 2026-09-28** |
| Resultado del Check (notas, comentarios) | `checks` | historial | contrato | cuenta | usuario (RLS) | cascada |
| Foto enviada a Anthropic | procesamiento en tránsito (API) | generar el análisis | encargado | según política de Anthropic para la API (no entrena con datos de la API) | Anthropic | fuera de nuestro control directo; declarado en /privacidad |
| Gemas, hábitos | `profiles`, `habito_registros` | progreso | contrato | cuenta | usuario | cascada |
| Eventos de uso | `event_log` | métricas del negocio | interés legítimo | indefinida (sin datos personales en metadata) | admin | `user_id` → null al borrar |
| Llamadas a la IA (tokens, costo) | `ai_calls` | control de gasto | interés legítimo | indefinida | admin | `user_id` → null |
| Pagos (transacción, importe, moneda) | `payment_transactions` | contabilidad | obligación legal | según ley fiscal | admin | `user_id` → null (se conserva el registro contable) |
| Suscripción Hotmart (código, estado) | `profiles` | acceso | contrato | cuenta | admin | cascada (Hotmart conserva lo suyo) |

## Consentimiento y menores
- No se piden datos sensibles explícitos; la foto es necesaria para el servicio (se explica en onboarding, /privacidad y /aviso-ia).
- Menores: la IA marca "menor_de_edad" y NO analiza; los términos piden no usar Niki con menores. **No hay verificación de edad al registrarse** (⚠️ revisar con asesoría legal si se promociona a <18).
- Consentimiento de marketing: no se envían correos de marketing todavía.

## Exportación
⚠️ No hay botón de "descargar mis datos"; se atiende por correo (hola@holaniki.com — **buzón aún sin activar**).
