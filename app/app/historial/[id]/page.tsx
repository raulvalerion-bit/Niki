'use client';

// DETALLE DE UN CHECK PASADO — el mismo resultado que se vio ese día (anillo,
// 3 ejes, ajuste clave, frase de cierre). Lectura con RLS: cada usuario solo
// puede abrir los suyos.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, SearchX } from 'lucide-react';
import { crearClienteSupabase } from '@/lib/supabase/client';
import { ResultadoCheck } from '@/components/app/ResultadoCheck';
import type { ResultadoCheck as Resultado } from '@/lib/ia/resultado';

type Check = { ocasion: string; resultado: Resultado | null; created_at: string };

function fechaLarga(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(new Date(iso));
}

export default function DetalleCheck() {
  const supabase = crearClienteSupabase();
  const { id } = useParams<{ id: string }>();
  const [check, setCheck] = useState<Check | null | undefined>(undefined);

  useEffect(() => {
    let activo = true;
    (async () => {
      const { data } = await supabase
        .from('checks')
        .select('ocasion, resultado, created_at')
        .eq('id', id)
        .eq('estado', 'listo')
        .maybeSingle();
      if (activo) setCheck(data ?? null);
    })();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const volver = (
    <Link
      href="/app/historial"
      className="-ml-2 flex h-11 w-fit items-center gap-1 px-2 text-[14px] font-semibold text-[var(--accent)]"
    >
      <ArrowLeft size={18} aria-hidden="true" />
      Historial
    </Link>
  );

  if (check === undefined) {
    return (
      <div className="flex flex-1 flex-col pt-2" aria-busy="true">
        {volver}
        <div className="mx-auto mt-4 h-6 w-48 animate-pulse rounded-full bg-[var(--surface-2)]" />
        <div className="mx-auto mt-4 size-40 animate-pulse rounded-full bg-[var(--surface-2)]" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="mt-3 h-20 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        ))}
      </div>
    );
  }

  if (!check?.resultado) {
    return (
      <div className="flex flex-1 flex-col pt-2">
        {volver}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <SearchX size={26} color="var(--accent)" aria-hidden="true" />
          </span>
          <h1 className="mt-4 max-w-64 text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            No encontramos este Check
          </h1>
          <p className="mt-2 max-w-72 text-[14px] leading-[1.5] text-[var(--text-secondary)]">
            Puede que no se haya terminado de analizar. Vuelve a tu historial para ver los demás.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col pt-2 pb-4">
      {volver}
      <div className="mt-2">
        <ResultadoCheck resultado={check.resultado} ocasion={check.ocasion} fecha={fechaLarga(check.created_at)} />
      </div>
    </div>
  );
}
