# VEREDICTO revisor-visual — landing
Fecha: 2026-10-04 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 13/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA final dorado + bloques "En 6 meses"/"Después"] Se usa --gold #D4A72C como tercera nota de marca, pero FICHA-ARTE.md solo fija el acento #7A3E1D y la segunda nota #B7DE2A: es un desvío respecto a la ficha y deja 3 colores de marca → fix: registrar --gold en el Brand kit de FICHA-ARTE (con su rol y sus usos) o quitarlo de los bloques.
2. [Hero, visual del teléfono] El dato principal (anillo 7.3) es una imagen estática: no cuenta el número ni dibuja el anillo, y no hay celebración. Quedan 2 de las 7 animaciones base (entrada escalonada y respuesta al toque) → fix: superponer el anillo como SVG animado (se dibuja y cuenta de 0 a 7.3, respetando reduced-motion) sobre la captura.
3. [Hero, mascota en top:118px a la izquierda del teléfono] La mascota (88px, aro marrón) queda a la misma altura y casi del mismo tamaño que el anillo 7.3 (unos 97px): se ven dos aros marrones lado a lado y el dato principal pierde fuerza. No tapa contenido (solo pisa el marco del teléfono) → fix: bajarla a la zona de las tarjetas (top ~380px) o reducirla a 64px.
4. [Hero, entrada de la mascota en page.tsx] spring stiffness 260 / damping 14 (amortiguación ~0.43) + rotate -14° da un rebote marcado, contrario a "spring suave (sin rebote exagerado)" de FICHA-ARTE → fix: damping ≥22 y rotate ≤6°.
5. [Hero bajo el CTA, recap del CTA final, Oferta] Palabras en inglés sin traducir: "Trial VIP", "tus Scans", "Racha Glow-Up". La mascota de 112px del CTA final además empuja el CTA ~128px hacia abajo y sus destellos dorados se pierden sobre el fondo dorado → fix: "Prueba VIP gratis de 3 días" / "tus Checks", y mascota del CTA final a 80px.
Nota: el screenshot de página completa (375x8330) solo se pudo ver reducido (~90x2000). El encaje óptico de detalle no se verificó a escala real; el traslape de la mascota se midió en el código contra la captura resultado.jpg.
