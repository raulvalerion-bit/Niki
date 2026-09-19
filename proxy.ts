import { type NextRequest } from 'next/server';
import { actualizarSesion } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return actualizarSesion(request);
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas menos assets estáticos, para poder proteger
     * /app/* y redirigir /login si ya hay sesión.
     */
    '/((?!_next/static|_next/image|favicon.ico|iconos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
