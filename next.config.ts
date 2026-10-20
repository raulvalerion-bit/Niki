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
  // PROBADO y DESCARTADO 2026-10-20 (/velocidad): experimental.inlineCss duplica el CSS
  // (una vez en <style>, otra en el payload de hidratación RSC — advertencia documentada
  // en node_modules/next/dist/docs/.../inlineCss.md) y en esta app eso pesó más de lo que
  // ahorró: medido en producción, +238 KB y LCP peor (4.8s vs 3.5s) en las 4 pantallas
  // clave, con un salto visual (CLS 0.045) que antes no existía. No reactivar sin volver a
  // medir con el mismo método (Lighthouse móvil contra holaniki.com, 2-3 corridas).
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
