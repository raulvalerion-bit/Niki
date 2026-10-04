import { describe, expect, it } from 'vitest';
import { ejeFoco, nivelDePromedio, progresoEje, promedioParaNivel, resumenMes, type CheckProgreso } from '@/lib/progreso';

let n = 0;
function check(fecha: string, notas: [number, number, number], temas?: [string?, string?, string?], ocasion = 'cita'): CheckProgreso {
  const [o, p, a] = notas;
  return {
    id: String(n++),
    ocasion,
    created_at: `${fecha}T18:00:00`,
    puntaje: Math.round(((o + p + a) / 3) * 10) / 10,
    resultado: {
      outfit: { nota: o, comentario: 'c-outfit', ...(temas?.[0] ? { tema: temas[0] as never } : {}) },
      postura: { nota: p, comentario: 'c-postura', ...(temas?.[1] ? { tema: temas[1] as never } : {}) },
      actitud: { nota: a, comentario: 'c-actitud', ...(temas?.[2] ? { tema: temas[2] as never } : {}) },
      ajuste_clave: '',
      frase_cierre: '',
    },
  };
}

describe('niveles de la Ruta de Presencia', () => {
  it('menos de 5 es nivel 1 y cada medio punto sube uno', () => {
    expect(nivelDePromedio(4.9)).toBe(1);
    expect(nivelDePromedio(5)).toBe(2);
    expect(nivelDePromedio(6.3)).toBe(4);
    expect(nivelDePromedio(7)).toBe(6);
    expect(nivelDePromedio(10)).toBe(10);
    expect(promedioParaNivel(4)).toBe(6);
  });

  it('con menos de 3 Checks sigue en nivel 1', () => {
    const p = progresoEje([check('2026-09-01', [9, 9, 9]), check('2026-09-02', [9, 9, 9])], 'outfit');
    expect(p.nivel).toBe(1);
    expect(p.actual).toBe(9);
  });

  it('el nivel nunca baja aunque los últimos Checks salgan peor', () => {
    const buenos = [1, 2, 3, 4, 5].map((d) => check(`2026-09-0${d}`, [8, 6, 6]));
    const malos = [6, 7, 8].map((d) => check(`2026-09-0${d}`, [5, 6, 6]));
    const p = progresoEje([...buenos, ...malos], 'outfit');
    expect(p.nivel).toBe(8);
    expect(p.actual).toBeLessThan(8);
    expect(p.tendencia).toBeLessThan(0);
  });

  it('recomienda primero lo que Niki le marcó más veces', () => {
    const cs = [
      check('2026-09-01', [6, 5, 7], [undefined, 'hombros']),
      check('2026-09-02', [6, 5, 7], [undefined, 'apoyo']),
      check('2026-09-03', [6, 6, 7], [undefined, 'hombros']),
      check('2026-09-04', [6, 6, 7], [undefined, 'ninguno']),
    ];
    const p = progresoEje(cs, 'postura');
    expect(p.recomendaciones.map((r) => [r.tema, r.veces, r.de])).toEqual([
      ['hombros', 2, 4],
      ['apoyo', 1, 4],
    ]);
    expect(p.siguientePaso).toMatch(/Hombros atrás/);
  });

  it('en Checks viejos sin tipo de ajuste usa el último comentario', () => {
    const p = progresoEje([check('2026-09-01', [6, 6, 6])], 'actitud');
    expect(p.recomendaciones).toEqual([]);
    expect(p.siguientePaso).toBe('c-actitud');
  });

  it('el foco es el eje con menor promedio reciente', () => {
    const cs = [check('2026-09-01', [7, 5, 8]), check('2026-09-02', [7, 6, 8])];
    expect(ejeFoco(['outfit', 'postura', 'actitud'].map((e) => progresoEje(cs, e as never)))).toBe('postura');
    expect(ejeFoco(['outfit', 'postura', 'actitud'].map((e) => progresoEje([], e as never)))).toBeNull();
  });
});

describe('resumen del mes', () => {
  const cs = [
    ...[1, 2, 3].map((d) => check(`2026-08-0${d}`, [6, 5, 7], undefined, 'amigos')),
    check('2026-09-05', [7, 6, 7], undefined, 'cita'),
    check('2026-09-12', [8, 7, 7], undefined, 'entrevista'),
    check('2026-09-20', [7, 7, 7], undefined, 'cita'),
  ];

  it('compara cada eje contra el mes anterior y cuenta cuántos subieron', () => {
    const r = resumenMes(cs, '2026-09')!;
    expect(r.total).toBe(3);
    expect(r.porEje).toEqual([
      { eje: 'outfit', antes: 6, ahora: 7.3 },
      { eje: 'postura', antes: 5, ahora: 6.7 },
      { eje: 'actitud', antes: 7, ahora: 7 },
    ]);
    expect(r.subio).toBe(2);
    expect(r.mejor?.ocasion).toBe('entrevista');
    expect(r.nivelesNuevos.map((x) => x.eje)).toContain('outfit');
    expect(r.ocasionNueva).toBe('negocios');
  });

  it('un mes sin Checks no tiene resumen', () => {
    expect(resumenMes(cs, '2026-07')).toBeNull();
  });
});
