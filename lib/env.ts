import { z } from 'zod';

// Falla al arrancar si falta una variable requerida — mejor un crash claro en
// desarrollo que la app corriendo silenciosamente contra una config rota
// (09-SEGURIDAD.md). Se amplía a medida que se conectan más servicios
// (IA, Resend, Hotmart) en la Sesión de Servicios Externos.
const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export const env = schema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
