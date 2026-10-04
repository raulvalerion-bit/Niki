import { redirect } from 'next/navigation';

// "Historial" ahora vive dentro de Progreso (Ruta de Presencia, 2026-10-04).
// El detalle de cada Check sigue en /app/historial/[id].
export default function Historial() {
  redirect('/app/progreso');
}
