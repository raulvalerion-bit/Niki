import type { Metadata } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const TITULO = "Niki — Tu Check de Presencia antes de salir";
const DESCRIPCION =
  "Sube tu foto y recibe en 30 segundos 3 ajustes de outfit, postura y actitud para el evento al que vas — sin críticas crueles, con el tono de un coach que te quiere ver bien.";

export const metadata: Metadata = {
  metadataBase: new URL("https://holaniki.com"),
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "https://holaniki.com",
    siteName: "Niki",
    locale: "es_MX",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${unbounded.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
