# ECONOMICS CERTIFICATION — Niki (61 Gate 6-7)

Auditoría: 2026-09-28. Supuestos rotulados como **[estimado]**; medidos como **[medido]**.

## Costo de IA por Check
- **[medido]** US$0.0101 por análisis real (3,855 tokens entrada / 240 salida, Claude Sonnet 5, 5.7 s) — tabla `ai_calls`, 2026-09-28.
- Precio del proveedor: Claude Sonnet 5 US$2 / US$10 por millón de tokens (entrada/salida) — referencia de la documentación de Anthropic vigente al 2026-09-28.
- Fotos inválidas también cuestan (~US$0.006) pero no descuentan Check; tope anti-abuso de 6 intentos/día.

## Uso por usuario (mes de 30 días)
| Escenario | Checks/mes | Costo IA/mes |
|---|---|---|
| Mediana **[estimado: 4-7 usos/semana, ESTADO.md]** | ~25 | US$0.25 |
| p95 **[estimado]**: tope de 3/día | 90 | US$0.91 |
| Heavy user / abuso (3 válidos + 3 inválidos al día) | 90 + 90 inválidos | ≈ US$1.45 |
| Prueba de 3 días (máximo) | 9 | US$0.09 |

## Margen por plan (por mes, en USD)
Comisión Hotmart **[estimado: ~10% + tarifa fija ≈ US$0.50 por cobro, doc 18 — confirmar en el primer extracto]**. Los impuestos (IVA) los paga el comprador encima del precio (checkout real, MX).

| Plan | Precio lista | Neto estimado/mes | IA p95 | IA heavy | Margen p95 | Margen heavy |
|---|---|---|---|---|---|---|
| Anual US$107.88 (US$8.99/mes efectivo) | 8.99 | ≈ 8.05 | 0.91 | 1.45 | ≈ US$7.14 (89%) | ≈ US$6.60 (82%) |
| Mensual US$14.99 | 14.99 | ≈ 12.99 | 0.91 | 1.45 | ≈ US$12.08 (93%) | ≈ US$11.54 (89%) |

Regla 30/02C (IA ≤ 20% del precio): **cumple** — p95 = 10% del Anual, 6% del Mensual.

## Costos fijos (no por usuario)
| Servicio | Plan hoy | Nota |
|---|---|---|
| Supabase | **Free** | sin respaldos automáticos; recomendado Pro US$25/mes antes de tráfico pagado |
| Vercel | Hobby | ⚠️ los términos de Vercel Hobby no permiten uso comercial → Pro US$20/mes al empezar a vender |
| Resend | Free (3,000 correos/mes) | suficiente para el piloto |
| Dominio | US$11.48/año | pagado |
| Anthropic | prepago US$5 + límite US$20/mes | topes en la app: US$5/día, US$50/mes |

Punto de equilibrio con Supabase Pro + Vercel Pro (US$45/mes): **≈ 6 suscriptores anuales** (US$7.14 de margen cada uno).

## Monedas
El ledger guarda `amount_minor` + `currency` tal como llega (MXN, USD…). El panel no mezcla monedas. **Sin conciliación con el extracto de Hotmart todavía** (no hay ventas reales).

## Veredicto
**Economía positiva en todos los escenarios medidos.** Pendiente confirmar la comisión real de Hotmart con el primer extracto.
