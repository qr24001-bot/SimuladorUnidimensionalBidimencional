import { movConstante, f } from './base.js';
// MRU: x = x₀ + v·t. Retorna escalares.
export function mru({ x0, v, t }) {
  const m = movConstante(x0, v, 0, t), xf = m.posicion(t);
  return { ...m, dim: 1, eje: 'x',
    resultados: () => ({ xFinal: xf, desplazamiento: xf - x0, velocidad: v, tiempo: t }),
    ecuacion: () => [['x = x₀ + v·t', `x = (${x0}) + (${v})(${t})`, `x = ${f(xf)} m`],
                     ['Δx = x − x₀', `Δx = (${f(xf)}) − (${x0})`, `Δx = ${f(xf - x0)} m`]] };
}