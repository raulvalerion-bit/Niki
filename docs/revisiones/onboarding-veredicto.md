# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 10/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [fondo de toda la pantalla] FICHA-ARTE exige degradé `#FF9457→#FFB768→#FFD98A→#FFE9B0` ("atardecer sin sol"); el screenshot muestra un fill plano beige/crema sin degradé visible → aplicar el gradiente real en el body/contenedor raíz.
2. [zona inferior, debajo del último chip "Vacaciones" hasta el ícono flotante] ~200px de espacio muerto sin balance visual, layout se siente incompleto/descentrado → centrar verticalmente el bloque de pregunta+chips o recortar el alto del contenedor al contenido.
3. [Encabezado, todo el flujo] no existe ningún control para cerrar o saltar el onboarding completo, solo "volver" entre pasos (y en esta primera pantalla ni eso, queda invisible) → agregar affordance de salida (X o "saltar por ahora") en el componente Encabezado.
4. [chips de opción + barra de progreso superior] sin ningún rasgo del dispositivo ownable de la ficha (anillo de progreso / textura); barra fina genérica + chips estándar son intercambiables con cualquier app de quiz (Duolingo, Cal AI) → introducir un guiño del "Anillo Niki" o textura de fondo también en pantallas de pregunta, no reservarlo solo a la pantalla de resultado.
5. [lista de 6 chips, componente ChipOpcion en PantallaPregunta] en código, los 6 chips entran todos juntos dentro del mismo motion.div (sin stagger por ítem) → envolver cada ChipOpcion con delay incremental (i*0.04s), respetando useReducedMotion.
