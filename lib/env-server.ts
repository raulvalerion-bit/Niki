import { z } from 'zod';

// Variables que SOLO existen en el servidor (nunca NEXT_PUBLIC_*). Separado
// de lib/env.ts para que ningún componente 'use client' pueda importar esto
// por accidente e incrustar la clave de servicio en el bundle del navegador
// (09-SEGURIDAD.md). Solo lo importan rutas de servidor (app/api/**, Server
// Components/Actions que lo requieran explícitamente).
const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
});

export const envServer = schema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
});
