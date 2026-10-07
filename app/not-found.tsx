// Página 404 con la marca (antes salía la genérica de Next.js, en inglés).
// Típico: alguien escribe mal el enlace del perfil de redes.

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = { title: 'Página no encontrada — Niki' };

export default function NotFound() {
  return (
    <main
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <Image src="/iconos/niki-pensando.webp" alt="" width={96} height={96} priority />
      <h1 className="text-2xl font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Esta página no existe
      </h1>
      <p className="max-w-xs text-base text-[var(--text-secondary)]">
        Quizá el enlace se escribió mal. Tu Check de Presencia sigue esperándote en el inicio.
      </p>
      <Link
        href="/"
        className="mt-2 flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-semibold text-[var(--bg)]"
      >
        Ir al inicio de Niki
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </main>
  );
}
