import { z } from 'zod';

// Forma del resultado de un Check de Presencia. La comparte el servidor (lo
// exige a la IA como salida estructurada) y las pantallas (lo muestran).
// Sin imports de servidor: se puede usar desde componentes 'use client'.

/** Tipo de ajuste que pide cada comentario (Ruta de Presencia, 2026-10-04): permite contar
    qué le marca Niki más seguido a cada persona y convertirlo en recomendaciones y misiones. */
export const TEMAS = {
  outfit: ['talla', 'colores', 'formalidad', 'calzado', 'capas', 'accesorios', 'cuidado', 'ninguno'],
  postura: ['hombros', 'cabeza', 'apoyo', 'brazos', 'espalda', 'ninguno'],
  actitud: ['sonrisa', 'mirada', 'tension', 'energia', 'apertura', 'ninguno'],
} as const;

export type ClaveEje = keyof typeof TEMAS;
export type TemaDe<E extends ClaveEje> = (typeof TEMAS)[E][number];

function eje<E extends ClaveEje>(clave: E) {
  return z.object({
    nota: z.number().describe('Nota de 1 a 10 (entero).'),
    comentario: z
      .string()
      .describe('1 frase corta, máx. 80 caracteres (2 renglones en el celular): lo que funciona + el ajuste concreto. Tuteo, cálido.'),
    tema: z
      .enum(TEMAS[clave] as unknown as [TemaDe<E>, ...TemaDe<E>[]])
      .describe('Tipo del ajuste concreto que pide el comentario; "ninguno" si no pide ajuste.'),
  });
}

export const MOTIVOS_FOTO = ['sin_persona', 'no_cuerpo_entero', 'muy_oscura', 'inapropiada', 'menor_de_edad'] as const;

export const ResultadoIA = z.object({
  foto_valida: z
    .boolean()
    .describe('true solo si se ve a UNA persona adulta, de cuerpo entero o casi, con luz suficiente.'),
  motivo_invalida: z.enum(MOTIVOS_FOTO).nullable().describe('null si foto_valida es true.'),
  outfit: eje('outfit'),
  postura: eje('postura'),
  actitud: eje('actitud'),
  ajuste_clave: z
    .string()
    .describe('EL cambio concreto que más sube su presencia hoy. Imperativo, máx. 90 caracteres.'),
  plan_alto_impacto: z
    .object({
      antes: z.string().describe('Justo antes de entrar/salir: 1 acción concreta, máx. 80 caracteres.'),
      al_llegar: z.string().describe('Los primeros 10 segundos al llegar: 1 acción, máx. 80 caracteres.'),
      durante: z.string().describe('Durante el evento: 1 acción, máx. 80 caracteres.'),
    })
    .nullable()
    .describe('SOLO si el mensaje dice "Modo Alto Impacto: activado"; si no, null.'),
  frase_cierre: z
    .string()
    .describe('Frase motivadora personal según su puntaje, máx. 140 caracteres. Tuteo.'),
});

export type ResultadoIA = z.infer<typeof ResultadoIA>;

/** Lo que se guarda en `checks.resultado` y ve la pantalla. */
/** Un eje tal como se guarda: `tema` falta en los Checks anteriores al 2026-10-04. */
type EjeGuardado<E extends ClaveEje> = { nota: number; comentario: string; tema?: TemaDe<E> };

export type ResultadoCheck = Pick<ResultadoIA, 'ajuste_clave' | 'frase_cierre'> & {
  outfit: EjeGuardado<'outfit'>;
  postura: EjeGuardado<'postura'>;
  actitud: EjeGuardado<'actitud'>;
  /** Solo en ocasiones de Alto Impacto (y en Checks hechos desde el 2026-09-28). */
  plan_alto_impacto?: ResultadoIA['plan_alto_impacto'];
};

/** Ocasiones donde se juega algo importante: activan el Modo Alto Impacto. */
export const OCASIONES_ALTO_IMPACTO = ['entrevista', 'cita', 'negocios', 'cena'];

/** Estado de la Racha Glow-Up que devuelve el servidor tras un Check. */
export type RachaTrasCheck = {
  racha: number;
  mejor: number;
  congeladores: number;
  congeladores_usados: number;
  hito: number | null;
  reiniciada: boolean;
};

export const META_GLOWUP = 21;

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
