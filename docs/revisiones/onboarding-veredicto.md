# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-06 16:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Screenshots evaluados: docs/revisiones/repaso-2026-10-06/onboarding-00..09-375.png (regeneradas, 3a pasada) · Código: app/onboarding/page.tsx + components/landing/ui.tsx (EnlaceCta)
Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
Top defectos:
1. [00 Apertura, banner "¡Bienvenidos!" (app/onboarding/page.tsx:426-430), DECISIÓN DEL DUEÑO, sin registrar] Su amarillo saturado no está en FICHA-ARTE, compite con el H1 como segundo titular y el plural masculino choca con el tuteo singular. Fix: registrarlo en FICHA-ARTE.md con fecha, color y usos permitidos (como --gold/--gray-claro) cuando el dueño lo confirme; si no lo confirma, retirarlo.
2. [09 Resultado, chips Outfit/Postura/Actitud (page.tsx:742-752)] Ya se ven completos a 812px, pero quedan a unos 8px del borde superior de la franja del CTA, apretados contra el botón. Además son píldoras con fondo de acento, la misma forma que tendría un chip tocable, y no responden al tocarlas. Fix: cambiar mt-6 por mt-4 en el subtítulo (línea 739) para ganar aire, y darles un borde fino sin relleno (o quitar rounded-full por radius 8) para que no parezcan filtros.
3. [Encabezado de todos los pasos (page.tsx:202)] Sin corregir. El lema "Tu Check de Presencia antes de salir" se repite en cada paso, y en 09 "Check de Presencia" aparece 3 veces en una sola vista. Fix: dejar solo "niki" en el encabezado de los pasos.
4. [03 Reconocimiento, composición] Sin corregir. Hay unos 140px de aire muerto arriba y unos 200px abajo. Fix: pasar a justify-start con pt-16 o añadir un chip de apoyo.
5. [00 Apertura, niki-saludando (page.tsx:435)] Es un img estático, sin entrada ni gesto. Fix: motion.img con spring de entrada y un balanceo único de la mano (600ms), respetando useReducedMotion.
Resuelto en esta pasada: la fila de lo que Niki revisa es ahora una sola línea de 3 chips con candado de 12px y aria-label en la lista; ya no la tapa el CTA a 812px. Se mantiene lo resuelto en la 2a pasada: nota de la prueba gratis legible, mascota del resultado a size-20, subtítulo de Ocasión sin "ejes" y EnlaceCta con spinner, aria-busy y aviso a los 8 s.
Medición anónima y Vercel Analytics: sin efecto visual, no se puntúan.
CTA héroe vivo: 4/4. Ficha: coincide salvo el amarillo del banner (defecto 1).
Condición: esta pasada llega justo a los umbrales (36/40 y 16/20). Si el banner no se registra en la ficha con la confirmación del dueño, la pantalla vuelve a NO LISTA en la próxima revisión.
