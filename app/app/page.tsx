'use client';

// PANTALLA "HOY" — el ritual diario (M0 de 56-MOMENTOS-EMOCIONALES.md), la
// pantalla más vista de la app. Blueprint de las 4 piezas: (1) el dato de
// hoy, (2) la acción de 1 tap, (3) el estado de la racha, (4) el insight.
//
// IA REAL (2026-09-28): la foto se achica en el celular, se sube al bucket
// privado `checks-fotos` (carpeta = user_id) y /api/check la analiza en el
// servidor, que aplica el límite de 3 Checks al día y el tope de gasto.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Camera, Briefcase, Heart, Handshake, Users, UtensilsCrossed, Palmtree, RotateCcw, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { registrarEvento } from '@/lib/eventos';
import { LIMITE_CHECKS_DIA, MENSAJE_FOTO, MOTIVOS_FOTO, type ResultadoCheck as Resultado } from '@/lib/ia/resultado';
import { ResultadoCheck } from '@/components/app/ResultadoCheck';

type Paso = 'inicio' | 'foto' | 'analizando' | 'resultado' | 'limite' | 'error';

const OCASIONES: { valor: string; label: string; icon: LucideIcon }[] = [
  { valor: 'entrevista', label: 'Entrevista', icon: Briefcase },
  { valor: 'cita', label: 'Cita', icon: Heart },
  { valor: 'negocios', label: 'Negocios', icon: Handshake },
  { valor: 'amigos', label: 'Amigos', icon: Users },
  { valor: 'cena', label: 'Cena formal', icon: UtensilsCrossed },
  { valor: 'vacaciones', label: 'Vacaciones', icon: Palmtree },
];

const PASOS_ANALISIS = ['Revisando tu outfit…', 'Mirando tu postura…', 'Leyendo tu actitud…', 'Armando tu ajuste clave…'];

const BOTON_PRIMARIO =
  'flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] disabled:opacity-40';

function fechaLocalHoy() {
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

/** Achica la foto a máx. 1280 px (JPEG): sube rápido con datos móviles y la IA cuesta menos. */
async function achicarFoto(archivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('sin_blob'))), 'image/jpeg', 0.85)
  );
}

