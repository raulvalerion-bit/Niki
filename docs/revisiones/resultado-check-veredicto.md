# VEREDICTO revisor-visual — Resultado del Check de Presencia
Fecha: 2026-09-28 17:00
Screenshot: docs/revisiones/resultado-check-375.png
Usabilidad: 37/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (6ª pasada; pasa el gate doble con 37/40 y 16/20. Resueltos: catch con aborted primero, siCancelo antes del throw de la subida y después de res.json(), mensaje de cancelación según pidioAnalisisRef, total real de gemas desde /api/check, notas unificadas en text-primary, atajo "Probar de nuevo con el ajuste". Lo que sigue son mejoras menores y no bloquean.) 1) [Bajo el botón Listo] Hay tres líneas seguidas (Listo, "Probar de nuevo con el ajuste" y el contador) y la vista mide ~1.3 pantallas. Fix: unir contador y atajo en una línea ("Probar de nuevo con el ajuste · te quedan 2"). 2) [Chip de gema] "ya llevas 5" da el número pero no para qué sirven las gemas. Fix: cuando exista el uso de las gemas, nombrarlo en el chip o en un tooltip. 3) [Tarjetas Tu ajuste clave y Postura] Las dos llevan sombra y compiten por la profundidad. Fix: sombra solo en el ajuste clave; la tarjeta "fuerte" se distingue solo por fondo y borde. 4) [Vocabulario] "Outfit" y "Checks" en inglés se aceptan como términos de marca aprobados. Fix: anotarlos en la FICHA como glosario de marca para que no se mezclen con otras variantes. 5) [Chip de gema] El GIF de la gema a 16 px se lee como el emoji 💎. Fix: subirlo a 18-20 px o usar una versión con el trazo de la marca para que se lea como ícono propio.
