# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-25 22:30
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 15/20
Copy: 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Screenshots evaluados: docs/revisiones/onboarding-final/01-apertura-375.png, 02-objetivo-375.png, 03-dolor-375.png, 04-reconocimiento1-375.png, 04b-confirmar-salida-375.png, 05-ocasion-375.png, 06-tiempo-375.png, 07-reconocimiento2-375.png, 08-cargando-375.png, 09-resultado-375.png · Código: app/onboarding/page.tsx (+ app/app/page.tsx y app/privacidad/page.tsx para verificar la promesa de privacidad)
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3
Top defectos:
1. [09 Resultado, CTA "Desbloquear mi Check de Presencia"] La captura mide 901px de alto y el botón empieza en y≈805. En un teléfono de 375×812 el botón principal del paso que lleva al pago queda bajo el pliegue, y el usuario ve primero la tabla y los candados sin saber qué sigue. Fix: bajar la carita a size-14 y mt-8→mt-5 en la tarjeta y los ejes para que el CTA quepa en 812, o hacer el CTA sticky al fondo (`sticky bottom-4`).
2. [app/privacidad/page.tsx:33 y :63, página enlazada por la promesa "Tus fotos son privadas"] Usa voseo ("las fotos que subís", "Podés pedir acceso"), cuando FICHA-AVATAR y FICHA-ARTE fijan tuteo LATAM neutro. Un usuario que abre la política desde el onboarding nota el cambio de voz de inmediato. Fix: "subes" y "Puedes" (y revisar el resto del archivo buscando -ís/-és).
3. [08 Cargando, título "Construyendo tu Check de Presencia…" y su lista] Es la única pantalla con el título alineado a la izquierda; todas las demás lo centran. Además, cada línea repite la respuesta completa en 2-3 renglones (bloque de 4 ítems y 9 líneas), lo que se lee como un muro durante una espera de ~3s. Fix: centrar el h1 como en el resto y acortar cada línea a un resumen ("Tu objetivo: autoridad en el trabajo").
4. [04b Hoja "¿Salir de tu Check de Presencia?"] Sigue avisando "tendrás que responder de nuevo". Las respuestas solo se guardan en localStorage al llegar a 'resultado' (page.tsx:739-746), así que salir a mitad borra todo y no hay forma real de retomarlo. Fix: persistir `respuestas` y `pasoIdx` en cada cambio y ofrecer "Retomar donde quedaste" al volver; entonces el texto pasa a "Guardamos tus respuestas".
5. [01 Apertura, subtítulo · Copy en general] La escena exacta de la ficha (20-30 min frente al armario / "nadie te dice la verdad por pena") no aparece en ningún texto propio del flujo: solo como opción del dueño en 03. El "juez." del subtítulo queda huérfano en su propia línea. Fix: "Nadie te dice la verdad por pena. En 4 preguntas armamos tu Check; después, cada foto te dice en 30 segundos qué ajustar", con text-balance para evitar la palabra huérfana.
Otros hallazgos: En 09 "Glow-Up" aparece con guion, mientras la ficha escribe "Glow Up". El título de 06 ocupa 5 líneas a 28px (texto del dueño, pero se podría bajar el tamaño a 24px solo en esa pantalla).
Resuelto respecto a la pasada anterior: la promesa de privacidad ahora es verdadera ("Tus fotos son privadas: solo tú las ves", con bucket privado por user_id en app/app/page.tsx:79). El subtítulo ya no promete un análisis durante el onboarding. En 04 se corrigió el femenino ("por tu cuenta"). Se quitó el punto lima de "Actitud" y las 3 tarjetas de eje ahora tienen borde de acento al 20%. La llama quedó inline. El stagger subió a 60ms (i * 0.06). Y 04 usa "Seguir con mi Check" en primera persona.
CTA héroe vivo: cumple 3 de 4 en todo el flujo (contraste #7A3E1D con texto crema ≈8:1, whileTap 0.97, nunca disabled, h-14 a ancho completo). En 09 falla la zona del pulgar porque queda fuera del primer viewport (defecto 1).
Nota (decisiones del dueño, no puntuadas): el banner "¡Bienvenidos!" (raster, con tipografía ajena a Unbounded/Manrope), la carita de apertura y la de resultado, el gif de 07, que se sigue leyendo como un spinner verde en una pantalla que no carga, el efecto 3D de ocasión, las 6 opciones y el texto de las 4 preguntas (03 pregunta "al vestirte" con opciones que no son de vestir; "nervioso" está en masculino).