export default function Hoy() {
  const supabase = crearClienteSupabase();
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>('inicio');
  const [ocasion, setOcasion] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gemas, setGemas] = useState<number | null>(null);
  const [usadosHoy, setUsadosHoy] = useState<number | null>(null);
  const [avisoValidacion, setAvisoValidacion] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<'pausa' | 'ia' | null>(null);
  const [pasoAnalisis, setPasoAnalisis] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  const [recarga, setRecarga] = useState(0);

  // Gemas y Checks usados hoy (se vuelve a leer al volver a Hoy).
  useEffect(() => {
    let activo = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: perfil }, { count }] = await Promise.all([
        supabase.from('profiles').select('gemas').eq('id', user.id).single(),
        supabase
          .from('checks')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('fecha_local', fechaLocalHoy())
          .in('estado', ['procesando', 'listo']),
      ]);
      if (!activo) return;
      if (perfil) setGemas(perfil.gemas);
      setUsadosHoy(count ?? 0);
    })();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recarga]);

  // Mensajes de progreso mientras la IA responde (5-15 s): nunca un spinner mudo.
  useEffect(() => {
    if (paso !== 'analizando') return;
    const t = setInterval(() => setPasoAnalisis((i) => Math.min(i + 1, PASOS_ANALISIS.length - 1)), 2800);
    return () => clearInterval(t);
  }, [paso]);

  const restantes = usadosHoy === null ? null : Math.max(0, LIMITE_CHECKS_DIA - usadosHoy);

  function empezarCheck() {
    if (restantes === 0) {
      setPaso('limite');
      return;
    }
    setPaso('foto');
  }

  function volverAlInicio() {
    setPaso('inicio');
    setPreview(null);
    setOcasion(null);
    setAvisoValidacion(null);
    setResultado(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    setRecarga((n) => n + 1);
  }

  function onArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setAvisoValidacion(null);
  }

  async function analizarPresencia() {
    const archivo = inputRef.current?.files?.[0];
    if (!ocasion || !archivo) return;
    if (!navigator.onLine) {
      setAvisoValidacion('Estás sin conexión. Conéctate a internet y vuelve a intentarlo.');
      return;
    }

    let foto: Blob;
    try {
      foto = await achicarFoto(archivo);
    } catch {
      setAvisoValidacion('No pudimos abrir esa foto. Prueba con otra de tu galería (JPG o PNG).');
      return;
    }

    setPasoAnalisis(0);
    setPaso('analizando');
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const ruta = `${user.id}/${crypto.randomUUID()}.jpg`;
      const { error: errorSubida } = await supabase.storage
        .from('checks-fotos')
        .upload(ruta, foto, { contentType: 'image/jpeg' });
      if (errorSubida) throw new Error('subida');

      await registrarEvento(supabase, 'check_creado', user.id, { ocasion });

      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ocasion, foto: ruta, zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setResultado(data.resultado);
        setUsadosHoy(LIMITE_CHECKS_DIA - data.restantes);
        setGemas((g) => (g ?? 0) + 1);
        setPaso('resultado');
        return;
      }
      switch (data.error) {
        case 'foto': {
          const motivo = MOTIVOS_FOTO.find((m) => m === data.motivo);
          setAvisoValidacion(
            (motivo ? MENSAJE_FOTO[motivo] : 'No pudimos leer esa foto. Prueba con otra.') + ' Este intento no se descontó.'
          );
          setPaso('foto');
          return;
        }
        case 'limite':
          setUsadosHoy(LIMITE_CHECKS_DIA);
          setPaso('limite');
          return;
        case 'sin_plan':
          router.push('/paywall?sin_plan=1');
          return;
        case 'sesion':
          router.push('/login');
          return;
        case 'duplicado':
          router.push(`/app/historial/${data.checkId}`);
          return;
        case 'pausa':
          setError('pausa');
          setPaso('error');
          return;
        default:
          setError('ia');
          setPaso('error');
      }
    } catch {
      setError('ia');
      setPaso('error');
    }
  }

  if (paso === 'analizando') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center pt-8 text-center" aria-live="polite">
        <motion.span
          initial={reduce ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20 }}
          className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-[var(--chip-bg)]"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" aria-hidden="true" className="size-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/iconos/icono-4-esperando.gif" alt="" aria-hidden="true" className="size-10" />
          )}
        </motion.span>
        <h1 className="mt-6 text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Niki está mirando tu foto
        </h1>
        <div className="mt-3 h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={pasoAnalisis}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-[15px] text-[var(--text-secondary)]"
            >
              {PASOS_ANALISIS[pasoAnalisis]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-6 h-2 w-full max-w-60 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: '8%' }}
            animate={{ width: '92%' }}
            transition={{ duration: reduce ? 0 : 14, ease: [0.1, 0.6, 0.3, 1] }}
          />
        </div>
        <p className="mt-4 text-[13px] text-[var(--text-tertiary)]">Tarda unos segundos</p>
      </div>
    );
  }

  if (paso === 'resultado' && resultado && ocasion) {
    return (
      <div className="flex flex-1 flex-col pt-4">
        <ResultadoCheck resultado={resultado} ocasion={ocasion} gemaNueva />
        <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={volverAlInicio} className={`mt-6 ${BOTON_PRIMARIO}`}>
          Listo
        </motion.button>
        <p className="mt-3 text-center text-[13px] text-[var(--text-secondary)]">
          {restantes === 0
            ? 'Ese fue tu último Check de hoy. Mañana tienes 3 nuevos.'
            : `Te ${restantes === 1 ? 'queda 1 Check' : `quedan ${restantes} Checks`} hoy · Guardado en tu historial`}
        </p>
      </div>
    );
  }

  if (paso === 'limite') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center pt-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <Moon size={28} color="var(--accent)" aria-hidden="true" />
        </span>
        <h1 className="mt-6 max-w-xs text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Ya hiciste tus 3 Checks de hoy
        </h1>
        <p className="mt-3 max-w-xs text-[15px] leading-[1.5] text-[var(--text-secondary)]">
          Mañana tienes 3 nuevos. Mientras, repasa tu último resultado y aplica tu ajuste clave antes de salir.
        </p>
        <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => router.push('/app/historial')} className={`mt-8 max-w-xs ${BOTON_PRIMARIO}`}>
          Ver mi historial
        </motion.button>
        <button type="button" onClick={volverAlInicio} className="mt-3 h-11 px-4 text-[14px] font-semibold text-[var(--accent)]">
          Volver a Hoy
        </button>
      </div>
    );
  }

  if (paso === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center pt-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <RotateCcw size={26} color="var(--accent)" aria-hidden="true" />
        </span>
        <h1 className="mt-6 max-w-xs text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {error === 'pausa' ? 'Niki está tomando un respiro' : 'No pudimos analizar tu foto esta vez'}
        </h1>
        <p className="mt-3 max-w-xs text-[15px] leading-[1.5] text-[var(--text-secondary)]">
          {error === 'pausa'
            ? 'Hay mucha gente haciendo su Check ahora mismo. Vuelve a intentarlo en un rato. No se descontó de tus Checks de hoy.'
            : 'Fue un problema de nuestro lado, no de tu foto. No se descontó de tus Checks de hoy.'}
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setError(null);
            setPaso('foto');
          }}
          className={`mt-8 max-w-xs ${BOTON_PRIMARIO}`}
        >
          Intentar de nuevo
        </motion.button>
        <button type="button" onClick={volverAlInicio} className="mt-3 h-11 px-4 text-[14px] font-semibold text-[var(--accent)]">
          Volver a Hoy
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
              <motion.button
                key={op.valor}
                type="button"
                whileTap={{ scale: 0.97, y: 2 }}
                onClick={() => {
                  setOcasion(op.valor);
                  setAvisoValidacion(null);
                }}
                className={`flex h-14 items-center gap-2 rounded-[var(--radius-button)] border border-b-4 px-3 text-left shadow-[var(--shadow-1)] transition-[border-bottom-width,background-color,border-color] duration-150 ${
                  seleccionado
                    ? 'border-b-2 border-[var(--accent)] bg-[var(--chip-bg)]'
                    : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] border-b-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)] bg-[var(--surface)]'
                }`}
              >
                <Icono size={18} color="var(--accent)" aria-hidden="true" />
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{op.label}</span>
              </motion.button>
            );
          })}
        </div>

        <p className="mt-6 text-[15px] font-semibold text-[var(--text-primary)]">Tu foto de cuerpo entero</p>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">De la cabeza a los zapatos, con buena luz.</p>
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
          onClick={() => {
            if (!ocasion) {
              setAvisoValidacion('Elige para qué ocasión es tu Check (arriba) antes de continuar.');
              return;
            }
            if (!preview) {
              setAvisoValidacion('Sube tu foto de cuerpo entero antes de continuar.');
              return;
            }
            setAvisoValidacion(null);
            void analizarPresencia();
          }}
          className={`mt-6 ${BOTON_PRIMARIO}`}
        >
          Analizar mi presencia
        </motion.button>
        {avisoValidacion && (
          <p role="alert" className="mt-3 text-center text-sm font-medium text-[var(--error)]">
            {avisoValidacion}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center pt-4 text-center">
      <p className="text-[15px] text-[var(--text-primary)]">Hola 👋</p>
      <h1 className="mt-1 text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {restantes === 0 ? 'Ya hiciste tus 3 Checks de hoy' : '¿Aún no hiciste tu Check de Presencia e Imagen de hoy?'}
      </h1>

      <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={empezarCheck} className={`mt-6 ${BOTON_PRIMARIO}`}>
        <Camera size={20} aria-hidden="true" />
        {restantes === 0 ? 'Ver mi último resultado' : 'Hacer mi Check de Presencia'}
      </motion.button>
      {restantes !== null && restantes > 0 && (
        <p className="mt-3 text-[13px] text-[var(--text-secondary)]">
          {restantes === LIMITE_CHECKS_DIA
            ? 'Tienes 3 Checks disponibles hoy'
            : `Te ${restantes === 1 ? 'queda 1 Check' : `quedan ${restantes} Checks`} hoy`}
        </p>
      )}

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
