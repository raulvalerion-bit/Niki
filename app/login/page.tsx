'use client';

// LOGIN DE NIKI — Paso 4 de la secuencia maestra (ESTADO.md).
// Método: magic link + código de 6 dígitos por correo, SIN contraseña — es la
// "DECISIÓN HOTMART-FIRST" de docs/sistema/26-AUTH-MODERNO.md (la app se vende
// por Hotmart, el webhook crea la cuenta sin contraseña, el comprador entra
// con el correo de la compra). Incluye la RUTA DE RESCATE "compré y no me
// llega" que 18-VENTA-HOTMART.md exige desde el día 1.
//
// CONECTADO a Supabase Auth (2026-09-19, Sesión de servicios externos):
// signInWithOtp manda el correo con el código; verifyOtp lo valida. El
// trigger on_auth_user_created (ver supabase/migrations) crea el profile
// automáticamente la primera vez que alguien entra con un correo nuevo.

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, X, LifeBuoy } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';

type Paso = 'correo' | 'codigo' | 'rescate';

/** Logo confirmado en FICHA-ARTE.md: el Anillo Niki sobre su chip con degradé
    atardecer (no el trazo suelto que se usaba antes) + la línea de qué es Niki. */
function MarcaNiki() {
  return (
    <div className="flex items-center gap-2 pt-[max(16px,env(safe-area-inset-top))]">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: 'linear-gradient(160deg, #FF9457 0%, #FFD98A 100%)' }}
      >
        <svg width="16" height="16" viewBox="0 0 52 52" fill="none" aria-hidden="true">
          <circle
            cx="26"
            cy="26"
            r="19"
            stroke="#3C2412"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="119.4"
            strokeDashoffset="28"
            transform="rotate(-90 26 26)"
          />
          <circle cx="26" cy="7.2" r="5" fill="#3C2412" />
        </svg>
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[15px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">niki</span>
        <span className="text-[10px] font-medium text-[var(--text-secondary)]">Tus ejes de Presencia e Imagen</span>
      </div>
    </div>
  );
}

function Encabezado({ onAtras, mostrarAtras }: { onAtras: () => void; mostrarAtras: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <MarcaNiki />
      <div className="mt-[max(16px,env(safe-area-inset-top))] flex items-center gap-1">
        {mostrarAtras && (
          <button
            type="button"
            onClick={onAtras}
            aria-label="Volver"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        )}
        <Link
          href="/"
          aria-label="Salir del ingreso"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)]"
        >
          <X size={20} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/** Casillas de código de 6 dígitos con auto-avance — verifica contra Supabase
    al completarse; si el código está mal, limpia y deja escribir de nuevo. */
