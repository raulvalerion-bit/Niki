'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

/** Botón "Revisar ahora" de la reconciliación Hotmart ↔ Niki (Salud). */
export function BotonReconciliar() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function revisar() {
    if (cargando) return;
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/reconciliar', { method: 'POST' });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError('No se pudo correr la revisión. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={revisar}
        disabled={cargando}
        className="flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] disabled:opacity-60"
      >
        <RefreshCw size={16} aria-hidden="true" className={cargando ? 'animate-spin motion-reduce:animate-none' : ''} />
        {cargando ? 'Revisando con Hotmart…' : 'Revisar ahora'}
      </button>
      {error && (
        <p role="alert" className="text-sm font-medium text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}
