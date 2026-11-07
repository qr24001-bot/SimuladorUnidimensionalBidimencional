// Constantes compartidas del Simulador Unidimensional Bidimensional.

export const G_PREDETERMINADA = 9.81; // m/s²
export const DECIMALES = 3;

// Claves del objeto de datos que necesita cada movimiento (contrato del equipo).
export const CAMPOS_POR_MOVIMIENTO = {
  'mru': ['x0', 'v', 't'],
  'mrua': ['x0', 'v0', 'a', 't'],
  'caida-libre': ['y0', 'v0', 'g'],
  'lanzamiento-vertical': ['y0', 'v0', 'g'],
  'lanzamiento-horizontal': ['x0', 'y0', 'vx', 'g'],
  'lanzamiento-parabolico': ['x0', 'y0', 'v0', 'ang', 'g']
};