'use client';

// Piezas interactivas de /admin/usuarios: agregar usuario a mano y cambiar
// el plan de uno existente. Ambas pasan por rutas de servidor (nunca tocan
// `role`/`plan` desde el cliente directo — esas columnas están fuera del
// GRANT del rol `authenticated`, ver la migración del backoffice).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2 } from 'lucide-react';
import type { PerfilAdmin } from '@/lib/admin/queries';
import { Badge, TablaContenedor } from '@/components/admin/ui';

const PLANES = [
  { valor: 'ninguno', label: 'Sin plan' },
  { valor: 'trial', label: 'Prueba (3 días)' },
  { valor: 'anual', label: 'VIP Pro anual' },
  { valor: 'mensual', label: 'VIP Pro mensual' },
  { valor: 'cancelado', label: 'Cancelado' },
];

const TONO_PLAN: Record<string, 'neutral' | 'positivo' | 'negativo' | 'atencion'> = {
  ninguno: 'neutral',
  trial: 'atencion',
  anual: 'positivo',
  mensual: 'positivo',
  cancelado: 'negativo',
};

export function FormularioNuevoUsuario() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('ninguno');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const res = await fetch('/api/admin/usuarios/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nombre, plan }),
    });
    setEnviando(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(typeof data?.error === 'string' ? data.error : 'No se pudo crear la cuenta.');
      return;
    }
    setEmail('');
    setNombre('');
    setPlan('ninguno');
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
        <UserPlus size={16} aria-hidden="true" />
        Agregar usuario
      </button>
    );
  }

  return (
    <form onSubmit={enviar} className="mb-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:flex-row sm:items-end sm:flex-wrap">
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <label htmlFor="nuevo-email" className="text-xs font-medium text-[var(--text-secondary)]">
          Correo
        </label>
        <input
          id="nuevo-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
          placeholder="persona@correo.com"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <label htmlFor="nuevo-nombre" className="text-xs font-medium text-[var(--text-secondary)]">
          Nombre
        </label>
        <input
          id="nuevo-nombre"
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
          placeholder="Su nombre"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="nuevo-plan" className="text-xs font-medium text-[var(--text-secondary)]">
          Plan inicial
        </label>
        <select
          id="nuevo-plan"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          {PLANES.filter((p) => p.valor !== 'cancelado').map((p) => (
            <option key={p.valor} value={p.valor}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] disabled:opacity-60"
        >
          {enviando && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
          Crear
        </button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="rounded-[var(--radius-button)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)]"
        >
          Cancelar
        </button>
      </div>
      {error && <p className="w-full text-sm font-medium text-[var(--error)]">{error}</p>}
    </form>
  );
}

export function TablaUsuarios({ usuarios }: { usuarios: PerfilAdmin[] }) {
  const router = useRouter();
  const [cambiando, setCambiando] = useState<string | null>(null);

  async function cambiarPlan(id: string, plan: string) {
    setCambiando(id);
    await fetch(`/api/admin/usuarios/${id}/plan`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    setCambiando(null);
    router.refresh();
  }

  if (usuarios.length === 0) return null;

  return (
    <TablaContenedor>
      <thead>
        <tr className="border-b border-[var(--border-default)] text-xs text-[var(--text-tertiary)]">
          <th scope="col" className="px-4 py-3 font-medium">
            Correo
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Nombre
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Origen
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Plan
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Alta
          </th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id} className="border-b border-[var(--border-default)] last:border-0">
            <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{u.email}</td>
            <td className="px-4 py-3 text-[var(--text-secondary)]">{u.nombre ?? '—'}</td>
            <td className="px-4 py-3">
              <Badge tono={u.creado_via === 'manual' ? 'atencion' : 'neutral'}>{u.creado_via === 'manual' ? 'Manual' : 'Registro'}</Badge>
            </td>
            <td className="px-4 py-3">
              <select
                value={u.plan}
                disabled={cambiando === u.id}
                onChange={(e) => void cambiarPlan(u.id, e.target.value)}
                className="rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--bg)] px-2 py-1.5 text-xs font-semibold text-[var(--text-primary)] disabled:opacity-50"
              >
                {PLANES.map((p) => (
                  <option key={p.valor} value={p.valor}>
                    {p.label}
                  </option>
                ))}
              </select>
              <span className="ml-2 hidden sm:inline">
                <Badge tono={TONO_PLAN[u.plan]}>{u.plan}</Badge>
              </span>
            </td>
            <td className="px-4 py-3 text-[var(--text-tertiary)]">{new Date(u.created_at).toLocaleDateString('es-MX')}</td>
          </tr>
        ))}
      </tbody>
    </TablaContenedor>
  );
}
