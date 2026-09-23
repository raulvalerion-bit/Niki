'use client';

// Formulario para anotar el gasto de adquisición por canal (21-BACKOFFICE:
// "el dueño ingresa el gasto por canal, Hotmart no lo sabe"). Inserta
// directo con el cliente de sesión del admin — RLS (private.es_admin()) es
// la autorización real, no hace falta una ruta de servidor aparte.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';

export function FormularioGasto() {
  const router = useRouter();
  const supabase = crearClienteSupabase();
  const [abierto, setAbierto] = useState(false);
  const [canal, setCanal] = useState('');
  const [monto, setMonto] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const { error: errorInsert } = await supabase.from('acquisition_spend').insert({
      channel: canal,
      amount: Number(monto),
      period_start: inicio,
      period_end: fin,
    });
    setEnviando(false);
    if (errorInsert) {
      setError('No se pudo guardar el gasto.');
      return;
    }
    setCanal('');
    setMonto('');
    setInicio('');
    setFin('');
    setAbierto(false);
    router.refresh();
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="mb-4 flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)]"
      >
        <Plus size={16} aria-hidden="true" />
        Anotar gasto de un canal
      </button>
    );
  }

  return (
    <form onSubmit={enviar} className="mb-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <label htmlFor="canal" className="text-xs font-medium text-[var(--text-secondary)]">
          Canal
        </label>
        <input
          id="canal"
          required
          value={canal}
          onChange={(e) => setCanal(e.target.value)}
          placeholder="ads_meta, afiliados, orgánico…"
          className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="monto" className="text-xs font-medium text-[var(--text-secondary)]">
          Gasto (USD)
        </label>
        <input
          id="monto"
          type="number"
          min="0"
          step="0.01"
          required
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-32 rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="inicio" className="text-xs font-medium text-[var(--text-secondary)]">
          Desde
        </label>
        <input
          id="inicio"
          type="date"
          required
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="fin" className="text-xs font-medium text-[var(--text-secondary)]">
          Hasta
        </label>
        <input
          id="fin"
          type="date"
          required
          value={fin}
          onChange={(e) => setFin(e.target.value)}
          className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] disabled:opacity-60"
        >
          {enviando && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
          Guardar
        </button>
        <button type="button" onClick={() => setAbierto(false)} className="rounded-[var(--radius-button)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)]">
          Cancelar
        </button>
      </div>
      {error && <p className="w-full text-sm font-medium text-[var(--error)]">{error}</p>}
    </form>
  );
}
