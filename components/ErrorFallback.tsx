'use client';

// Error Boundary compartido (UX regla 18: "la app nunca muestra pantalla
// blanca"). Reporta a error_log (vía /api/log-error) para que el backoffice
// (sección Salud, 21-BACKOFFICE) sepa qué está fallando de verdad.

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export function ErrorFallback({ error, reset, contexto }: { error: Error & { digest?: string }; reset: () => void; contexto: string }) {
  useEffect(() => {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: error.message || 'Error sin mensaje', context: contexto }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <p className="text-xl font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Algo no salió bien</p>
      <p className="max-w-xs text-sm text-[var(--text-secondary)]">
        No es tu culpa — tuvimos un tropiezo de nuestro lado. Ya quedó anotado para revisarlo.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg)]"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Intentar de nuevo
      </button>
    </div>
  );
}