function CasillasCodigo({ onCompleto, deshabilitado }: { onCompleto: (codigo: string) => void; deshabilitado: boolean }) {
  const [digitos, setDigitos] = useState<string[]>(Array(6).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function cambiar(i: number, valor: string) {
    const limpio = valor.replace(/\D/g, '').slice(-1);
    const siguientes = [...digitos];
    siguientes[i] = limpio;
    setDigitos(siguientes);
    if (limpio && i < 5) refs.current[i + 1]?.focus();
    if (siguientes.every((d) => d !== '')) {
      onCompleto(siguientes.join(''));
    }
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digitos[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  return (
    <div className="mt-8 flex justify-center gap-2.5">
      {digitos.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={deshabilitado}
          onChange={(e) => cambiar(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          aria-label={`Dígito ${i + 1} del código`}
          className={`h-14 w-11 rounded-[var(--radius-button)] border-2 bg-[var(--surface)] text-center text-[22px] font-bold text-[var(--text-primary)] shadow-[var(--shadow-1)] [font-family:var(--font-display)] disabled:opacity-60 ${
            d ? 'border-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)]'
          }`}
        />
      ))}
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const supabase = crearClienteSupabase();
  const [paso, setPaso] = useState<Paso>('correo');
  const [correo, setCorreo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviarCodigo() {
    if (!correo.includes('@')) return;
    setEnviando(true);
    setError(null);
    const { error: errorEnvio } = await supabase.auth.signInWithOtp({
      email: correo,
      options: { shouldCreateUser: true },
    });
    setEnviando(false);
    if (errorEnvio) {
      setError('No pudimos enviar el acceso — revisa el correo e intenta de nuevo.');
      return;
    }
    setPaso('codigo');
  }

  function enviarAcceso(e: React.FormEvent) {
    e.preventDefault();
    void enviarCodigo();
  }

  async function verificarCodigo(codigo: string) {
    setVerificando(true);
    setError(null);
    const { error: errorVerificacion } = await supabase.auth.verifyOtp({
      email: correo,
      token: codigo,
      type: 'email',
    });
    setVerificando(false);
    if (errorVerificacion) {
      setError('Ese código no es válido o venció — pide uno nuevo.');
      return;
    }
    router.push('/app');
    router.refresh();
  }

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden px-5 pb-10 text-[var(--text-primary)] [font-family:var(--font-body)]"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full border-[3px] border-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 size-72 rounded-full border-[3px] border-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
      />

      <Encabezado onAtras={() => setPaso('correo')} mostrarAtras={paso !== 'correo'} />

      {paso === 'correo' && (
        <div className="mt-6 flex flex-1 flex-col items-center pt-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <Mail size={26} color="var(--accent)" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            Entra con tu correo
          </h1>
          <p className="mt-3 max-w-[300px] text-[15px] leading-[1.5] text-[var(--text-primary)]">
            Sin contraseñas. Te mandamos un código de acceso al correo con el que compraste tu plan.
          </p>

          <form onSubmit={enviarAcceso} className="mt-8 w-full max-w-[340px]">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              aria-label="Tu correo"
              className="h-14 w-full rounded-[var(--radius-button)] border-2 border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-1)] focus:border-[var(--accent)] focus:outline-none"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={enviando}
              className="mt-4 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] disabled:opacity-70"
            >
              {enviando ? 'Enviando…' : 'Enviarme el acceso'}
            </motion.button>
          </form>

          <button
            type="button"
            onClick={() => setPaso('rescate')}
            className="mt-6 flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]"
          >
            <LifeBuoy size={14} aria-hidden="true" />
            ¿Compraste y no te llega el acceso?
          </button>
        </div>
      )}

      {paso === 'codigo' && (
        <div className="mt-6 flex flex-1 flex-col items-center pt-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <Mail size={26} color="var(--accent)" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            Revisa tu correo
          </h1>
          <p className="mt-3 max-w-[300px] text-[15px] leading-[1.5] text-[var(--text-primary)]">
            Si <span className="font-semibold">{correo}</span> tiene una cuenta, le llegó un enlace y un código de 6 dígitos. Escribe el código aquí:
          </p>

          <CasillasCodigo onCompleto={verificarCodigo} deshabilitado={verificando} />
          {error && <p className="mt-4 text-[13px] font-medium text-[#b3261e]">{error}</p>}

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => void enviarCodigo()}
              disabled={enviando}
              className="text-[13px] font-medium text-[var(--text-secondary)] disabled:opacity-60"
            >
              {enviando ? 'Reenviando…' : 'Reenviar código'}
            </button>
            <button
              type="button"
              onClick={() => setPaso('correo')}
              className="text-[13px] font-medium text-[var(--text-secondary)]"
            >
              Usar otro correo
            </button>
          </div>
        </div>
      )}

      {paso === 'rescate' && (
        <div className="mt-6 flex flex-1 flex-col pt-8">
          <h1 className="text-balance text-[24px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            ¿Compraste y no te llega el acceso?
          </h1>

          <form onSubmit={enviarAcceso} className="mt-6">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="El correo con el que compraste"
              aria-label="El correo con el que compraste"
              className="h-14 w-full rounded-[var(--radius-button)] border-2 border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] shadow-[var(--shadow-1)] focus:border-[var(--accent)] focus:outline-none"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={enviando}
              className="mt-4 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] disabled:opacity-70"
            >
              {enviando ? 'Enviando…' : 'Reenviar mi acceso'}
            </motion.button>
          </form>

          <p className="mt-3 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
            Si este correo tiene una compra activa, el acceso le llega en unos minutos.
          </p>

          <div className="mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
            <p className="text-[13px] text-[var(--text-primary)]">
              Revisa spam y promociones — llega como <span className="font-semibold">hola@niki.app</span>.
            </p>
            <p className="text-[13px] text-[var(--text-primary)]">
              Verifica que sea el mismo correo con el que compraste en Hotmart (está en tu comprobante).
            </p>
          </div>

          <a
            href="mailto:hola@niki.app?subject=No me llega el acceso"
            className="mt-6 text-center text-[14px] font-semibold text-[var(--accent)]"
          >
            Escribir a soporte
          </a>
        </div>
      )}
    </main>
  );
}
