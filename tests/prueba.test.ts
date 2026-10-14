import { describe, expect, it } from 'vitest';
import { DIAS_PRUEBA, diaDePrueba, muestraBienvenidaPro, tocaReenganche } from '@/lib/prueba';
import { correoReenganchePrueba } from '@/lib/email/reenganche-prueba';

// Puente de la prueba gratis (02C): si estas pruebas fallan, la persona vería un "Día" que no es,
// recibiría el recordatorio a destiempo o la bienvenida VIP Pro no aparecería tras pagar.

const H = 60 * 60 * 1000;
const FIN = new Date('2026-10-17T18:00:00Z');
const INICIO = new Date(FIN.getTime() - DIAS_PRUEBA * 24 * H);
const tras = (horas: number) => new Date(INICIO.getTime() + horas * H);

describe('día de la prueba', () => {
  it('cuenta 1, 2 y 3 desde que empezó', () => {
    expect(diaDePrueba(FIN, tras(1))).toBe(1);
    expect(diaDePrueba(FIN, tras(30))).toBe(2);
    expect(diaDePrueba(FIN, tras(60))).toBe(3);
  });

  it('nunca sale de 1 a 3 aunque el aviso de Hotmart llegue tarde', () => {
    expect(diaDePrueba(FIN, tras(-5))).toBe(1);
    expect(diaDePrueba(FIN, tras(90))).toBe(3);
  });
});

describe('recordatorio del primer Check', () => {
  it('no sale en las primeras 18 horas ni en las últimas 12', () => {
    expect(tocaReenganche(FIN, tras(10))).toBe(false);
    expect(tocaReenganche(FIN, tras(20))).toBe(true);
    expect(tocaReenganche(FIN, tras(61))).toBe(false);
  });

  it('el correo lleva la fecha real de fin y el enlace a la app', () => {
    const c = correoReenganchePrueba({ nombre: 'Mateo', finPrueba: FIN });
    expect(c.texto).toContain('17 de octubre');
    expect(c.html).toContain('https://holaniki.com/app');
    expect(c.asunto).toContain('por pena');
  });
});

describe('bienvenida VIP Pro', () => {
  it('se muestra la primera semana tras el primer cobro, no antes ni después', () => {
    const cobro = new Date('2026-10-17T18:00:00Z');
    expect(muestraBienvenidaPro(cobro, new Date(cobro.getTime() + 2 * H))).toBe(true);
    expect(muestraBienvenidaPro(cobro, new Date(cobro.getTime() + 8 * 24 * H))).toBe(false);
    expect(muestraBienvenidaPro(null, cobro)).toBe(false);
  });
});
