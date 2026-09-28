import type { NextConfig } from "next";

// Cabeceras de seguridad (09/27/61 Gate 9). La CSP solo permite lo que la
// app usa de verdad: su propio dominio y el proyecto de Supabase (datos,
// fotos privadas y sesión). Hotmart y Resend no cargan nada en el navegador
// (Hotmart es una navegación de salida; Resend se llama desde el servidor).
const SUPABASE = "https://yniyllfhoydkdqowiunr.supabase.co";

const csp = [
  "default-src 'self'",
  // Next.js inyecta scripts inline para hidratar la página.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE}`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE} wss://yniyllfhoydkdqowiunr.supabase.co`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
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
