import { z } from 'zod';

// Forma del resultado de un Check de Presencia. La comparte el servidor (lo
// exige a la IA como salida estructurada) y las pantallas (lo muestran).
// Sin imports de servidor: se puede usar desde componentes 'use client'.

const Eje = z.object({
  nota: z.number().describe('Nota de 1 a 10 (entero).'),
  comentario: z
    .string()
    .describe('1 frase, máx. 110 caracteres: lo que funciona + el ajuste concreto. Tuteo, cálido.'),
});

export const MOTIVOS_FOTO = ['sin_persona', 'no_cuerpo_entero', 'muy_oscura', 'inapropiada', 'menor_de_edad'] as const;

export const ResultadoIA = z.object({
  foto_valida: z
    .boolean()
    .describe('true solo si se ve a UNA persona adulta, de cuerpo entero o casi, con luz suficiente.'),
  motivo_invalida: z.enum(MOTIVOS_FOTO).nullable().describe('null si foto_valida es true.'),
  outfit: Eje,
  postura: Eje,
  actitud: Eje,
  ajuste_clave: z
    .string()
    .describe('EL cambio concreto que más sube su presencia hoy. Imperativo, máx. 90 caracteres.'),
  frase_cierre: z
    .string()
    .describe('Frase motivadora personal según su puntaje, máx. 140 caracteres. Tuteo.'),
});

export type ResultadoIA = z.infer<typeof ResultadoIA>;

/** Lo que se guarda en `checks.resultado` y ve la pantalla. */
export type ResultadoCheck = Pick<ResultadoIA, 'outfit' | 'postura' | 'actitud' | 'ajuste_clave' | 'frase_cierre'>;

export function puntajeDe(r: ResultadoCheck): number {
  return Math.round(((r.outfit.nota + r.postura.nota + r.actitud.nota) / 3) * 10) / 10;
}

export const LIMITE_CHECKS_DIA = 3;

export const MENSAJE_FOTO: Record<(typeof MOTIVOS_FOTO)[number], string> = {
  sin_persona: 'No encontramos a una persona en la foto. Prueba con una foto tuya de cuerpo entero.',
  no_cuerpo_entero: 'Necesitamos verte de cuerpo entero (de la cabeza a los zapatos) para analizar tu outfit y postura.',
  muy_oscura: 'La foto está muy oscura para verte bien. Prueba cerca de una ventana o con más luz.',
  inapropiada: 'Esta foto no se puede analizar. Prueba con otra foto tuya, con la ropa con la que vas a salir.',
  menor_de_edad: 'Niki es solo para personas mayores de 18 años.',
};
