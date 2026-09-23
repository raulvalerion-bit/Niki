// USUARIOS — lista con buscador, alta manual y cambio de plan (21-BACKOFFICE).

import { Search } from 'lucide-react';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { listarUsuarios } from '@/lib/admin/queries';
import { SectionTitle, SinDatos } from '@/components/admin/ui';
import { FormularioNuevoUsuario, TablaUsuarios } from '@/components/admin/usuarios-client';

export default async function AdminUsuarios({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const supabase = await crearClienteSupabaseServidor();
  const usuarios = await listarUsuarios(supabase, q);

  return (
    <div>
      <SectionTitle subtitulo="Todas las cuentas de tu app, con quién entró solo y a quién agregaste tú">Usuarios</SectionTitle>

      <FormularioNuevoUsuario />

      <form method="get" className="mb-4 flex max-w-sm items-center gap-2 rounded-[var(--radius-button)] border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2">
        <Search size={16} color="var(--text-tertiary)" aria-hidden="true" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por correo…"
          className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none"
        />
      </form>

      {usuarios.length === 0 ? <SinDatos motivo="Todavía no hay ninguna cuenta que coincida." /> : <TablaUsuarios usuarios={usuarios} />}
    </div>
  );
}
