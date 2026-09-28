-- Costos de operación del negocio (21-BACKOFFICE + 40-UNIT-ECONOMICS) —
-- 2026-09-28, pedido del dueño: llevar en el panel la inversión inicial y los
-- gastos fijos (servicios, dominio, pruebas) en vez de una hoja aparte.
-- Tabla 100% admin: solo el dueño la ve y la edita.

create table public.costos_operacion (
  id uuid primary key default gen_random_uuid(),
  concepto text not null check (char_length(concepto) between 1 and 120),
  servicio text not null check (char_length(servicio) between 1 and 60),
  monto_usd numeric(10, 2) not null check (monto_usd >= 0),
  frecuencia text not null check (frecuencia in ('unico', 'mensual', 'anual')),
  estado text not null default 'pendiente' check (estado in ('pagado', 'pendiente')),
  recuperable boolean not null default false,
  fecha_pago date,
  notas text check (notas is null or char_length(notas) <= 240),
  created_at timestamptz not null default now()
);

create index costos_operacion_created_idx on public.costos_operacion(created_at);

alter table public.costos_operacion enable row level security;

create policy "costos_operacion_admin_all" on public.costos_operacion
  for all using ((select private.es_admin())) with check ((select private.es_admin()));

-- Lo que ya se sabe al 2026-09-28 (el dueño lo ajusta desde el panel).
insert into public.costos_operacion (concepto, servicio, monto_usd, frecuencia, estado, recuperable, fecha_pago, notas) values
  ('Dominio holaniki.com', 'Namecheap', 11.48, 'anual', 'pagado', false, '2026-09-25', 'Se renueva solo cada año'),
  ('Saldo de la IA', 'Anthropic', 5.00, 'unico', 'pagado', false, '2026-09-28', 'Prepago; se gasta ~US$0.01 por Check'),
  ('Base de datos con respaldos (plan Pro)', 'Supabase', 25.00, 'mensual', 'pendiente', false, null, 'Necesario antes de vender (respaldos)'),
  ('Publicación de la app (plan Pro)', 'Vercel', 20.00, 'mensual', 'pendiente', false, null, 'El plan gratis no permite uso comercial'),
  ('Compra de prueba del plan Mensual', 'Hotmart', 14.99, 'unico', 'pendiente', true, null, 'Se reembolsa dentro de la garantía de 7 días'),
  ('Correos (código de acceso, avisos)', 'Resend', 0.00, 'mensual', 'pagado', false, null, 'Gratis hasta 3,000 correos al mes'),
  ('Correo hola@holaniki.com (reenvío)', 'Namecheap', 0.00, 'mensual', 'pendiente', false, null, 'Gratis; falta activarlo');
