'use client';

// Lee los Checks con resultado de la persona (RLS: solo los suyos) para la Ruta de Presencia.

import { useCallback, useEffect, useState } from 'react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import type { CheckProgreso } from '@/lib/progreso';

export function useChecksProgreso() {
  const [checks, setChecks] = useState<CheckProgreso[] | null>(null);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    (async () => {
      const supabase = crearClienteSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error: fallo } = await supabase
        .from('checks')
        .select('id, ocasion, created_at, puntaje, resultado')
        .eq('user_id', user.id)
        .eq('estado', 'listo')
        .not('resultado', 'is', null)
        .order('created_at', { ascending: true });
      if (!activo) return;
      if (fallo) setError(true);
      else setChecks((data ?? []) as CheckProgreso[]);
    })();
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = useCallback(() => {
    setError(false);
    setIntento((n) => n + 1);
  }, []);

  return { checks, error, reintentar };
}
