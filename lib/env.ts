// Falla al arrancar si falta una variable requerida — mejor un crash claro en
// desarrollo que la app corriendo silenciosamente contra una config rota
// (09-SEGURIDAD.md). Este archivo viaja al navegador (cliente de Supabase), por
// eso valida sin zod: zod pesaba ~20 KB comprimidos en cada pantalla que inicia
// sesión. Las variables del servidor se validan con zod en lib/env-server.ts.
function requerida(nombre: string, valor: string | undefined): string {
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}`);
  return valor;
}

function urlValida(nombre: string, valor: string | undefined): string {
  const v = requerida(nombre, valor);
  try {
    new URL(v);
  } catch {
    throw new Error(`La variable de entorno ${nombre} no es una URL válida`);
  }
  return v;
}

// process.env.NEXT_PUBLIC_* se escribe literal para que Next lo incruste en el bundle.
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: urlValida('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: requerida(
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ),
};
