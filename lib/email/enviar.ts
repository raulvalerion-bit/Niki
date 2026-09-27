// Envío de correos transaccionales vía la API de Resend (18/46). Solo
// servidor: la llave vive en RESEND_API_KEY, nunca en el navegador.
// Remitente en el subdominio verificado mail.holaniki.com (2026-09-27).

export const REMITENTE = 'Niki <acceso@mail.holaniki.com>';
const RESPONDER_A = 'hola@holaniki.com';

export async function enviarCorreo(opts: { para: string; asunto: string; html: string; texto: string }) {
  const llave = process.env.RESEND_API_KEY;
  if (!llave) throw new Error('falta_resend_api_key');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${llave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: REMITENTE,
      to: [opts.para],
      reply_to: RESPONDER_A,
      subject: opts.asunto,
      html: opts.html,
      text: opts.texto,
    }),
  });
  if (!res.ok) throw new Error(`resend_${res.status}`);
}
