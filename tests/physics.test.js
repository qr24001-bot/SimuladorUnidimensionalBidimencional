import test from 'node:test';
import assert from 'node:assert/strict';
import { mru } from '../js/physics/mru.js';
import { mrua } from '../js/physics/mrua.js';
import { caidaLibre } from '../js/physics/caida-libre.js';
import { lanzamientoVertical } from '../js/physics/lanzamiento-vertical.js';

const c = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b}`);
const g = 9.81;
test('MRU', () => { c(mru({ x0: 0, v: 10, t: 5 }).posicion(5), 50); c(mru({ x0: 10, v: -3, t: 4 }).posicion(4), -2); });
test('MRUA', () => {
  let m = mrua({ x0: 0, v0: 5, a: 2, t: 10 }); c(m.posicion(10), 150); c(m.velocidad(10), 25);
  m = mrua({ x0: 0, v0: 4, a: 0, t: 5 }); c(m.posicion(5), 20); c(m.velocidad(5), 4);
  m = mrua({ x0: 0, v0: 20, a: -4, t: 5 }); c(m.posicion(5), 50); c(m.velocidad(5), 0);
  c(mrua({ x0: 0, v0: 20, a: -4, t: 8 }).resultados().tInversion, 5);
});
test('Caída libre', () => {
  c(caidaLibre({ y0: 19.62, g }).resultados().tImpacto, 2);
  const r = caidaLibre({ y0: 100, g }).resultados(); c(r.tImpacto, 4.52); c(r.vImpacto, -44.29);
});
test('Lanzamiento vertical', () => {
  let r = lanzamientoVertical({ y0: 0, v0: 19.62, g }).resultados(); c(r.tMax, 2); c(r.hMax, 19.62); c(r.tImpacto, 4);
  r = lanzamientoVertical({ y0: 0, v0: 20, g }).resultados(); c(r.tMax, 2.04); c(r.hMax, 20.39);
  r = lanzamientoVertical({ y0: 10, v0: -5, g }).resultados(); c(r.tMax, 0); c(r.hMax, 10); // v₀ negativa
});
