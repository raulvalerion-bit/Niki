// GASTOS — inversión inicial y costos fijos del negocio (pedido del dueño,
// 2026-09-28). La tabla `costos_operacion` la llena el dueño desde aquí; el
// gasto de IA del mes es REAL (se suma de ai_calls). Todo en USD.

import { Wallet, CalendarClock, Cpu, Target } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { AdminCard, Badge, SectionTitle, SinDatos, StatCard, TablaContenedor } from '@/components/admin/ui';
import { Reveal } from '@/components/admin/reveal';
import { AccionesCosto, FormularioCosto } from '@/components/admin/gastos-client';

type Costo = {
  id: string;
  concepto: string;
  servicio: string;
  monto_usd: number;
  frecuencia: 'unico' | 'mensual' | 'anual';
  estado: 'pagado' | 'pendiente';
  recuperable: boolean;
  fecha_pago: string | null;
  notas: string | null;
};

// Margen por cliente del plan Anual (US$4.99/mes desde 2026-10-04, menos comisión estimada de
// Hotmart y el uso de IA p95) — docs/release/ECONOMICS-CERTIFICATION.md.
const MARGEN_CLIENTE_ANUAL = 3.54;

const FRECUENCIA: Record<Costo['frecuencia'], string> = { unico: 'Una vez', mensual: 'Cada mes', anual: 'Cada año' };

const usd = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const OTRA_APP: { servicio: string; sirve: string; extra: string }[] = [
  { servicio: 'Vercel Pro', sirve: 'Sí: publica varias apps en la misma cuenta', extra: '$0 (mientras no pases los límites de uso)' },
  { servicio: 'Supabase Pro', sirve: 'En parte: cada app necesita su propia base de datos', extra: '≈ $10 al mes por app' },
  { servicio: 'Anthropic (IA)', sirve: 'Sí: misma cuenta, otra clave por app', extra: 'Solo lo que use cada app' },
  { servicio: 'Resend (correos)', sirve: 'El plan gratis permite 1 solo dominio', extra: '≈ $20 al mes (plan con varios dominios)' },
  { servicio: 'Dominio', sirve: 'No: cada app necesita el suyo', extra: '≈ $11 al año' },
  { servicio: 'Hotmart y GitHub', sirve: 'Sí: otro producto / otro repositorio', extra: '$0' },
];

