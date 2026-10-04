// RUTA DE PRESENCIA (2026-10-04) — niveles, recomendaciones y resumen del mes por eje,
// derivados SOLO de los Checks reales de la persona (24: inversión activa; sin IA extra).
// Funciones puras: se usan desde pantallas 'use client' y se prueban en tests/progreso.test.ts.
// La misión semanal y sus gemas NO viven aquí: las calcula y otorga el servidor (mision_semana).

import { TEMAS, type ClaveEje, type ResultadoCheck, type TemaDe } from '@/lib/ia/resultado';

export type CheckProgreso = {
  id: string;
  ocasion: string;
  created_at: string;
  puntaje: number | null;
  resultado: ResultadoCheck;
};

export const EJES: ClaveEje[] = ['outfit', 'postura', 'actitud'];

export const TITULO_EJE: Record<ClaveEje, string> = { outfit: 'Outfit', postura: 'Postura', actitud: 'Actitud' };

export const NIVEL_MAX = 10;

type Recomendaciones = { [E in ClaveEje]: Record<Exclude<TemaDe<E>, 'ninguno'>, string> };

/** La recomendación estable de cada tipo de ajuste: misma frase siempre, para que se reconozca. */
export const RECOMENDACION: Recomendaciones = {
  outfit: {
    talla: 'Elige prendas a tu medida: ni holgadas ni apretadas.',
    colores: 'Combina máximo 3 colores y repite uno en un detalle.',
    formalidad: 'Ajusta el nivel de formalidad a la ocasión antes de salir.',
    calzado: 'Cuida el calzado: limpio y del mismo estilo que el look.',
    capas: 'Suma una pieza que estructure: blazer, chaqueta o sobrecamisa.',
    accesorios: 'Cierra el look con un accesorio: cinturón, reloj o bolso.',
    cuidado: 'Revisa arrugas y manchas: planchado se ve más seguro.',
  },
  postura: {
    hombros: 'Hombros atrás y abajo, sin forzarlos.',
    cabeza: 'Barbilla nivelada y cuello largo al llegar.',
    apoyo: 'Peso en ambos pies, sin cargar la cadera.',
    brazos: 'Brazos relajados, fuera de los bolsillos.',
    espalda: 'Espalda recta: imagina un hilo que te jala hacia arriba.',
  },
  actitud: {
    sonrisa: 'Sonríe con los ojos al saludar.',
    mirada: 'Sostén la mirada 2 segundos al saludar.',
    tension: 'Suelta la mandíbula y los hombros antes de entrar.',
    energia: 'Entra con energía: paso firme y ritmo tranquilo.',
    apertura: 'Pose abierta: brazos sin cruzar, ocupa tu espacio.',
  },
};

/** Frase de cada nivel (copy de 'Tu Ruta de Presencia'). */
const FRASE_NIVEL: Record<ClaveEje, [number, string][]> = {
  outfit: [[8, 'Tu estilo ya es tu sello'], [5, 'Ya combinas con intención'], [3, 'Vas encontrando tu estilo'], [1, 'Tu punto de partida']],
  postura: [[8, 'Tu postura ya habla por ti'], [5, 'Firme y cada vez más natural'], [3, 'Mejorando, sigue así'], [1, 'Tu punto de partida']],
  actitud: [[8, 'Tu actitud ya es tu firma'], [5, 'Se nota tu seguridad'], [3, 'Vas soltándote'], [1, 'Tu punto de partida']],
};

const VENTANA = 5; // Checks recientes que definen tu nivel actual
const MINIMO_PARA_NIVEL = 3; // con menos, todavía es nivel 1

const redondear1 = (n: number) => Math.round(n * 10) / 10;
const promedio = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** Nivel 1-10 según el promedio: <5 → 1, y cada medio punto desde 5 sube un nivel. */
export function nivelDePromedio(prom: number): number {
  if (prom < 5) return 1;
  return Math.min(NIVEL_MAX, 2 + Math.floor((prom - 5) / 0.5 + 1e-9));
}

