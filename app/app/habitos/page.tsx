'use client';

// PANTALLA "HÁBITOS" — tracker del hábito de presencia elegido en el
// onboarding (por ahora sin persistencia real: se conecta a la respuesta
// real del usuario cuando exista base de datos, ESTADO.md "Servicios
// externos"). Semana real (fechas, no "esta semana" genérico — regla 13 de
// CLAUDE.md), día de hoy resaltado, resto sin marcar (usuario día 1).

import { useState } from 'react';
import { Sunrise } from 'lucide-react';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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

export default function Habitos() {
  const [hechoHoy, setHechoHoy] = useState(false);
  const lunes = inicioDeSemana();
  const hoyIdx = (new Date().getDay() + 6) % 7;

  return (
    <div className="flex flex-1 flex-col items-center pt-4 text-center">
      <h1 className="text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        Tu hábito de Presencia e Imagen
      </h1>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Semana del {fechaDeHoyLarga()}</p>

      <div className="mt-5 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <Sunrise size={20} color="var(--accent)" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">2 minutos por la mañana</p>
            <p className="text-[13px] text-[var(--text-secondary)]">Tu ritmo Express, elegido en tu registro.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5">
          {DIAS.map((letra, i) => {
            const fecha = new Date(lunes);
            fecha.setDate(lunes.getDate() + i);
            const esHoy = i === hoyIdx;
            const cumplido = esHoy && hechoHoy;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] text-[var(--text-tertiary)]">{letra}</span>
                <button
                  type="button"
                  disabled={!esHoy}
                  onClick={() => setHechoHoy((v) => !v)}
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
