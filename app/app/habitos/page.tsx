'use client';

// PANTALLA "HÁBITOS" — tracker del hábito de presencia elegido en el
// onboarding. CONECTADO a Supabase (2026-09-19): el ritmo viene del profile
// y cada marca del día queda guardada en `habito_registros`. Semana real
// (fechas, no "esta semana" genérico — regla 13 de CLAUDE.md), día de hoy
// resaltado.

import { useEffect, useState } from 'react';
import { Sunrise, CalendarClock } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const RITMO: Record<string, { label: string; icon: typeof Sunrise }> = {
  express: { label: '2 minutos por la mañana', icon: Sunrise },
  eventos: { label: '5 minutos antes de eventos importantes', icon: CalendarClock },
};

function fechaDeHoyLarga() {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(new Date());
}

function inicioDeSemana() {
  const hoy = new Date();
  const diaSemanaISO = (hoy.getDay() + 6) % 7; // 0 = lunes
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - diaSemanaISO);
  return lunes;
}

function aISO(fecha: Date) {
  return fecha.toISOString().slice(0, 10);
}

export default function Habitos() {
  const supabase = crearClienteSupabase();
  const lunes = inicioDeSemana();
  const hoyIdx = (new Date().getDay() + 6) % 7;
  const hoyISO = aISO(new Date());

  const [ritmo, setRitmo] = useState<string>('express');
  const [diasCumplidos, setDiasCumplidos] = useState<Set<string>>(new Set());

  useEffect(() => {
    let activo = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('habito_ritmo').eq('id', user.id).single();
      if (activo && profile?.habito_ritmo) setRitmo(profile.habito_ritmo);

      const finDeSemana = new Date(lunes);
      finDeSemana.setDate(lunes.getDate() + 6);
      const { data: registros } = await supabase
        .from('habito_registros')
        .select('fecha')
        .eq('user_id', user.id)
        .gte('fecha', aISO(lunes))
        .lte('fecha', aISO(finDeSemana));
      if (activo && registros) setDiasCumplidos(new Set(registros.map((r) => r.fecha)));
    })();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function marcarHoy() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const yaCumplido = diasCumplidos.has(hoyISO);
    if (yaCumplido) {
      await supabase.from('habito_registros').delete().eq('user_id', user.id).eq('fecha', hoyISO);
      setDiasCumplidos((s) => {
        const copia = new Set(s);
        copia.delete(hoyISO);
        return copia;
      });
    } else {
      await supabase.from('habito_registros').upsert({ user_id: user.id, fecha: hoyISO, cumplido: true });
      setDiasCumplidos((s) => new Set(s).add(hoyISO));
    }
  }

  const { label: ritmoLabel, icon: RitmoIcon } = RITMO[ritmo] ?? RITMO.express;

  return (
    <div className="flex flex-1 flex-col items-center pt-4 text-center">
      <h1 className="text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu hábito de Presencia e Imagen
      </h1>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Semana del {fechaDeHoyLarga()}</p>

      <div className="mt-5 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <RitmoIcon size={20} color="var(--accent)" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">{ritmoLabel}</p>
            <p className="text-[13px] text-[var(--text-secondary)]">Tu ritmo, elegido en tu registro.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5">
          {DIAS.map((letra, i) => {
            const fecha = new Date(lunes);
            fecha.setDate(lunes.getDate() + i);
            const esHoy = i === hoyIdx;
            const cumplido = diasCumplidos.has(aISO(fecha));
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] text-[var(--text-tertiary)]">{letra}</span>
                <button
                  type="button"
                  disabled={!esHoy}
                  onClick={() => void marcarHoy()}
                  aria-label={esHoy ? 'Marcar hábito de hoy' : `${letra} ${fecha.getDate()}`}
                  className={`flex size-9 items-center justify-center rounded-full border-2 text-[12px] font-semibold ${
                    cumplido
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                      : esHoy
                        ? 'border-[var(--accent)] text-[var(--text-primary)]'
                        : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[var(--text-tertiary)]'
                  }`}
                >
                  {fecha.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-[280px] text-center text-[13px] leading-[1.5] text-[var(--text-secondary)]">
        Toca el día de hoy cuando termines tu Check de Presencia.
      </p>
    </div>
  );
}