/** Promedio mínimo que pide un nivel (inverso de nivelDePromedio). */
export function promedioParaNivel(nivel: number): number {
  return nivel <= 1 ? 0 : 5 + (nivel - 2) * 0.5;
}

export function fraseNivel(eje: ClaveEje, nivel: number): string {
  return FRASE_NIVEL[eje].find(([desde]) => nivel >= desde)![1];
}

/** Más antiguo primero. */
function ordenar(checks: CheckProgreso[]): CheckProgreso[] {
  return [...checks].sort((a, b) => a.created_at.localeCompare(b.created_at));
}

/** El nivel NUNCA baja: es el mejor promedio de 5 Checks seguidos que haya logrado. */
function nivelHistorico(notas: number[]): number {
  let nivel = 1;
  for (let i = MINIMO_PARA_NIVEL; i <= notas.length; i++) {
    nivel = Math.max(nivel, nivelDePromedio(promedio(notas.slice(Math.max(0, i - VENTANA), i))));
  }
  return nivel;
}

export type Recomendacion = { tema: string; texto: string; veces: number; de: number };

export type ProgresoEje = {
  eje: ClaveEje;
  nivel: number;
  frase: string;
  /** Promedio de los últimos 5 Checks (null sin Checks). */
  actual: number | null;
  /** Diferencia entre los últimos 3 y los 3 anteriores (null si no hay 4+ Checks). */
  tendencia: number | null;
  /** Avance hacia el siguiente nivel, 0-1. */
  avance: number;
  /** Promedio que pide el siguiente nivel (null en el nivel máximo). */
  metaSiguiente: number | null;
  /** Últimas 6 notas, más antigua primero. */
  serie: number[];
  /** Diferencia entre la última nota y la primera de su historia. */
  desdeInicio: number | null;
  recomendaciones: Recomendacion[];
  siguientePaso: string;
};

export function progresoEje(checks: CheckProgreso[], eje: ClaveEje): ProgresoEje {
  const orden = ordenar(checks);
  const notas = orden.map((c) => c.resultado[eje].nota);
  const nivel = notas.length >= MINIMO_PARA_NIVEL ? nivelHistorico(notas) : 1;
  const ultimos = notas.slice(-VENTANA);
  const actual = notas.length ? redondear1(promedio(ultimos)) : null;

  let tendencia: number | null = null;
  if (notas.length >= 4) {
    const recientes = notas.slice(-3);
    const previos = notas.slice(-6, -3);
    tendencia = redondear1(promedio(recientes) - promedio(previos));
  }

  const metaSiguiente = nivel >= NIVEL_MAX ? null : promedioParaNivel(nivel + 1);
  let avance = 1;
  if (metaSiguiente !== null) {
    const base = promedioParaNivel(nivel) || metaSiguiente - 1;
    avance = actual === null ? 0 : Math.max(0, Math.min(1, (actual - base) / (metaSiguiente - base)));
  }

  // Lo que Niki le marcó más seguido en sus últimos 10 Checks de este eje.
  const conTema = orden.slice(-10).map((c) => c.resultado[eje].tema);
  const evaluados = conTema.filter((t) => t !== undefined).length;
  const conteo = new Map<string, number>();
  for (const t of conTema) if (t && t !== 'ninguno') conteo.set(t, (conteo.get(t) ?? 0) + 1);
  const textos = RECOMENDACION[eje] as Record<string, string>;
  const recomendaciones = [...conteo.entries()]
    .sort((a, b) => b[1] - a[1] || (TEMAS[eje] as readonly string[]).indexOf(a[0]) - (TEMAS[eje] as readonly string[]).indexOf(b[0]))
    .map(([tema, veces]) => ({ tema, texto: textos[tema], veces, de: evaluados }));

  let siguientePaso: string;
  if (recomendaciones.length) siguientePaso = recomendaciones[0].texto;
  else if (evaluados > 0) siguientePaso = 'Vas muy bien aquí: sostén lo que ya haces.';
  else if (orden.length) siguientePaso = orden[orden.length - 1].resultado[eje].comentario;
  else siguientePaso = 'Haz tu primer Check y Niki te dice qué ajustar.';

  return {
    eje,
    nivel,
    frase: fraseNivel(eje, nivel),
    actual,
    tendencia,
    avance,
    metaSiguiente,
    serie: notas.slice(-6),
    desdeInicio: notas.length >= 2 ? notas[notas.length - 1] - notas[0] : null,
    recomendaciones,
    siguientePaso,
  };
}

