import { describe, expect, it } from 'vitest';
import { correoValido } from '@/lib/correo';

describe('correoValido', () => {
  it('acepta correos reales, incluidos los que llevan la letra "s"', () => {
    for (const c of ['sofia@gmail.com', 'luis@hotmail.com', 'ana@yahoo.es', 'raulvalerion@gmail.com', '  jesus.s@outlook.com ']) {
      expect(correoValido(c)).toBe(true);
    }
  });

  it('rechaza correos incompletos o con espacios', () => {
    for (const c of ['', 'ana', 'ana@', 'ana@gmail', 'ana @gmail.com', '@gmail.com']) {
      expect(correoValido(c)).toBe(false);
    }
  });
});
