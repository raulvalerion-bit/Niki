# PAYMENT CERTIFICATION — Niki (61 Gate 2)

Auditoría: 2026-09-28 · Proveedor: Hotmart (producto 8595742) · Webhook: `https://holaniki.com/api/hotmart/webhook` (v2.0.0)

## Controles implementados
| Control | Dónde | Evidencia |
|---|---|---|
| Autenticidad (hottok en tiempo constante, fail-secure si falta) | `app/api/hotmart/webhook/route.ts` | "Enviar prueba" de Hotmart OK (8 eventos, 2026-09-27) |
| Frescura / anti-replay (>30 días o fecha futura → ignorar) | `lib/hotmart/evento.ts` `decidir()` | `tests/hotmart.test.ts` "aviso de hace más de 30 días" |
| Catálogo allowlisted (producto + importe USD ≤ 110) | `decidir()` | tests "producto ajeno", "importe fuera del catálogo" |
| Dedupe técnico por `event_id` | `processed_events` + RPC `apply_hotmart_event` | 9 eventos simulados (ESTADO.md, 2026-09-27) |
| Ledger económico `provider + transaction_id + economic_kind` único, dinero en `amount_minor` + ISO 4217 | `payment_transactions` | test "compra pagada anual… centavos"; APPROVED+COMPLETE sin doble ingreso (simulación) |
| Estados separados trialing / active / past_due / cancelled / expired / refunded / chargeback | `decidir()` + `profiles.suscripcion_estado` | 10 pruebas automáticas (CI verde) |
| Gating en servidor | `lib/acceso.ts` + middleware + `/api/check` | `tests/acceso.test.ts` (7) |

## Matriz real
| Caso | Estado | Evidencia |
|---|---|---|
| Trial anual: día 0 → acceso | ✅ VERIFICADO REAL | compra HP0454215247, 2026-09-27 → trialing, login → /app |
| Trial anual: aviso pre-cobro | ✅ VERIFICADO REAL | correo recibido por el dueño, 2026-09-27 |
| Trial anual: primer cobro al terminar la prueba | ⛔ NO VERIFICADO | la prueba de test se canceló; se verifica con el primer cliente real |
| Trial mensual | N/A justificado | el Mensual no tiene prueba (decisión de producto, 2026-09-18) |
| Compra mensual pagada → acceso | ⛔ NO VERIFICADO REAL | solo simulado; requiere una compra real de US$14.99 |
| Cancelación durante trial → sin cobro, acceso hasta fin | ✅ VERIFICADO REAL | SUBSCRIPTION_CANCELLATION 2026-09-27 |
| Cancelación de plan pagado → acceso hasta fin de periodo | ⚠️ simulado + test | sin evento real |
| Pago rechazado → past_due → gracia → recuperación | ⚠️ simulado + test | sin evento real; **no hay correos de dunning** (58) |
| Reenvío del mismo event_id | ✅ simulado | `processed_events` |
| APPROVED + COMPLETE → un solo ingreso | ✅ simulado | ledger único por transaction+kind |
| Producto/oferta/importe ajeno → rechazado | ✅ test + "Enviar prueba" | producto 0 → "sin efecto" |
| Fallo después del webhook → retry completa acceso | ⚠️ parcial | Hotmart reintenta si no hay 200; no probado forzando fallo |
| Reembolso y contracargo | ⚠️ simulado + test | sin evento real |
| Compra con email distinto al de la cuenta | ⚠️ | crea cuenta con el correo de Hotmart; no hay reconciliación visible |
| Reconciliación semanal de entitlements | ❌ NO EXISTE | job pendiente (18) |

## Veredicto de pagos
**NO CERTIFICADO todavía.** Lo implementado es sólido y está probado en código; faltan pruebas reales que cuestan dinero (compra mensual + reembolso dentro de la garantía) y el job de reconciliación. Ninguna prueba real se hizo sin autorización del dueño.
