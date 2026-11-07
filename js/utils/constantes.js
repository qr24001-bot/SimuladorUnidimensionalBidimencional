// Constantes compartidas del Simulador Unidimensional Bidimensional.

export const G_PREDETERMINADA = 9.81; // m/s²
export const DECIMALES = 3;
export const LIMITE_ABSOLUTO = 1e6; // valor máximo aceptado (en valor absoluto)

// Claves del objeto de datos que necesita cada movimiento (contrato del equipo).
export const CAMPOS_POR_MOVIMIENTO = {
  'mru': ['x0', 'v', 't'],
  'mrua': ['x0', 'v0', 'a', 't'],
  'caida-libre': ['y0', 'v0', 'g'],
  'lanzamiento-vertical': ['y0', 'v0', 'g'],
  'lanzamiento-horizontal': ['x0', 'y0', 'vx', 'g'],
  'lanzamiento-parabolico': ['x0', 'y0', 'v0', 'ang', 'g']
};

export const UNIDADES = {
  x0: 'm', y0: 'm', v: 'm/s', v0: 'm/s', vx: 'm/s',
  a: 'm/s²', t: 's', g: 'm/s²', ang: '°'
};

export const NOMBRES_MOVIMIENTO = {
  'mru': 'Movimiento rectilíneo uniforme (MRU)',
  'mrua': 'Movimiento rectilíneo uniformemente acelerado (MRUA)',
  'caida-libre': 'Caída libre',
  'lanzamiento-vertical': 'Lanzamiento vertical',
  'lanzamiento-horizontal': 'Lanzamiento horizontal',
  'lanzamiento-parabolico': 'Lanzamiento parabólico'
};