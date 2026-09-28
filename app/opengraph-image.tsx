import { ImageResponse } from 'next/og';

// Imagen que aparece al compartir holaniki.com en WhatsApp/redes (45 SEO).
// Degradé atardecer + Anillo Niki (FICHA-ARTE), texto en marrón de marca.
export const alt = 'Niki — Tu Check de Presencia antes de salir';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Imagen() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 96px',
          gap: 64,
          background: 'linear-gradient(160deg, #FF9457 0%, #FFB768 42%, #FFD98A 78%, #FFE9B0 100%)',
          color: '#3C2412',
        }}
      >
        <svg width="220" height="220" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="19" stroke="#3C2412" strokeWidth="6" strokeLinecap="round" strokeDasharray="119.4" strokeDashoffset="28" transform="rotate(-90 26 26)" />
          <circle cx="26" cy="7.2" r="4.5" fill="#3C2412" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 700 }}>
          <div style={{ fontSize: 44, fontWeight: 700, opacity: 0.85 }}>niki</div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginTop: 12 }}>Tu Check de Presencia antes de salir</div>
          <div style={{ fontSize: 30, marginTop: 24, color: '#7A3E1D' }}>Outfit · Postura · Actitud — en 30 segundos</div>
        </div>
      </div>
    ),
    size
  );
}
