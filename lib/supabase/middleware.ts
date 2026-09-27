import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { tieneAcceso } from '@/lib/acceso';

// Refresca la sesión en cada request y protege /app/* — sin esto, un token
// vencido deja al usuario "logueado" en la UI pero con requests que fallan
// silenciosamente contra RLS (docs/sistema/26-AUTH-MODERNO.md).
export async function actualizarSesion(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enAppInterna = request.nextUrl.pathname.startsWith('/app');
  const enAdmin = request.nextUrl.pathname.startsWith('/admin');
  const enLogin = request.nextUrl.pathname.startsWith('/login');

  if (!user && (enAppInterna || enAdmin)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (user && enLogin) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // La app por dentro es solo para quien tiene un plan vigente (prueba o
  // pagado). Sin plan → pantalla de planes. Se verifica en el servidor en cada
  // request; el plan solo lo escribe el webhook de Hotmart o el panel admin.
  if (user && enAppInterna) {
    const { data: perfil } = await supabase
      .from('profiles')
      .select('role, plan, plan_activo_hasta, suscripcion_estado')
      .eq('id', user.id)
      .maybeSingle();
    if (!tieneAcceso(perfil)) {
      return NextResponse.redirect(new URL('/paywall?sin_plan=1', request.url));
    }
  }

  return response;
}
