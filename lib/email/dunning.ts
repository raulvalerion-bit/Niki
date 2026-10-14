// Correos de COBRO FALLIDO (dunning, 58): 4 avisos en los días 1/3/5/7 del atraso.
// Tono del avatar (FICHA-AVATAR.md: tuteo, amigo sincero): servicial, nunca acusatorio —
// el cliente quería seguir, falló la tarjeta o se pasó la ficha. Urgencia que sube con
// fechas reales, sin amenazas ni culpa. Dos versiones: tarjeta y ficha en efectivo.
// Colores de FICHA-ARTE.md en hex porque los clientes de correo no entienden variables CSS.

import { URL_PAGO_HOTMART, type PasoDunning } from '@/lib/dunning';

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

function fechaLarga(d: Date): string {
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Mexico_City' });
}

type Contenido = { asunto: string; titulo: string; tituloAcento: string; parrafos: string[]; boton: string };

function contenido(paso: PasoDunning, tipo: 'tarjeta' | 'ficha', limite: string): Contenido {
  const arreglo =
    tipo === 'tarjeta'
      ? 'Entra a tu cuenta de Hotmart con el correo de tu compra y actualiza tu tarjeta. Hotmart vuelve a intentar el cobro solo.'
      : 'Entra a tu cuenta de Hotmart con el correo de tu compra: ahí está tu ficha de pago, o puedes cambiar a tarjeta para no tener que pagar a mano en cada renovación.';
  const boton = tipo === 'tarjeta' ? 'Actualizar mi método de pago' : 'Ver mi ficha de pago';

  switch (paso) {
    case 1:
      return {
        asunto: tipo === 'tarjeta' ? 'Tu pago de Niki no pasó (se arregla en un minuto)' : 'Tu renovación de Niki está pendiente de pago',
        titulo: tipo === 'tarjeta' ? 'Tu pago no pasó: ' : 'Tu renovación está ',
        tituloAcento: tipo === 'tarjeta' ? 'se arregla rápido' : 'pendiente',
        parrafos: [
          tipo === 'tarjeta'
            ? 'Hotmart intentó cobrar tu renovación de Niki y el pago no pasó. Casi siempre es la tarjeta: venció, la cambiaste o el banco la frenó por seguridad.'
            : 'Como pagas en efectivo, cada renovación de Niki genera una ficha nueva, y la de este periodo todavía no está pagada.',
          arreglo,
          `Mientras tanto sigues con todo: tus Checks, tu racha y tu progreso están a salvo hasta el <strong>${limite}</strong>.`,
        ],
        boton,
      };
    case 2:
      return {
        asunto: 'Tu racha en Niki te está esperando',
        titulo: 'Tu progreso sigue ',
        tituloAcento: 'aquí',
        parrafos: [
          'Tu pago de Niki sigue pendiente. No pasa nada todavía: tu historial de Checks, tu racha y tu Ruta de Presencia siguen guardados.',
          arreglo,
          `Tienes acceso completo hasta el <strong>${limite}</strong>.`,
        ],
        boton,
      };
    case 3:
      return {
        asunto: `Tu acceso a Niki sigue hasta el ${limite}`,
        titulo: 'Te quedan ',
        tituloAcento: 'unos días',
        parrafos: [
          `Tu pago sigue sin pasar, así que tu acceso a Niki dura hasta el <strong>${limite}</strong>. Después ya no podrás hacer Checks nuevos.`,
          arreglo,
          'Si algo no te cuadra con el cobro, responde este correo y lo vemos contigo.',
        ],
        boton,
      };
    case 4:
      return {
        asunto: `Último aviso: tu acceso a Niki termina el ${limite}`,
        titulo: 'Último ',
        tituloAcento: 'aviso',
        parrafos: [
          `Es el último aviso: si el pago no pasa, tu acceso a Niki termina el <strong>${limite}</strong>.`,
          arreglo,
          'Si prefieres no seguir, no tienes que hacer nada: no se te cobrará y tu historial se queda guardado por si un día vuelves.',
        ],
        boton,
      };
  }
}

function textoPlano(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

export function correoDunning(opts: { paso: PasoDunning; tipo: 'tarjeta' | 'ficha'; nombre: string | null; limite: Date }) {
  const saludo = opts.nombre ? `Hola, ${escapar(opts.nombre.split(' ')[0])}` : 'Hola';
  const c = contenido(opts.paso, opts.tipo, fechaLarga(opts.limite));

  const texto = [
    `${saludo}:`,
    '',
    ...c.parrafos.flatMap((p) => [textoPlano(p), '']),
    `${c.boton}: ${URL_PAGO_HOTMART}`,
    '',
    `Tu Niki: ${URL_APP}`,
    '',
    'Niki',
  ].join('\n');

  const parrafosHtml = c.parrafos
    .map(
      (p, i) =>
        `<tr><td style="font-size:16px;line-height:1.5;padding-bottom:${i === c.parrafos.length - 1 ? 24 : 16}px;">${i === 0 ? `${saludo}. ` : ''}${p}</td></tr>`,
    )
    .join('\n        ');

  const html = `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:${COLOR.fondo};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.fondo};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${COLOR.tarjeta};border:1px solid ${COLOR.borde};border-radius:20px;padding:32px 24px;font-family:Arial,Helvetica,sans-serif;color:${COLOR.texto};">
        <tr><td style="font-size:16px;font-weight:bold;color:${COLOR.acento};padding-bottom:24px;">niki</td></tr>
        <tr><td style="font-size:24px;line-height:1.25;font-weight:bold;padding-bottom:16px;">${c.titulo}<span style="color:${COLOR.acento};">${c.tituloAcento}</span></td></tr>
        ${parrafosHtml}
        <tr><td style="padding-bottom:16px;">
          <a href="${URL_PAGO_HOTMART}" style="display:block;background:${COLOR.acento};color:${COLOR.fondo};text-decoration:none;font-size:16px;font-weight:bold;text-align:center;padding:16px;border-radius:14px;">${c.boton}</a>
        </td></tr>
        <tr><td style="font-size:13px;line-height:1.5;color:${COLOR.suave};text-align:center;">
          ¿Dudas con el cobro? Responde este correo y te ayudamos.
        </td></tr>
      </table>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${COLOR.suave};margin:16px 0 0;">Recibes este aviso porque tienes una suscripción a Niki en holaniki.com</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { asunto: c.asunto, html, texto };
}
