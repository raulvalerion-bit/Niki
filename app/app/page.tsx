'use client';

// PANTALLA "HOY" — el ritual diario (M0 de 56-MOMENTOS-EMOCIONALES.md), la
// pantalla más vista de la app. Blueprint de las 4 piezas: (1) el dato de
// hoy, (2) la acción de 1 tap, (3) el estado de la racha, (4) el insight.
//
// CONECTADO a Supabase (2026-09-19): las gemas se leen de verdad del profile
// del usuario. El botón principal sube la foto al bucket privado
// `checks-fotos` (carpeta = user_id, ver migración de Storage) y guarda un
// registro real en `checks` — pero el análisis por IA todavía no está
// conectado — se avisa con honestidad en vez de inventar un resultado
// (misma regla que en onboarding/page.tsx).

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Camera, Briefcase, Heart, Handshake, Users, UtensilsCrossed, Palmtree } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { registrarEvento } from '@/lib/eventos';

type Paso = 'inicio' | 'foto' | 'procesando';

const OCASIONES: { valor: string; label: string; icon: LucideIcon }[] = [
  { valor: 'entrevista', label: 'Entrevista', icon: Briefcase },
  { valor: 'cita', label: 'Cita', icon: Heart },
  { valor: 'negocios', label: 'Negocios', icon: Handshake },
  { valor: 'amigos', label: 'Amigos', icon: Users },
  { valor: 'cena', label: 'Cena formal', icon: UtensilsCrossed },
  { valor: 'vacaciones', label: 'Vacaciones', icon: Palmtree },
];

export default function Hoy() {
  const supabase = crearClienteSupabase();
  const [paso, setPaso] = useState<Paso>('inicio');
  const [ocasion, setOcasion] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gemas, setGemas] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let activo = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('gemas').eq('id', user.id).single();
      if (activo && data) setGemas(data.gemas);
    })();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function analizarPresencia() {
    if (!ocasion) return;
    const archivo = inputRef.current?.files?.[0];
    setGuardando(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        let fotoUrl: string | null = null;
        if (archivo) {
          const extension = archivo.name.split('.').pop() ?? 'jpg';
          const ruta = `${user.id}/${crypto.randomUUID()}.${extension}`;
          const { error: errorSubida } = await supabase.storage.from('checks-fotos').upload(ruta, archivo);
          if (errorSubida) {
            console.error('No se pudo subir la foto del Check:', errorSubida.message);
          } else {
            fotoUrl = ruta;
          }
        }
        const { error: errorInsert } = await supabase
          .from('checks')
          .insert({ user_id: user.id, ocasion, foto_url: fotoUrl, estado: 'pendiente' });
        if (errorInsert) {
          console.error('No se pudo guardar el Check:', errorInsert.message);
        } else {
          // Acción principal de la app (21-BACKOFFICE, sección Uso) — cuántas
          // veces se ejecutó la función core.
          await registrarEvento(supabase, 'check_creado', user.id, { ocasion });
        }
      }
    } finally {
      // La foto/registro son "mejor esfuerzo": si algo falla igual avanzamos
      // a la pantalla honesta de "todavía sin IA conectada" — nunca se deja
      // al usuario con el botón trabado (regla de oro de UX del SO).
      setGuardando(false);
      setPaso('procesando');
    }
  }

  if (paso === 'procesando') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center pt-8 text-center">
        <motion.span
          initial={reduce ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20 }}
          className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/iconos/icono-4-esperando.gif" alt="" aria-hidden="true" className="size-10" />
        </motion.span>
        <h1 className="mt-6 text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Ya casi está tu Check de Presencia
        </h1>
        <p className="mt-3 max-w-[300px] text-[15px] leading-[1.5] text-[var(--text-primary)]">
          Estamos conectando el análisis por IA — es lo próximo que construimos. Tu Check quedó guardado, te avisamos apenas puedas ver tu resultado.
        </p>
        <button
          type="button"
          onClick={() => {
            setPaso('inicio');
            setPreview(null);
            setOcasion(null);
          }}
          className="mt-8 flex h-14 w-full max-w-[300px] items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
        >
          Entendido
        </button>
      </div>
    );
  }

  if (paso === 'foto') {
    return (
      <div className="flex flex-1 flex-col pt-4">
        <h1 className="text-balance text-center text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿Para qué ocasión es tu Check de hoy?
        </h1>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {OCASIONES.map((op) => {
            const Icono = op.icon;
            const seleccionado = ocasion === op.valor;
            return (
              <button
                key={op.valor}
                type="button"
                onClick={() => setOcasion(op.valor)}
                className={`flex h-14 items-center gap-2 rounded-[var(--radius-button)] border px-3 text-left shadow-[var(--shadow-1)] ${
                  seleccionado ? 'border-[var(--accent)] bg-[var(--chip-bg)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
                }`}
              >
                <Icono size={18} color="var(--accent)" aria-hidden="true" />
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{op.label}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-[15px] font-semibold text-[var(--text-primary)]">Tu foto de cuerpo entero</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex aspect-[3/4] w-full max-w-[260px] flex-col items-center justify-center gap-3 self-center overflow-hidden rounded-[var(--radius-card)] border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)] bg-[var(--surface)] px-8"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Tu foto seleccionada" className="h-full w-full object-cover" />
          ) : (
            <>
              <Camera size={26} color="var(--text-secondary)" aria-hidden="true" />
              <p className="max-w-[30ch] text-center text-[13px] font-medium text-[var(--text-secondary)]">
                Toca para elegir una foto de tu galería
              </p>
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={onArchivo} className="hidden" />

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={!preview || !ocasion || guardando}
          onClick={() => void analizarPresencia()}
          className="mt-6 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] disabled:opacity-40"
        >
          {guardando ? 'Guardando…' : 'Analizar mi presencia'}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center pt-4 text-center">
      <p className="text-[15px] text-[var(--text-primary)]">Hola 👋</p>
      <h1 className="mt-1 text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        ¿Aún no hiciste tu Check de Presencia e Imagen de hoy?
      </h1>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setPaso('foto')}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)]"
      >
        <Camera size={20} aria-hidden="true" />
        Hacer mi Check de Presencia
      </motion.button>

      <div className="mt-6 flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] shadow-[inset_0_1px_3px_rgb(140_60_20_/_0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/iconos/icono-3-gema.gif" alt="" aria-hidden="true" className="size-6" />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">Tus gemas: {gemas ?? 0}</p>
          <p className="text-[13px] text-[var(--text-secondary)]">Ganas una gema cada vez que obtienes tu calificación.</p>
        </div>
      </div>

      <div className="mt-4 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)]">
        <p className="text-[14px] leading-[1.5] text-[var(--text-primary)]">
          Con tu primer Check, Niki empieza a conocer tu estilo — cada registro afina un poco más tus recomendaciones.
        </p>
      </div>
    </div>
  );
}
