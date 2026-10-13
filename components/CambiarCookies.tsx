'use client';

import { useState } from 'react';
import { borrarDecision } from '@/lib/pixel';

/** Borra la decisión de cookies: el aviso vuelve a aparecer en la página principal. */
export function CambiarCookies() {
  const [hecho, setHecho] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        borrarDecision();
        setHecho(true);
      }}
      className="mt-3 font-semibold text-[var(--accent)] underline underline-offset-2"
    >
      {hecho ? 'Listo: te lo volveremos a preguntar en la página principal' : 'Cambiar mi decisión de cookies'}
    </button>
  );
}
