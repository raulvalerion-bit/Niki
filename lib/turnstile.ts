// Verificación "no soy un robot" de Cloudflare Turnstile (gratis). El
// navegador resuelve el reto y entrega un token de un solo uso; AQUÍ, en el
// servidor, se le pregunta a Cloudflare si ese token es de verdad. La clave
// secreta nunca sale del servidor (TURNSTILE_SECRET_KEY).

const URL_VERIFICACION = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type ResultadoTurnstile = 'ok' | 'invalido' | 'no_configurado' | 'error';

export async function verificarTurnstile(token: string | undefined, ip: string): Promise<ResultadoTurnstile> {
  const secreto = process.env.TURNSTILE_SECRET_KEY;
  if (!secreto) {
    // En producción jamás se deja pasar sin verificar (fail-closed). Solo en
    // desarrollo local, sin claves, se omite para poder probar el login.
    return process.env.NODE_ENV === 'production' ? 'no_configurado' : 'ok';
  }
  if (!token) return 'invalido';

  const datos = new URLSearchParams({ secret: secreto, response: token });
  if (ip !== 'desconocida') datos.set('remoteip', ip);

  try {
    const respuesta = await fetch(URL_VERIFICACION, {
      method: 'POST',
      body: datos,
      signal: AbortSignal.timeout(5000),
    });
    if (!respuesta.ok) return 'error';
    const cuerpo = (await respuesta.json()) as { success?: boolean };
    return cuerpo.success === true ? 'ok' : 'invalido';
  } catch {
    return 'error';
  }
}
