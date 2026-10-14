// Correo "todavía no haces tu primer Check" (D1 del puente de la prueba, 02C): para quien activó
// la prueba y no ha usado la app. Usa el dolor #1 de FICHA-AVATAR.md con sus palabras ("nadie te
// lo dice por pena"), nunca un "te extrañamos". Colores de FICHA-ARTE.md en hex (clientes de correo).

const COLOR = {
  fondo: '#FFF3DE',
  tarjeta: '#FFFFFF',
  texto: '#3C2412',
  suave: '#6B4A33',
  acento: '#7A3E1D',
  borde: '#F3D9B5',
};

const URL_APP = 'https://holaniki.com/app';

function escapar(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

export function correoReenganchePrueba(opts: { nombre: string | null; finPrueba: Date }) {
  const saludo = opts.nombre ? `Hola, ${escapar(opts.nombre.split(' ')[0])}` : 'Hola';
  const fecha = opts.finPrueba.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Mexico_City' });
  const asunto = 'Nadie te dice por pena si tu outfit funciona. Niki sí.';

  const texto = [
    `${saludo}:`,
    '',
    'Activaste tu prueba de Niki, pero todavía no haces tu primer Check de Presencia.',
    '',
    'Sube una foto de cuerpo entero, elige a dónde vas y en 30 segundos sabes qué ajustar en tu outfit, tu postura y tu actitud. Sincero, en privado y sin críticas crueles.',
    '',
    `Tu prueba gratis sigue hasta el ${fecha}.`,
    '',
    `Hacer mi primer Check: ${URL_APP}`,
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
        <tr><td style="font-size:24px;line-height:1.25;font-weight:bold;padding-bottom:16px;">Nadie te lo dice por pena. <span style="color:${COLOR.acento};">Niki sí.</span></td></tr>
        <tr><td style="font-size:16px;line-height:1.5;padding-bottom:16px;">
          ${saludo}. Activaste tu prueba de Niki, pero todavía no haces tu primer Check de Presencia.
        </td></tr>
        <tr><td style="font-size:16px;line-height:1.5;padding-bottom:16px;">
          Sube una foto de cuerpo entero, elige a dónde vas y en <strong>30 segundos</strong> sabes qué ajustar en tu outfit,
          tu postura y tu actitud. Sincero, en privado y sin críticas crueles.
        </td></tr>
        <tr><td style="font-size:16px;line-height:1.5;padding-bottom:24px;">
          Tu prueba gratis sigue hasta el <strong>${fecha}</strong>.
        </td></tr>
        <tr><td style="padding-bottom:16px;">
          <a href="${URL_APP}" style="display:block;background:${COLOR.acento};color:${COLOR.fondo};text-decoration:none;font-size:16px;font-weight:bold;text-align:center;padding:16px;border-radius:14px;">Hacer mi primer Check</a>
        </td></tr>
      </table>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${COLOR.suave};margin:16px 0 0;">Recibes este aviso porque empezaste una prueba gratis en holaniki.com</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { asunto, html, texto };
}
