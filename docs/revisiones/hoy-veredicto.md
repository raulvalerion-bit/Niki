# VEREDICTO revisor-visual — Hoy (M0, pantalla principal) — quinta pasada
Fecha: 2026-09-28 16:00
Screenshot: docs/revisiones/hoy-375-viewport.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (no bloquean; se corrigen en el próximo pulido) 1) [encabezado, bajo "niki"] "Tu presencia, lista para salir" está a 10px (app/app/layout.tsx:51), por debajo del mínimo de 11-13px para labels y difícil de leer sobre el naranja -> subirlo a 12px. 2) [tarjeta Racha Glow-Up] "Día 5 de 21" no dice qué pasa al llegar a 21 (la meta del Glow-Up sin recompensa visible) -> sumar esa promesa a la línea desplegable de congeladores o al detalle ("Al día 21 completas tu Glow-Up"). 3) [captura de página completa docs/revisiones/hoy-375.png] la barra de pestañas aparece a media página: es un efecto de capturar con sticky, no un defecto de la UI -> la evidencia de referencia es la captura del viewport (hoy-375-viewport.png); si hace falta una captura de página completa, tomarla con la barra oculta.
