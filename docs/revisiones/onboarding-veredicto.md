# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-25 23:59
Screenshot: docs/revisiones/onboarding-final/09-resultado-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): 17/20
Copy: 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Screenshots evaluados: docs/revisiones/onboarding-final/01-apertura-375.png, 01b-apertura-retomar-375.png, 02-objetivo-375.png, 03-dolor-375.png, 04-reconocimiento1-375.png, 04b-confirmar-salida-375.png, 05-ocasion-375.png, 06-tiempo-375.png, 07-reconocimiento2-375.png, 08-cargando-375.png, 09-resultado-375.png, 09c-resultado-667.png · Código: app/onboarding/page.tsx (+ app/app/page.tsx, app/privacidad/page.tsx)
Detalle usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:3 acción:4
Top defectos:
1. [08 Cargando, evidencia] El archivo 08-cargando-375.png es una copia de la pantalla de resultado (chip "HECHO CON TUS 4 RESPUESTAS", misma tarjeta, mismo CTA): la pantalla de carga NO se vio. Las líneas personalizadas ("Leyendo tu objetivo: ...", "Lo que te frena: ...") existen en el código (líneas 899-904), pero su render no se verificó. Por eso h1 baja a 3. Fix: capturar 08 a mitad de la carga (por ejemplo, con activo=1 o pausando el setTimeout) y volver a enviarla.
2. [09 Resultado, franja del CTA fijo] El contenedor fijo pinta linear-gradient(to top, var(--bg) 70%, transparent). Ese color crema no es el del degradé de la página: a 812px queda una banda pálida con corte visible bajo el botón, y a 667px tapa y deslava "Outfit / Postura / Actitud". Fix: usar como color de la franja el tono real del fondo en esa altura (o un fade de 24px sin tramo sólido) y darle al <ul> de ejes un scroll-margin para que no quede a medio cubrir.
3. [09 Resultado, copy de oferta] FICHA-AVATAR, objeción 4, pide que la respuesta viva en la "primera pantalla de resultado", y aquí no aparece nada contra las "notas crueles". Además, "Al activar tu plan" no dice qué implica activarlo, aunque la landing promete "Trial VIP de 3 días". Fix: cambiar la nota por "Empiezas con 3 días de prueba. Sin notas crueles: siempre 3 ajustes que puedes hacer hoy".
4. [Títulos de todo el recorrido] El título de pantalla tiene 6 tamaños distintos para la misma función: 30 (apertura), 28 (preguntas cortas), 26 (reconocimientos y resultado), 24 (preguntas largas), 22 (carga) y 20 (hoja). Fix: dejar 2 tamaños, 28px para los títulos de pantalla y 20px para la hoja, y resolver las preguntas largas con text-balance en vez de achicar la letra.
5. [Apertura, encabezado + 09 Resultado] El subtítulo de marca "Tu Check de Presencia antes de salir" repite palabra por palabra el H1 que está justo debajo. En 09, "Check de Presencia" sale 3 veces (H1, rótulo de ejes, CTA) y "ejes" es lenguaje del sistema. Fix: ocultar el subtítulo de marca en la apertura y cambiar "Los 3 ejes que analizará tu Check de Presencia:" por "Lo que Niki va a revisar en tu foto:".
Resuelto respecto a la pasada anterior: CTA fijo, visible a 667px (09c). "Retomar mi Check · 2 de 4 respondidas" cuenta bien y el borrador en reconocimiento2 muestra "Ver mi Check de Presencia" (líneas 840-844). Las tiles de ejes ahora son filas planas con candado y ya no parecen tocables. Las líneas de carga están personalizadas en el código.
Movimiento verificado en código: stagger de opciones (i*0.06), ConteoPct 0->N, anillo de carga que se dibuja (strokeDashoffset), whileTap 0.97 en todos los CTA y opciones, transición entre pasos con AnimatePresence, hoja modal con fade+slide, spring de celebración en el resultado y useReducedMotion en todos.
Control/flexibilidad en código: volver, salir con hoja (Escape + foco atrapado + autoFocus), borrador que se retoma, "Empezar de nuevo", flechas/Home/End en las opciones y bloqueo de doble toque (return si elegido).
CTA héroe vivo: cumple 4 de 4. #7A3E1D con texto crema ≈8:1, whileTap 0.97, nunca disabled, h-14 a ancho completo y fijo en la zona del pulgar.
Ficha: paleta atardecer, Unbounded/Manrope, acento #7A3E1D, radios 14/18 coinciden con FICHA-ARTE. Privacidad: "solo tú las ves" es coherente con app/app/page.tsx:174.
Nota (decisiones del dueño, no puntuadas): banner "¡Bienvenidos!" y carita de la apertura, carita del resultado, icono-4-esperando.gif (en 07 se sigue leyendo como un spinner verde), efecto 3D y 6 opciones de ocasión, el texto de las preguntas y "Glow-Up".
