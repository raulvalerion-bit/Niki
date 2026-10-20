import type { NextConfig } from "next";

// Cabeceras de seguridad (09/27/61 Gate 9). La CSP solo permite lo que la
// app usa de verdad: su propio dominio y el proyecto de Supabase (datos,
// fotos privadas y sesión). Hotmart y Resend no cargan nada en el navegador
// (Hotmart es una navegación de salida; Resend se llama desde el servidor).
// Meta: el píxel (lib/pixel.ts) solo se carga en páginas de venta y tras aceptar cookies.
const SUPABASE = "https://yniyllfhoydkdqowiunr.supabase.co";
const META_SCRIPT = "https://connect.facebook.net";
const META_ENVIO = "https://www.facebook.com";

const csp = [
  "default-src 'self'",
  // Next.js inyecta scripts inline para hidratar la página.
  `script-src 'self' 'unsafe-inline' ${META_SCRIPT}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE} ${META_ENVIO}`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE} wss://yniyllfhoydkdqowiunr.supabase.co ${META_SCRIPT} ${META_ENVIO}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
  // Tráfico frío de ads (TikTok/Meta) = casi siempre primera visita: el CSS
  // atómico de Tailwind es chico, así que el intercambio del 38 favorece
  // inlinearlo (quita la espera de red antes de pintar) sobre dejarlo en caché
  // para visitas que vuelven. La CSP ya permite 'unsafe-inline' en style-src.
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // La cámara/galería se usa con <input type="file">, que no necesita permiso.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
