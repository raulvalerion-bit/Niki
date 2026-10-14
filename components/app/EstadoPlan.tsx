'use client';

// PUENTE DE LA PRUEBA en la pantalla Hoy (02C "EL PUENTE DEL TRIAL"):
// · En prueba: etiqueta discreta "Día X de 3" (nunca un conteo rojo) que abre un panel con lo
//   que ya construyó, lo que incluye VIP Pro, la fecha y el monto exactos del cobro y
//   "Cancelar mi prueba" en un toque.
// · Recién pagado: tarjeta "¡Ya eres VIP Pro!" una sola vez — el cobro se siente como subir de
//   nivel, no como un cargo.
// Solo lee el perfil propio (RLS); el estado lo escribe el servidor con el webhook de Hotmart.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CalendarClock, Camera, ChevronRight, Flame, Gift, Route, Sparkles, Target, Trophy, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { registrarEvento } from '@/lib/eventos';
import { DIAS_PRUEBA, PRECIO_ANUAL, diaDePrueba, muestraBienvenidaPro } from '@/lib/prueba';
import { URL_PAGO_HOTMART } from '@/lib/dunning';

const CLAVE_BIENVENIDA = 'niki_bienvenida_pro_vista';

const INCLUYE: { icon: LucideIcon; texto: string }[] = [
  { icon: Camera, texto: '3 Checks de Presencia al día' },
  { icon: Route, texto: 'Tu Ruta de Presencia por eje' },
  { icon: Target, texto: 'La misión de cada semana' },
  { icon: Flame, texto: 'Tu Racha Glow-Up de 21 días' },
];

type Estado =
  | { tipo: 'prueba'; userId: string; dia: number; fin: Date; checks: number; mejor: number | null; racha: number }
  | { tipo: 'bienvenida'; userId: string }
  | null;

function fechaLarga(d: Date) {
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
}

function Chip({ icon: Icono }: { icon: LucideIcon }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[var(--chip-bg)] text-[var(--accent)]">
      <Icono size={20} aria-hidden="true" />
    </span>
  );
}

