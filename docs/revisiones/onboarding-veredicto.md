# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-18 00:00
Screenshot: docs/revisiones/onboarding-02-objetivo-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Toda pantalla: apertura, reconocimiento1/2, objetivo, dolor, ocasión, resultado] El contenido queda anclado arriba y deja la mitad inferior de la pantalla vacía (solo dos círculos decorativos tenues) → centrar verticalmente el bloque completo en pantallas cortas o llenar el tercio inferior con contenido real.
2. [Título de apertura, opción "Glow-Up" en objetivo, titular de resultado] Anglicismo crudo "Glow-Up" repetido en 3 pantallas clave viola la regla de "0 inglés crudo en UI" → traducir o limitar su uso a una sola mención justificada.
3. [FICHA-ARTE §Brand kit vs código onboarding/page.tsx] El acento secundario #B7DE2A reservado para el ícono de "Actitud" nunca se usa: ChipOpcion y las tarjetas del eje "Actitud" siempre pintan el ícono en var(--accent) marrón → aplicar el lima donde la ficha lo especifica o retirarlo de la ficha.
4. [Pantalla "ocasión", grid de tarjetas] La decisión ofrece 5 opciones (4 en grid + "Otra ocasión importante" a ancho completo), supera el límite de ≤4 opciones por decisión del propio gate de carga cognitiva → fusionar dos ocasiones o convertir "Otra" en enlace de texto.
5. [Títulos "¿Cuál es tu mayor frustración al vestirte antes de salir?" y "¿Para qué momentos necesitas a Niki con más urgencia?"] Ambos superan las 8 palabras del límite del sistema y ocupan 3 líneas completas en 28px bold, empujando las opciones hacia abajo → recortar a ≤8 palabras.