export default async function AdminGastos() {
  const supabase = await crearClienteSupabaseServidor();
  const inicioMes = new Date();
  inicioMes.setUTCDate(1);
  inicioMes.setUTCHours(0, 0, 0, 0);

  const [{ data: filas, error }, { data: llamadas }] = await Promise.all([
    supabase.from('costos_operacion').select('*').order('created_at', { ascending: true }),
    supabase.from('ai_calls').select('cost_usd').gte('created_at', inicioMes.toISOString()),
  ]);
  const costos = (filas ?? []).map((c) => ({ ...c, monto_usd: Number(c.monto_usd) })) as Costo[];
  const iaMes = (llamadas ?? []).reduce((acc, l) => acc + (Number(l.cost_usd) || 0), 0);

  // Inversión inicial: lo único (sin lo que se recupera) + el primer cobro de lo recurrente.
  const inicial = costos.filter((c) => !c.recuperable);
  const inicialPagado = inicial.filter((c) => c.estado === 'pagado').reduce((a, c) => a + c.monto_usd, 0);
  const inicialFalta = inicial.filter((c) => c.estado === 'pendiente').reduce((a, c) => a + c.monto_usd, 0);
  const recuperable = costos.filter((c) => c.recuperable).reduce((a, c) => a + c.monto_usd, 0);

  const mensualDe = (c: Costo) => (c.frecuencia === 'mensual' ? c.monto_usd : c.frecuencia === 'anual' ? c.monto_usd / 12 : 0);
  const fijoMensual = costos.reduce((a, c) => a + mensualDe(c), 0);
  const equilibrio = Math.ceil((fijoMensual + iaMes) / MARGEN_CLIENTE_ANUAL);

  return (
    <div>
      <SectionTitle subtitulo="Lo que invertiste y lo que cuesta mantener tu app cada mes (en dólares)">Gastos</SectionTitle>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal delay={0}>
          <StatCard
            label="Inversión inicial"
            value={usd(inicialPagado + inicialFalta)}
            insight={`Pagado ${usd(inicialPagado)} · falta ${usd(inicialFalta)}${recuperable > 0 ? ` · + ${usd(recuperable)} que regresan` : ''}`}
            icon={<Wallet size={20} strokeWidth={2} color="var(--accent)" />}
          />
        </Reveal>
        <Reveal delay={0.06}>
          <StatCard
            label="Gasto fijo al mes"
            value={usd(fijoMensual)}
            insight="Suma de lo mensual + lo anual dividido entre 12"
            icon={<CalendarClock size={20} strokeWidth={2} color="var(--accent)" />}
            destacada
          />
        </Reveal>
        <Reveal delay={0.12}>
          <StatCard
            label="IA este mes (real)"
            value={usd(iaMes)}
            insight="Se suma sola con cada Check"
            icon={<Cpu size={20} strokeWidth={2} color="var(--accent)" />}
          />
        </Reveal>
        <Reveal delay={0.18}>
          <StatCard
            label="Clientes para cubrir gastos"
            value={`${equilibrio}`}
            insight={`del plan Anual (≈ ${usd(MARGEN_CLIENTE_ANUAL)} de ganancia cada uno)`}
            icon={<Target size={20} strokeWidth={2} color="var(--accent)" />}
          />
        </Reveal>
      </div>

      <div className="mt-8">
        <SectionTitle subtitulo="Marca cada gasto como pagado cuando lo pagues; los totales se actualizan solos">Tus gastos</SectionTitle>
        <FormularioCosto />

        {error ? (
          <SinDatos motivo="No pudimos leer tus gastos. Recarga la página." />
        ) : costos.length === 0 ? (
          <SinDatos motivo="Todavía no anotaste ningún gasto." />
        ) : (
          <TablaContenedor>
            <thead>
              <tr className="border-b border-[var(--border-default)] text-xs text-[var(--text-tertiary)]">
                <th scope="col" className="px-4 py-3 font-medium">Concepto</th>
                <th scope="col" className="px-4 py-3 font-medium">Frecuencia</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Monto</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Al mes</th>
                <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {costos.map((c) => (
                <tr key={c.id} className="border-b border-[var(--border-default)] align-top last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text-primary)]">{c.concepto}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {c.servicio}
                      {c.notas ? ` · ${c.notas}` : ''}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{FRECUENCIA[c.frecuencia]}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--text-primary)]">{c.monto_usd === 0 ? 'Gratis' : usd(c.monto_usd)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">{mensualDe(c) > 0 ? usd(mensualDe(c)) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <Badge tono={c.estado === 'pagado' ? 'positivo' : 'atencion'}>{c.estado === 'pagado' ? 'Pagado' : 'Pendiente'}</Badge>
                      {c.recuperable && <span className="text-xs text-[var(--text-tertiary)]">Se recupera</span>}
                      {c.fecha_pago && (
                        <span className="text-xs text-[var(--text-tertiary)]">{new Date(`${c.fecha_pago}T12:00:00`).toLocaleDateString('es-MX')}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AccionesCosto id={c.id} estado={c.estado} concepto={c.concepto} />
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaContenedor>
        )}
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">
          Hotmart no cobra mensualidad: se queda con una comisión de cada venta (≈ 10% + una tarifa fija), que ya está descontada en la ganancia por cliente.
        </p>
      </div>

      <div className="mt-8">
        <SectionTitle subtitulo="Qué puedes reutilizar y qué costaría de más">Si haces otra app</SectionTitle>
        <AdminCard>
          <ul className="divide-y divide-[var(--border-default)]">
            {OTRA_APP.map((f) => (
              <li key={f.servicio} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-[var(--text-primary)]">{f.servicio}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{f.sirve}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-[var(--accent)]">{f.extra}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Con una segunda app, tus gastos fijos quedarían en ≈ $77 al mes para las dos juntas. Precios de referencia a septiembre de 2026:
            confírmalos en cada servicio antes de pagar.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
