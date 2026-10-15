/** Forma mínima de un correo (algo@algo.algo, sin espacios). La validación real la hace Supabase al enviar el código. */
export function correoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}