export function EstadoPlan() {
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<Estado>(null);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    let activo = true;
    (async () => {
      const supabase = crearClienteSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase
        .from('profiles')
        .select('suscripcion_estado, trial_ends_at, first_paid_at, racha_dias')
        .eq('id', user.id)
        .single();
      if (!activo || !p) return;
      const ahora = new Date();

      if (p.suscripcion_estado === 'trialing' && p.trial_ends_at) {
        const { data: checks } = await supabase
          .from('checks')
          .select('puntaje')
          .eq('user_id', user.id)
          .eq('estado', 'listo')
          .limit(200);
        if (!activo) return;
        const puntajes = (checks ?? []).map((c) => Number(c.puntaje)).filter((n) => Number.isFinite(n));
        const fin = new Date(p.trial_ends_at);
        setEstado({
          tipo: 'prueba',
          userId: user.id,
          dia: diaDePrueba(fin, ahora),
          fin,
          checks: puntajes.length,
          mejor: puntajes.length ? Math.max(...puntajes) : null,
          racha: p.racha_dias ?? 0,
        });
        return;
      }

      let vista = false;
      try {
        vista = localStorage.getItem(CLAVE_BIENVENIDA) === '1';
      } catch {
        /* sin storage: se muestra en esta visita */
      }
      if (p.suscripcion_estado === 'active' && !vista && muestraBienvenidaPro(p.first_paid_at ? new Date(p.first_paid_at) : null, ahora)) {
        setEstado({ tipo: 'bienvenida', userId: user.id });
        registrarEvento(supabase, 'bienvenida_pro_vista', user.id);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  if (!estado) return null;

  if (estado.tipo === 'bienvenida') {
    const cerrar = () => {
      try {
        localStorage.setItem(CLAVE_BIENVENIDA, '1');
      } catch {
        /* no crítico */
      }
      setEstado(null);
    };
    return (
      <motion.section
        aria-labelledby="titulo-bienvenida-pro"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
      >
        <div className="flex items-center gap-3">
          <motion.span
            initial={reduce ? false : { scale: 0.6, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
            className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-[var(--accent)] text-[var(--bg)]"
          >
            <Trophy size={24} aria-hidden="true" />
          </motion.span>
          <div className="min-w-0">
            <h2 id="titulo-bienvenida-pro" className="text-xl font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
              ¡Ya eres <span className="text-[var(--accent)]">VIP Pro</span>!
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Gracias por quedarte. Todo esto sigue contigo:</p>
          </div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {INCLUYE.map(({ icon: Icono, texto }) => (
            <li key={texto} className="flex items-center gap-2 rounded-[12px] bg-[var(--chip-bg)] p-2 text-sm font-medium text-[var(--text-primary)]">
              <Icono size={16} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
              <span className="min-w-0">{texto}</span>
            </li>
          ))}
        </ul>
        <motion.button
          type="button"
          whileTap={reduce ? undefined : { scale: 0.97 }}
          onClick={cerrar}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-base font-semibold text-[var(--accent)] [touch-action:manipulation]"
        >
          ¡Vamos!
        </motion.button>
      </motion.section>
    );
  }

  const { dia, fin, checks, mejor, racha, userId } = estado;
  const abrir = () => {
    setAbierto(true);
    registrarEvento(crearClienteSupabase(), 'prueba_panel_abierto', userId, { dia });
  };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        className="mb-4 flex h-12 w-full items-center gap-2 rounded-full bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text-secondary)] shadow-[var(--shadow-2)] [touch-action:manipulation]"
      >
        <Gift size={16} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
        <span className="min-w-0 flex-1 text-left">
          <span className="font-semibold text-[var(--text-primary)]">
            Día {dia} de {DIAS_PRUEBA}
          </span>{' '}
          de tu prueba gratis
        </span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fixed inset-0 z-40 flex items-end justify-center bg-[color-mix(in_oklab,var(--text-primary)_40%,transparent)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={() => setAbierto(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-prueba"
              className="max-h-[90dvh] w-full max-w-120 overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 shadow-[var(--shadow-2)] [font-family:var(--font-body)]"
              initial={{ y: reduce ? 0 : 40 }}
              animate={{ y: 0 }}
              exit={{ y: reduce ? 0 : 40 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                // Escape cierra; Tab queda atrapado entre los controles del panel.
                if (e.key === 'Escape') {
                  setAbierto(false);
                  return;
                }
                if (e.key !== 'Tab') return;
                const focos = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, a[href]'));
                const primero = focos[0];
                const ultimo = focos[focos.length - 1];
                if (e.shiftKey && document.activeElement === primero) {
                  e.preventDefault();
                  ultimo?.focus();
                } else if (!e.shiftKey && document.activeElement === ultimo) {
                  e.preventDefault();
                  primero?.focus();
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Día {dia} de {DIAS_PRUEBA} · Prueba gratis
                  </p>
                  <h2 id="titulo-prueba" className="mt-1 text-xl font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
                    Lo que ya <span className="text-[var(--accent)]">construiste</span>
                  </h2>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar"
                  className="grid size-12 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--chip-bg)]"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { valor: String(checks), label: checks === 1 ? 'Check' : 'Checks' },
                  { valor: mejor === null ? '—' : mejor.toFixed(1), label: 'Mejor puntaje' },
                  { valor: String(racha), label: racha === 1 ? 'Día de racha' : 'Días de racha' },
                ].map((d) => (
                  <div key={d.label} className="flex flex-col-reverse rounded-[12px] bg-[var(--chip-bg)] px-2 py-3">
                    <dt className="mt-1 text-xs font-medium text-[var(--text-secondary)]">{d.label}</dt>
                    <dd className="text-2xl font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{d.valor}</dd>
                  </div>
                ))}
              </dl>
              {checks === 0 && (
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Haz tu primer Check hoy: en 30 segundos sabes qué ajustar.</p>
              )}

              <h3 className="mt-6 text-base font-semibold text-[var(--text-primary)]">Lo que incluye VIP Pro</h3>
              <ul className="mt-2 space-y-2">
                {INCLUYE.map(({ icon, texto }) => (
                  <li key={texto} className="flex items-center gap-3 text-base text-[var(--text-primary)]">
                    <Chip icon={icon} />
                    {texto}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex gap-3 rounded-[12px] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] p-4">
                <CalendarClock size={20} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <p className="min-w-0 text-sm leading-snug text-[var(--text-primary)]">
                  El <strong>{fechaLarga(fin)}</strong> Hotmart cobra el plan Anual: <strong>{PRECIO_ANUAL}</strong> (más los
                  impuestos de tu país). Si te quedas, no tienes que hacer nada.
                </p>
              </div>

              <a
                href={URL_PAGO_HOTMART}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento(crearClienteSupabase(), 'prueba_cancelar_click', userId, { dia })}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] text-base font-semibold text-[var(--text-secondary)] underline underline-offset-2"
              >
                Cancelar mi prueba en Hotmart
              </a>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-[var(--text-secondary)]">
                <Sparkles size={12} aria-hidden="true" />
                Si cancelas antes del cobro, no se te cobra nada.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
