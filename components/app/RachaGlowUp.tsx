'use client';

// RACHA GLOW-UP DE 21 DÍAS (24 MECÁNICA 1 + 56 M0/M4). Tarjeta que se ve en
// Hoy y en Hábitos. El número lo calcula SOLO el servidor (finalizar_check);
// aquí solo se lee y se interpreta el estado del día:
//   · hecho hoy      → llama encendida (acento)
//   · en riesgo      → llama apagada, sin rojo ni pánico ("sigue viva")
//   · se salvará     → avisa que un congelador la cuida
//   · terminó        → reencuadre sin culpa + récord que no se pierde

import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { animate, motion, useReducedMotion } from 'motion/react';
import { Flame, Snowflake, Trophy } from 'lucide-react';
import { META_GLOWUP } from '@/lib/ia/resultado';

export type EstadoRacha = {
  racha_dias: number;
  racha_ultima_fecha: string | null;
  racha_mejor: number;
  congeladores: number;
  glowup_completado_at: string | null;
};

function diasEntre(desde: string, hasta: string) {
  return Math.round((Date.parse(hasta) - Date.parse(desde)) / 86_400_000);
}

export function interpretarRacha(e: EstadoRacha, hoy: string) {
  if (!e.racha_ultima_fecha || e.racha_dias === 0) return { tipo: 'nueva' as const, dias: 0 };
  const desde = diasEntre(e.racha_ultima_fecha, hoy);
  if (desde <= 0) return { tipo: 'hecha' as const, dias: e.racha_dias };
  if (desde === 1) return { tipo: 'riesgo' as const, dias: e.racha_dias };
  const perdidos = desde - 1;
  if (perdidos <= e.congeladores) return { tipo: 'congelada' as const, dias: e.racha_dias, perdidos };
  return { tipo: 'terminada' as const, dias: e.racha_dias };
}

export function RachaGlowUp({ estado, hoy }: { estado: EstadoRacha; hoy: string }) {
  const reduce = useReducedMotion();
  const r = interpretarRacha(estado, hoy);
  const completo = !!estado.glowup_completado_at;
  const viva = r.tipo === 'hecha' || r.tipo === 'riesgo' || r.tipo === 'congelada';
  const diasVisibles = viva ? r.dias : 0;
  const llenos = Math.min(diasVisibles, META_GLOWUP);
  const encendida = r.tipo === 'hecha';
  // El día que toca hoy (si la racha sigue viva y aún no se hizo el Check).
  const indiceHoy = viva && !encendida && diasVisibles < META_GLOWUP ? diasVisibles : -1;

  // El número del día cuenta al cargar (baseline de animación: conteo del número héroe).
  const [mostrado, setMostrado] = useState(reduce ? diasVisibles : 0);
  const [explicar, setExplicar] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const c = animate(0, diasVisibles, { duration: 0.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setMostrado(Math.round(v)) });
    return () => c.stop();
  }, [diasVisibles, reduce]);

  const titulo =
    r.tipo === 'nueva'
      ? 'Tu Racha Glow-Up empieza hoy'
      : r.tipo === 'terminada'
        ? 'Empieza una racha nueva'
        : completo
          ? `Día ${mostrado} · Glow-Up completo`
          : `Día ${mostrado} de ${META_GLOWUP}`;

  const detalle =
    r.tipo === 'nueva'
      ? '21 días seguidos haciendo tu Check. Tu primer Check de hoy es el día 1.'
      : r.tipo === 'hecha'
        ? completo
          ? 'Ya completaste tu Glow-Up. Cada día que sigues suma a tu récord.'
          : `Hoy ya cuenta. ${META_GLOWUP - llenos === 0 ? '¡Llegaste a la meta!' : `Te faltan ${META_GLOWUP - llenos} para tu Glow-Up.`}`
        : r.tipo === 'riesgo'
          ? `Tu racha sigue viva: con tu Check de hoy llegas al día ${r.dias + 1}.`
          : r.tipo === 'congelada'
            ? `Un congelador cuidará tu racha de ${r.dias} ${r.dias === 1 ? 'día' : 'días'} cuando hagas tu Check de hoy.`
            : `Tu racha anterior terminó, pero tu récord de ${estado.racha_mejor} ${estado.racha_mejor === 1 ? 'día' : 'días'} se queda contigo. Tu próximo Check es el día 1.`;

  return (
    <section
      aria-label="Racha Glow-Up"
      className="w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]"
    >
      <div className="flex items-center gap-3">
        <motion.span
          animate={!encendida && viva && !reduce ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
          transition={!encendida && viva && !reduce ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
          className={`flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] ${
            encendida ? 'bg-[var(--accent)]' : 'bg-[var(--surface-2)]'
          }`}
        >
          <Flame
            size={18}
            color={encendida ? 'var(--bg)' : 'var(--text-secondary)'}
            fill={encendida ? 'var(--bg)' : 'none'}
            aria-hidden="true"
          />
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">Racha Glow-Up</p>
          <p className="text-[15px] font-bold leading-[1.3] text-[var(--text-primary)]">{titulo}</p>
        </div>
        {completo && <Trophy size={20} color="var(--accent)" aria-label="Glow-Up completo" />}
      </div>

      {/* 21 días: 3 filas de 7. Lleno = día cumplido. */}
      <div className="mx-auto mt-3 grid w-fit grid-cols-7 gap-2.5" role="img" aria-label={`${llenos} de ${META_GLOWUP} días completados`}>
        {Array.from({ length: META_GLOWUP }, (_, i) => {
          const lleno = i < llenos;
          return (
            <motion.span
              key={i}
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: reduce ? 0 : i * 0.02 }}
              className={`size-5 rounded-full ${
                lleno
                  ? 'bg-[var(--accent)]'
                  : i === indiceHoy
                    ? 'border-2 border-[var(--accent)] bg-[var(--chip-bg)]'
                    : 'border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)]'
              }`}
            />
          );
        })}
      </div>

      <p className="mt-3 text-[15px] leading-[1.45] text-[var(--text-primary)]">{detalle}</p>

      <button
        type="button"
        onClick={() => setExplicar((v) => !v)}
        aria-expanded={explicar}
        className="-mx-2 mt-1 flex min-h-11 items-center gap-1.5 px-2 text-left text-[12px] font-medium text-[var(--text-primary)]"
      >
        <Snowflake size={14} color="var(--accent)" aria-hidden="true" />
        {estado.congeladores === 1 ? '1 congelador' : `${estado.congeladores} congeladores`}
        {estado.racha_mejor > 0 && ` · Récord: ${estado.racha_mejor} ${estado.racha_mejor === 1 ? 'día' : 'días'}`}
        <Info size={14} color="var(--text-tertiary)" aria-hidden="true" />
      </button>
      {explicar && (
        <p className="text-[12px] leading-[1.45] text-[var(--text-primary)]">
          Al día 21 completas tu Glow-Up. Si un día no haces tu Check, un congelador guarda tu racha; ganas uno cada 7 días seguidos (máximo 2).
        </p>
      )}
    </section>
  );
}
