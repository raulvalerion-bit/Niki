// Correo "tu prueba termina mañana" (Día 2 de la prueba del plan Anual).
// Tono del avatar (FICHA-AVATAR.md, tuteo, amigo sincero): claro con el
// cobro, sin culpa si decide irse. Colores de FICHA-ARTE.md escritos en hex
// porque los clientes de correo no entienden variables CSS.

const COLOR = {
  fondo: '#FFF3DE',
  tarjeta: '#FFFFFF',
  texto: '#3C2412',
  suave: '#6B4A33',
  acento: '#7A3E1D',
  borde: '#F3D9B5',
};

const PRECIO_ANUAL = '$107.88 USD';
const URL_APP = 'https://holaniki.com/app';
const URL_CANCELAR = 'https://consumer.hotmart.com';

function fechaLarga(fin: Date): string {
  return fin.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', timeZone: 'America/Mexico_City' });
}

function escapar(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

export function correoAvisoFinPrueba(opts: { nombre: string | null; finPrueba: Date }) {
  const saludo = opts.nombre ? `Hola, ${escapar(opts.nombre.split(' ')[0])}` : 'Hola';
  const fecha = fechaLarga(opts.finPrueba);
  const asunto = `Tu prueba de Niki termina mañana (${fecha})`;

  const texto = [
    `${saludo}:`,
    '',
    `Tu prueba gratis de Niki termina mañana, ${fecha}. Ese día Hotmart cobra el plan Anual: ${PRECIO_ANUAL} (más los impuestos de tu país), y sigues con todo por un año.`,
    '',
    'Si te quedas, no tienes que hacer nada.',
    `Si prefieres no seguir, cancela hoy desde ${URL_CANCELAR} y no se te cobra nada.`,
    '',
    `Mientras tanto, aprovecha tu último día completo: ${URL_APP}`,
    '',
    'Niki',
  ].join('\n');

  const html = `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:${COLOR.fondo};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.fondo};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${COLOR.tarjeta};border:1px solid ${COLOR.borde};border-radius:20px;padding:32px 24px;font-family:Arial,Helvetica,sans-serif;color:${COLOR.texto};">
        <tr><td style="font-size:16px;font-weight:bold;color:${COLOR.acento};padding-bottom:24px;">niki</td></tr>
        <tr><td style="font-size:24px;line-height:1.25;font-weight:bold;padding-bottom:16px;">Tu prueba termina <span style="color:${COLOR.acento};">mañana</span></td></tr>
        <tr><td style="font-size:16px;line-height:1.5;padding-bottom:16px;">
          ${saludo}. Tu prueba gratis de Niki termina el <strong>${fecha}</strong>. Ese día Hotmart cobra el plan Anual:
          <strong>${PRECIO_ANUAL}</strong> (más los impuestos de tu país), y sigues con todo por un año.
        </td></tr>
        <tr><td style="font-size:16px;line-height:1.5;padding-bottom:24px;">
          <strong>Si te quedas</strong>, no tienes que hacer nada.<br>
          <strong>Si prefieres no seguir</strong>, cancela hoy en tu cuenta de Hotmart y no se te cobra nada.
        </td></tr>
        <tr><td style="padding-bottom:16px;">
          <a href="${URL_APP}" style="display:block;background:${COLOR.acento};color:${COLOR.fondo};text-decoration:none;font-size:16px;font-weight:bold;text-align:center;padding:16px;border-radius:14px;">Aprovechar mi último día</a>
        </td></tr>
        <tr><td style="font-size:13px;line-height:1.5;color:${COLOR.suave};text-align:center;">
          ¿Quieres cancelar? <a href="${URL_CANCELAR}" style="color:${COLOR.acento};">Entra a tu cuenta de Hotmart</a> con el correo de tu compra.
        </td></tr>
      </table>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${COLOR.suave};margin:16px 0 0;">Recibes este aviso porque empezaste una prueba gratis en holaniki.com</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { asunto, html, texto };
}
