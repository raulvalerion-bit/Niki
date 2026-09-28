import { describe, expect, it } from 'vitest';
import { puntajeDe } from '@/lib/ia/resultado';
import { costoUsd, normalizarNota } from '@/lib/ia/check-presencia';

const eje = (nota: number) => ({ nota, comentario: '' });

describe('resultado del Check', () => {
  it('el puntaje es el promedio de las 3 notas con un decimal', () => {
    expect(puntajeDe({ outfit: eje(8), postura: eje(6), actitud: eje(7), ajuste_clave: '', frase_cierre: '' })).toBe(7);
    expect(puntajeDe({ outfit: eje(9), postura: eje(8), actitud: eje(8), ajuste_clave: '', frase_cierre: '' })).toBe(8.3);
  });
  it('las notas fuera de rango se corrigen a 1-10 enteros', () => {
    expect(normalizarNota(12)).toBe(10);
    expect(normalizarNota(0)).toBe(1);
    expect(normalizarNota(6.6)).toBe(7);
  });
  it('el costo de un análisis coincide con lo medido en producción (~US$0.01)', () => {
    expect(costoUsd('claude-sonnet-5', 3855, 240)).toBeCloseTo(0.0101, 4);
  });
  it('un modelo desconocido se cobra al precio más alto (el tope nunca queda corto)', () => {
    expect(costoUsd('modelo-nuevo', 1_000_000, 0)).toBe(10);
  });
});
