# Manual del dueño — Niki

Todo lo que necesitas para operar tu app sin depender de nadie. Escrito el 2026-09-28 · actualizado el 2026-10-06.

## 1. Tus cuentas (dónde vive cada pieza)
| Servicio | Para qué sirve | Dónde entras |
|---|---|---|
| **Vercel** | Publica tu app en internet (holaniki.com) | vercel.com → proyecto `niki` |
| **Supabase** | Guarda usuarios, fotos y resultados | supabase.com → proyecto `Niki` |
| **Anthropic** | La IA que analiza las fotos | console.anthropic.com |
| **Hotmart** | Cobra las suscripciones | app.hotmart.com → producto `niki` (8595742) |
| **Resend** | Manda los correos (código de acceso, aviso de fin de prueba) | resend.com |
| **Namecheap** | Tu dominio holaniki.com | namecheap.com |
| **GitHub** | Guarda el código; cada cambio se publica solo | github.com/raulvalerion-bit/Niki |

🔒 **Nunca pegues una clave en un chat.** Las claves viven solo en Vercel (marcadas "Sensitive") y en el archivo `.env.local` de tu computadora.

## 2. Tu panel privado
Entra a **holaniki.com/admin** con tu correo. Ahí ves:
- **Ventas**: pruebas, cobros, cancelaciones y reembolsos.
- **Uso**: cuántos Checks se hacen por día.
- **Salud**: errores de la app y **cuánto se gasta en IA** (hoy y en total).
- **Usuarios**: dar o quitar acceso a mano si Hotmart falla.

## 3. Tareas comunes
- **Un cliente dice que pagó y no puede entrar** → Panel → Usuarios → búscalo por correo → revisa su plan. Si Hotmart no avisó, dale el plan a mano y revisa Panel → Salud (avisos de Hotmart).
- **Un cliente pide reembolso** → hazlo desde Hotmart (Ventas → la venta → Reembolsar). Hotmart le quita el acceso a la app automáticamente.
- **Un cliente quiere borrar su cuenta** → él mismo puede: Perfil → "Eliminar mi cuenta". Recuérdale cancelar primero en Hotmart.
- **Cambiar el límite de Checks al día** → es un número en el código (`LIMITE_CHECKS_DIA` en `lib/ia/resultado.ts`) y en los textos de la página de ventas y de planes. Pídeselo al agente con `/precios`.
- **Subir el tope de gasto de IA** → Vercel → Settings → Environment Variables → `AI_DAILY_BUDGET_USD` (hoy 5) y `AI_MONTHLY_BUDGET_USD` (hoy 50) → luego vuelve a publicar (Deployments → Redeploy).
- **Apagar los análisis de IA de emergencia** (por ejemplo, si ves un gasto raro) → pon `AI_DAILY_BUDGET_USD` en **0** y vuelve a publicar. Los clientes ven un aviso amable de pausa y no se gasta un centavo más. Para reactivar, regrésalo a 5.

## 4. Si algo sale mal (mini manual de emergencias)
| Qué ves | Qué significa | Qué haces |
|---|---|---|
| Te llega un correo "Niki pausó los análisis" | Se llegó al tope de gasto de IA del día o del mes | Revisa Panel → Salud. Si son clientes reales, sube el tope (punto 3). Si parece raro, déjalo pausado y avísale al agente. |
| Los clientes ven "No pudimos analizar tu foto" muchas veces | La IA de Anthropic está caída o sin saldo | Revisa console.anthropic.com → Billing (saldo) y status.anthropic.com |
| La app no abre | Falla de publicación | Vercel → Deployments → elige la última versión que funcionaba → "Promote to Production" (vuelve atrás en 1 minuto) |
| Nadie recibe el código para entrar | Falla de correos | resend.com → Logs; revisa que el dominio siga verificado |
| Un cliente reclama un cobro | Disputa | Hotmart → la venta; si procede, reembolsa |

## 5. Costos mensuales hoy
- IA: ~1.1 centavos de dólar por Check (medido en 3 análisis reales). Máximo por cliente (3 Checks al día todo el mes): ~US$1.13 al mes.
- Supabase Pro (US$25/mes, con respaldos diarios) y Vercel Pro (US$20/mes): activos desde el 2026-09-28.
- Dominio: US$11.48 al año.

## 6. Qué NO tocar
- No cambies el producto de Hotmart ni sus ofertas sin avisar al agente: la app reconoce el producto `8595742` y los precios actuales.
- No borres variables en Vercel. Si una clave se filtra, crea una nueva en el servicio, cámbiala en Vercel y borra la vieja.
