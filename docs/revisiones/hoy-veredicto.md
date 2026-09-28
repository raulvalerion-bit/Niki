# VEREDICTO revisor-visual — Hoy (M0, pantalla principal) — cuarta pasada
Fecha: 2026-09-28 15:00
Screenshot: docs/revisiones/hoy-375.png
Usabilidad: 33/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [barra de pestañas, app/app/layout.tsx:62 y 93] en docs/revisiones/hoy-375-viewport.png (375x812) la navegación principal NO se ve: está en y=879. La barra tiene `sticky bottom-0`, pero el `overflow-x-hidden` del <main> lo convierte en contenedor de scroll y anula el sticky; el efecto es que en Hoy (y en cualquier pestaña larga) hay que bajar hasta el final para cambiar de sección. No es "parte del flujo por diseño": el código pide sticky y no se cumple -> cambiar `overflow-x-hidden` por `overflow-x-clip` en el <main> (recorta igual y no crea contenedor de scroll) y volver a capturar el viewport de 812px con la barra visible abajo. 2) [anillo héroe "7.3 de 10"] el número está solo, sin interpretación: no dice si mejoró o empeoró ni contra qué (la regla de datos del SO pide insight, no solo la cifra) -> agregar bajo el anillo la variación contra el Check anterior ("↑ 0.4 vs tu Check del 25 sep") o, si solo hay uno, "Tu primer puntaje: la base para medir tu avance". 3) [encabezado, bajo el logo] "Tus ejes de Presencia e Imagen": "ejes" es vocabulario interno del producto, no del usuario, y aparece en todas las pestañas -> cambiarlo por una línea en su idioma ("Tu presencia, lista para salir") o quitarlo y dejar solo el logo.
