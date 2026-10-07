# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-06 14:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Screenshots evaluados: docs/revisiones/repaso-2026-10-06/onboarding-00, 01, 02, 03, 04 (nueva), 05, 06, 07, 09 (nueva) (-375.png) · Código: app/onboarding/page.tsx + components/landing/ui.tsx (EnlaceCta)
Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
Top defectos:
1. [09 Resultado, fila "Lo que Niki va a revisar en tu foto:" (app/onboarding/page.tsx:738-757)] Defecto nuevo de esta pasada. Al subir la nota, la fila Outfit/Postura/Actitud bajó y a 812px el CTA fijo tapa sus 3 candados: solo se leen las etiquetas, cortadas, justo encima del botón. A 667px la fila desaparece entera. Fix: compactar la fila a una línea de 3 chips "Outfit · Postura · Actitud", cada uno con un Lock de 12px dentro (h-8, gap-2), o quitar el subtítulo de la línea 738 y meter los 3 chips como quinta fila de la tarjeta del plan ("Niki revisa").
2. [00 Apertura, banner "¡Bienvenidos!" (page.tsx:426-430), DECISIÓN DEL DUEÑO, sin corregir] Según el coordinador, el banner lo pidió el dueño; no puedo verificarlo en ningún archivo. Su amarillo saturado no aparece en FICHA-ARTE, compite con el H1 como segundo titular y el plural masculino choca con el tuteo singular. Fix: si el dueño lo confirma, registrar el banner y su amarillo en FICHA-ARTE.md con fecha y usos permitidos (como se hizo con --gold y --gray-claro); si no, retirarlo y dejar a niki-saludando como héroe sobre el H1.
3. [Encabezado de todos los pasos (page.tsx:202)] Sin corregir desde el 2026-09-25. El lema "Tu Check de Presencia antes de salir" se repite en cada paso, y en 09 la frase "Check de Presencia" aparece 3 veces en una sola vista (lema, H1, CTA). Fix: dejar solo "niki" en el encabezado de los pasos.
4. [03 Reconocimiento, composición] Sin corregir. Hay unos 140px de aire muerto arriba y unos 200px abajo, ocupados solo por los anillos decorativos. Fix: pasar a justify-start con pt-16 o añadir un chip de apoyo ("Lo revisa en cada foto: Outfit").
5. [00 Apertura, niki-saludando (page.tsx:435)] Es un img estático, sin entrada ni gesto, en la única pantalla donde la mascota saluda. Fix: motion.img con spring de entrada y un balanceo único de la mano (rotate -8→8→0, 600ms), respetando useReducedMotion.
Resuelto en esta pasada (verificado en screenshot y código): la nota "Sin notas crueles… 3 días gratis" ya se lee entera, sin lavado (page.tsx:731-736, degradé al 30%) · niki-celebrando pasó a size-20 mt-4, consistente con 00/06 · el subtítulo de Ocasión es "Así Niki adapta tu outfit, postura y actitud a ese momento." · el CTA usa EnlaceCta (components/landing/ui.tsx:154-180) con spinner Loader2, aria-busy, aviso a los 8 s "Revisa tu conexión y vuelve a tocar" y role=status para lectores de pantalla.
CTA héroe vivo: cumple 4/4 (#7A3E1D con texto crema, unos 8:1, whileTap 0.97 en MotionLink, nunca disabled, h-14 a ancho completo y fijo en la zona del pulgar) y ahora muestra un estado de espera.
Ficha: Unbounded/Manrope, acento #7A3E1D, radios 14/18 y degradé atardecer coinciden con FICHA-ARTE. El único desvío es el amarillo del banner, que queda sin registrar (defecto 2).
Condición: esta pasada llega justo a los umbrales (36/40 y 16/20). Si el dueño no confirma el banner y este no se registra en la ficha, la pantalla vuelve a NO LISTA en la próxima revisión.
