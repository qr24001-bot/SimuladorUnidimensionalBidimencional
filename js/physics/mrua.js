
import { movConstante, f } from './base.js';

// MRUA: x = x₀ + v₀·t + ½·a·t².
// Detecta el instante de inversión de sentido si ocurre dentro de [0, t].
export function mrua({ x0, v0, a, t }) {
  const m = movConstante(x0, v0, a, t);
  const xf = m.posicion(t);
  const vf = m.velocidad(t);

  const ti = a !== 0 && -v0 / a > 0 && -v0 / a < t
    ? -v0 / a
    : null;

  return {
    ...m,
    dim: 1,
    eje: 'x',
    resultados: () => ({
      xFinal: xf,
      desplazamiento: xf - x0,
      vFinal: vf,
      tInversion: ti
    }),
    ecuacion: () => [
      ['x = x₀ + v₀·t + ½·a·t²', `x = (${x0}) + (${v0})(${t}) + ½(${a})(${t})²`, `x = ${f(xf)} m`],
      ['v = v₀ + a·t', `v = (${v0}) + (${a})(${t})`, `v = ${f(vf)} m/s`]
    ]
  };
}