/** El eje que más conviene trabajar: el de menor promedio reciente. */
export function ejeFoco(ejes: ProgresoEje[]): ClaveEje | null {
  const conDatos = ejes.filter((e) => e.actual !== null);
  if (!conDatos.length) return null;
  return conDatos.reduce((min, e) => (e.actual! < min.actual! ? e : min)).eje;
}

// ── Resumen del mes ─────────────────────────────────────────────────────────

/** 'YYYY-MM' de una fecha ISO, en la hora local del celular. */
export function mesDe(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function mesAnterior(mes: string): string {
  const [a, m] = mes.split('-').map(Number);
  return m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, '0')}`;
}

export function nombreMes(mes: string): string {
  const [a, m] = mes.split('-').map(Number);
  const n = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(new Date(a, m - 1, 15));
  return n.charAt(0).toUpperCase() + n.slice(1);
}

export const OCASIONES_RETO = ['entrevista', 'cita', 'negocios', 'amigos', 'cena', 'vacaciones'] as const;

export type ResumenMes = {
  mes: string;
  total: number;
  porEje: { eje: ClaveEje; antes: number | null; ahora: number }[];
  subio: number;
  nivelesNuevos: { eje: ClaveEje; nivel: number }[];
  mejor: { puntaje: number; ocasion: string; created_at: string } | null;
  foco: ClaveEje | null;
  /** Una ocasión que todavía no ha probado (reto del mes nuevo), si queda alguna. */
  ocasionNueva: string | null;
};

export function resumenMes(checks: CheckProgreso[], mes: string): ResumenMes | null {
  const delMes = checks.filter((c) => mesDe(c.created_at) === mes);
  if (!delMes.length) return null;
  const previo = checks.filter((c) => mesDe(c.created_at) === mesAnterior(mes));
  const hastaFin = checks.filter((c) => mesDe(c.created_at) <= mes);
  const hastaAntes = checks.filter((c) => mesDe(c.created_at) < mes);

  const porEje = EJES.map((eje) => ({
    eje,
    antes: previo.length ? redondear1(promedio(previo.map((c) => c.resultado[eje].nota))) : null,
    ahora: redondear1(promedio(delMes.map((c) => c.resultado[eje].nota))),
  }));

  const nivelesNuevos = EJES.map((eje) => ({ eje, nivel: progresoEje(hastaFin, eje).nivel, antes: progresoEje(hastaAntes, eje).nivel }))
    .filter((n) => n.nivel > n.antes)
    .map(({ eje, nivel }) => ({ eje, nivel }));

  const conPuntaje = delMes.filter((c) => c.puntaje !== null);
  const mejorCheck = conPuntaje.length ? conPuntaje.reduce((m, c) => (c.puntaje! > m.puntaje! ? c : m)) : null;

  const probadas = new Set(hastaFin.map((c) => c.ocasion));
  return {
    mes,
    total: delMes.length,
    porEje,
    subio: porEje.filter((p) => p.antes !== null && p.ahora > p.antes).length,
    nivelesNuevos,
    mejor: mejorCheck ? { puntaje: Number(mejorCheck.puntaje), ocasion: mejorCheck.ocasion, created_at: mejorCheck.created_at } : null,
    foco: ejeFoco(EJES.map((e) => progresoEje(hastaFin, e))),
    ocasionNueva: OCASIONES_RETO.find((o) => !probadas.has(o)) ?? null,
  };
}
