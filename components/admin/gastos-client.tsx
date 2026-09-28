'use client';

// Alta, "marcar pagado" y borrado de costos de operación. Escribe directo con
// la sesión del admin: la política RLS (private.es_admin()) es la
// autorización real (mismo patrón que negocio-client.tsx).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Check, Trash2, Undo2 } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';

const CAMPO =
  'rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]';

export function FormularioCosto() {
  const router = useRouter();
  const supabase = crearClienteSupabase();
  const [abierto, setAbierto] = useState(false);
  const [concepto, setConcepto] = useState('');
  const [servicio, setServicio] = useState('');
  const [monto, setMonto] = useState('');
  const [frecuencia, setFrecuencia] = useState('mensual');
  const [estado, setEstado] = useState('pendiente');
  const [recuperable, setRecuperable] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const { error: errorInsert } = await supabase.from('costos_operacion').insert({
      concepto: concepto.trim(),
      servicio: servicio.trim(),
      monto_usd: Number(monto),
      frecuencia,
      estado,
      recuperable,
      fecha_pago: estado === 'pagado' ? new Date().toISOString().slice(0, 10) : null,
    });
    setEnviando(false);
    if (errorInsert) {
      setError('No se pudo guardar. Revisa que el monto sea un número y vuelve a intentar.');
      return;
    }
    setConcepto('');
    setServicio('');
    setMonto('');
    setRecuperable(false);
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
        Agregar un gasto
      </button>
    );
  }

  return (
    <form
      onSubmit={enviar}
      className="mb-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label htmlFor="concepto" className="text-xs font-medium text-[var(--text-secondary)]">
          Qué es
        </label>
        <input id="concepto" required maxLength={120} value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Plan Pro de…" className={CAMPO} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="servicio" className="text-xs font-medium text-[var(--text-secondary)]">
          Servicio
        </label>
        <input id="servicio" required maxLength={60} value={servicio} onChange={(e) => setServicio(e.target.value)} placeholder="Vercel, Canva…" className={CAMPO} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="monto" className="text-xs font-medium text-[var(--text-secondary)]">
          Monto (USD)
        </label>
        <input id="monto" required type="number" min="0" step="0.01" inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value)} className={`${CAMPO} w-28`} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="frecuencia" className="text-xs font-medium text-[var(--text-secondary)]">
          Cada cuánto
        </label>
        <select id="frecuencia" value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} className={CAMPO}>
          <option value="mensual">Cada mes</option>
          <option value="anual">Cada año</option>
          <option value="unico">Una sola vez</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="estado" className="text-xs font-medium text-[var(--text-secondary)]">
          Estado
        </label>
        <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className={CAMPO}>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--text-primary)]">
        <input type="checkbox" checked={recuperable} onChange={(e) => setRecuperable(e.target.checked)} className="size-4 accent-[var(--accent)]" />
        Se recupera (reembolso)
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="flex h-10 items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--bg)] disabled:opacity-60"
        >
          {enviando && <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          Guardar
        </button>
        <button type="button" onClick={() => setAbierto(false)} className="h-10 px-3 text-sm font-medium text-[var(--text-secondary)]">
          Cancelar
        </button>
      </div>
      {error && (
        <p role="alert" className="w-full text-sm font-medium text-[var(--error)]">
          {error}
        </p>
      )}
    </form>
  );
}

export function AccionesCosto({ id, estado, concepto }: { id: string; estado: string; concepto: string }) {
  const router = useRouter();
  const supabase = crearClienteSupabase();
  const [ocupado, setOcupado] = useState(false);

  async function alternarPagado() {
    setOcupado(true);
    const pagado = estado !== 'pagado';
    await supabase
      .from('costos_operacion')
      .update({ estado: pagado ? 'pagado' : 'pendiente', fecha_pago: pagado ? new Date().toISOString().slice(0, 10) : null })
      .eq('id', id);
    setOcupado(false);
    router.refresh();
  }

  async function borrar() {
    if (!window.confirm(`¿Borrar "${concepto}" de tus gastos? No se puede deshacer.`)) return;
    setOcupado(true);
    await supabase.from('costos_operacion').delete().eq('id', id);
    setOcupado(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        disabled={ocupado}
        onClick={() => void alternarPagado()}
        className="flex h-9 items-center gap-1 rounded-[var(--radius-button)] px-2 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--chip-bg)] disabled:opacity-50"
      >
        {estado === 'pagado' ? <Undo2 size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}
        {estado === 'pagado' ? 'Marcar pendiente' : 'Marcar pagado'}
      </button>
      <button
        type="button"
        disabled={ocupado}
        onClick={() => void borrar()}
        aria-label={`Borrar ${concepto}`}
        className="flex size-9 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-tertiary)] hover:bg-[var(--chip-bg)] disabled:opacity-50"
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
