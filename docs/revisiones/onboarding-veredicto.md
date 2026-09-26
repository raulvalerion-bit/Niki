# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-25 23:59
Screenshot: docs/revisiones/onboarding-final/09-resultado-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Screenshots evaluados: docs/revisiones/onboarding-final/01-apertura-375.png, 01b-apertura-retomar-375.png, 02-objetivo-375.png, 03-dolor-375.png, 04-reconocimiento1-375.png, 04b-confirmar-salida-375.png, 05-ocasion-375.png, 06-tiempo-375.png, 07-reconocimiento2-375.png, 08-cargando-375.png, 09-resultado-375.png, 09c-resultado-667.png · Código: app/onboarding/page.tsx (+ app/page.tsx:174 privacidad)
Detalle usabilidad: h1:3 h2:3 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
Top defectos:
1. [09 Resultado, franja del CTA fijo] A 812px la última línea de la nota ("gratis y arranca tu racha Glow-Up.") queda dentro del degradé de la franja fija y se ve lavada. A 667px (09c) la franja tapa entera la fila Outfit/Postura/Actitud y la nota "Sin notas crueles", que es la respuesta a la objeción 4, así que en la primera vista no aparece. Fix: bajar el tramo sólido del degradé a unos 30% (fade de 24px) y subir la nota "Sin notas crueles…" para que quede justo debajo de la tarjeta del plan, antes de los 3 candados.
2. [05 Ocasión, subtítulo] "Así ajustamos tus tres ejes de presencia e imagen." En la pasada anterior "ejes" ya se había marcado como lenguaje del sistema. En 09 se corrigió, pero aquí sigue. Fix: cambiarlo por "Así Niki adapta tu outfit, postura y actitud a ese momento."
3. [09 Resultado, CTA "Desbloquear mi Check de Presencia"] Es un Link sin estado de espera. En una red lenta, el toque no muestra nada hasta que carga /paywall y el usuario puede tocar dos veces o pensar que se colgó. Fix: al hacer click, poner un estado "Abriendo tus planes…" con un spinner inline dentro del botón (o usar useTransition con router.push).
4. [Todo el recorrido, repetición de marca] "Check de Presencia" aparece en el lema del encabezado de cada paso y además en el H1, en el texto y en el CTA. En 09 se lee 3 veces en una sola vista (lema, H1, CTA), y en 08 el título ocupa 3 líneas a 28px por esa frase. Fix: quitar el lema "Tu Check de Presencia antes de salir" del encabezado en los pasos con Encabezado (dejar solo "niki") y acortar el título de carga a "Armando tu Check…".
5. [04 Reconocimiento 1, composición] El bloque queda centrado en vertical, con unos 140px de aire muerto arriba y otros 180px abajo solo con los anillos decorativos. La pantalla se siente vacía comparada con 07, que tiene la tarjeta de ejemplo. Fix: añadir una fila de apoyo breve bajo el texto, por ejemplo un chip "Lo revisa en cada foto: Postura" con el ícono Move, o subir el bloque con justify-start y pt-16.
Resuelto respecto a la pasada anterior: 08 ya muestra la carga real a mitad (50%, líneas personalizadas con check, activo y pendiente). Los títulos están unificados en 28px (20px en la hoja). En 09, "ejes" se cambió por "Lo que Niki va a revisar en tu foto:". La objeción 4 ("Sin notas crueles: 3 ajustes") ya está en el resultado, y el trial "3 días gratis con el plan Anual" coincide con app/paywall/page.tsx:40. La apertura ya no repite el lema.
Movimiento verificado en código: stagger de opciones (i*0.06), ConteoPct de 0 a N, anillo de carga que se dibuja (strokeDashoffset), whileTap 0.97 en todos los CTA y opciones, AnimatePresence entre pasos, hoja con fade+slide, spring en la carita y la tarjeta del resultado, y useReducedMotion en todos.
Control/flexibilidad en código: volver, X con hoja de salida (Escape, foco atrapado, autoFocus), borrador que se retoma con "N de 4 respondidas", "Empezar de nuevo", flechas/Home/End en las opciones, bloqueo de doble toque y borrador borrado al tocar Desbloquear.
CTA héroe vivo: cumple 4 de 4. #7A3E1D con texto crema (unos 8:1), whileTap 0.97, nunca disabled, h-14 a ancho completo y fijo en la zona del pulgar.
Ficha: paleta atardecer, Unbounded/Manrope, acento #7A3E1D y radios 14/18 coinciden con FICHA-ARTE. El copy se traza a FICHA-AVATAR: "20 minutos frente al armario" (escena), "por pena" (dolor 1), objeciones 3 (ejemplo por ocasión) y 4 (sin notas crueles).
Nota (decisiones del dueño, no puntuadas): banner "¡Bienvenidos!" y carita de la apertura, carita del resultado, icono-4-esperando.gif (en 07 se sigue leyendo como un spinner de carga, en una pantalla que no está cargando), efecto 3D y 6 opciones de ocasión, el texto de las preguntas y "Glow-Up".
