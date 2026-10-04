# VEREDICTO revisor-visual — Progreso ("Tu Ruta de Presencia")
Fecha: 2026-10-04 12:00
Screenshot: docs/revisiones/progreso-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 
1. [Aviso "Tu mes con Niki", arriba] Bloque relleno de --gold #D4A72C: la FICHA-ARTE lo restringe SOLO a "Después" y CTA final de la landing. Es un desvío de la ficha y además es el elemento más saturado de la pantalla, así que le roba el foco a la tarjeta "Tu foco". -> Usar superficie crema con hairline degradé y la mascota, o registrar el uso en la ficha con aprobación del dueño.
2. [Anillos de nivel de las 3 tarjetas + puntajes de "Tus Checks"] Hay dos escalas /10 sin explicación: "Nivel 4" frente a Checks de 5.3/6.3. El usuario no sabe qué significa un 4 ni cuánto le falta para subir. -> Mostrar "4/10" y una línea de avance con los datos que ya se calculan (p.metaSiguiente/avance), por ejemplo "Promedio 6.0 · nivel 5 desde 6.0".
3. [Pantalla completa] No hay una acción primaria: el "qué sigue" se queda en texto y la tarjeta "Tu foco" no lleva a hacer nada. -> Agregar en la tarjeta foco un CTA "Hacer un Check enfocado en Actitud" (h-12, acento) que lleve a /app.
4. [Jerarquía general] No hay un dato héroe. Las 3 tarjetas pesan igual, el número del anillo mide 18px y el titular de 24px es lo más grande. Al entrecerrar los ojos no se lee un nivel 1. -> Subir el anillo de la tarjeta foco (o un resumen global) a 72-88px con número display de 28px+ y conteo animado (baseline #2, que hoy falta).
5. [Aviso de resumen + lista "Tus Checks"] Cuando se abre el resumen, el aviso desaparece para siempre (localStorage) y no queda ninguna forma de volver a ver ese mes. Además, todos los Checks usan el mismo ícono Sparkles genérico, aunque la ocasión sea distinta. -> Agregar un enlace persistente "Resúmenes de meses anteriores" bajo el titular y un ícono por ocasión (Briefcase/Heart/Users…).
