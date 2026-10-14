'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CreditCard, ExternalLink } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { DIAS_GRACIA_ATRASO, URL_PAGO_HOTMART, diaLimite } from '@/lib/dunning';

/**
 * Aviso de cobro fallido (dunning, 58): NO bloquea nada, solo aparece arriba mientras la
 * suscripción está en past_due y desaparece cuando Hotmart confirma el pago (estado active).
 * El estado lo escribe solo el servidor (webhook + RLS); aquí únicamente se lee.
 */
export function AvisoCobro() {
  const reducir = useReducedMotion();
  const [limite, setLimite] = useState<Date | null>(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      const supabase = crearClienteSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('suscripcion_estado, past_due_desde')
        .eq('id', user.id)
        .single();
      if (activo && data?.suscripcion_estado === 'past_due' && data.past_due_desde) {
        setLimite(diaLimite(new Date(data.past_due_desde), DIAS_GRACIA_ATRASO));
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  const fecha = limite?.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });

  return (
    <AnimatePresence>
      {limite && (
        <motion.aside
          role="status"
          initial={reducir ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-4 flex gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[var(--chip-bg)] text-[var(--accent)]">
            <CreditCard size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold leading-snug text-[var(--text-primary)]">No pudimos cobrar tu renovación</p>
            <p className="mt-1 text-sm leading-snug text-[var(--text-secondary)]">
              Actualiza tu pago en Hotmart para no perder tu racha. Tienes todo hasta el {fecha}.
            </p>
            <a
              href={URL_PAGO_HOTMART}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-12 items-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] px-4 text-base font-semibold text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--chip-bg)] [touch-action:manipulation]"
            >
              Actualizar mi pago
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
