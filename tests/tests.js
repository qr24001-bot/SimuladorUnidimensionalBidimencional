// Pruebas del equipo. Ejecutar con: node tests/tests.js
// Cada integrante agrega su sección dentro de su propio bloque para no chocar con nombres ajenos.

// ===== SECCIÓN 2D (Integrante 2): lanzamiento horizontal, parabólico y gráficas 2D (datos) =====
(function () {
  const assert = require('assert');
  const { crearLanzamientoHorizontal } = require('../js/physics/lanzamiento-horizontal.js');
  const { crearLanzamientoParabolico } = require('../js/physics/lanzamiento-parabolico.js');
  const { muestrear } = require('../js/charts/graphs.js');

  const cerca = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol, `${a} no es cercano a ${b}`);
  const res = (motor, etiqueta) => motor.resultados().find(r => r.etiqueta === etiqueta).valor;

  // Horizontal: y0 = 19,62 m con g = 9,81 -> t = 2 s exactos
  const h = crearLanzamientoHorizontal({ x0: 1, y0: 19.62, vx: 5, g: 9.81 });
  cerca(h.duracion(), 2);
  cerca(h.posicion(0).x, 1); cerca(h.posicion(0).y, 19.62);
  cerca(h.posicion(2).x, 11); cerca(h.posicion(2).y, 0);      // y(T) = 0
  cerca(h.velocidad(0).x, 5); cerca(h.velocidad(0).y, 0);
  cerca(h.velocidad(2).y, -19.62);                            // el signo de vy se conserva
  cerca(h.aceleracion().y, -9.81); cerca(h.aceleracion().x, 0);
  cerca(res(h, 'Alcance horizontal'), 10);
  cerca(res(h, 'Altura máxima'), 19.62);
  assert.strictEqual(crearLanzamientoHorizontal({ y0: 0, vx: 5 }).duracion(), 0); // sin altura no hay vuelo

  // Parabólico a 45° desde el suelo: R = v0²/g, ymáx = (v0·sin θ)² / 2g
  const p45 = crearLanzamientoParabolico({ x0: 0, y0: 0, v0: 20, ang: 45, g: 9.81 });
  cerca(res(p45, 'Alcance horizontal'), 400 / 9.81);
  cerca(res(p45, 'Altura máxima'), 200 / 19.62);
  cerca(p45.posicion(p45.duracion()).y, 0, 1e-9);

  // Parabólico con altura inicial (y0 = 10 m, 20 m/s, 30°): valores a mano
  const p = crearLanzamientoParabolico({ x0: 0, y0: 10, v0: 20, ang: 30, g: 9.81 });
  cerca(p.duracion(), 2.774, 1e-3);
  cerca(res(p, 'Alcance horizontal'), 48.043, 1e-3);
  cerca(res(p, 'Altura máxima'), 15.097, 1e-3);
  cerca(res(p, 'Tiempo de altura máxima'), 10 / 9.81);
  cerca(p.posicion(p.duracion()).y, 0);                       // y(T) = 0
  cerca(p.velocidad(p.duracion()).y, -Math.sqrt(10 ** 2 + 2 * 9.81 * 10)); // conservación de energía
  assert.ok(p.velocidad(p.duracion()).y < 0 && p.aceleracion().y === -9.81);
  const s = muestrear(p, 20000);                              // la altura máxima es el máximo de y(t)
  cerca(Math.max(...s.y), res(p, 'Altura máxima'), 1e-6);
  assert.strictEqual(s.t.length, 20001);
  cerca(s.x[20000], p.posicion(p.duracion()).x);

  // Disparo hacia abajo: no sube, la altura máxima es y0
  const abajo = crearLanzamientoParabolico({ y0: 5, v0: 10, ang: -30 });
  cerca(res(abajo, 'Altura máxima'), 5);

  // Texto de ecuaciones: ecuación, sustitución y resultado no vacíos, resultado con 3 decimales
  for (const m of [h, p, abajo]) {
    for (const e of m.ecuaciones()) assert.ok(e.ecuacion && e.sustitucion && e.resultado);
  }
  assert.ok(p.ecuaciones()[2].resultado.includes('2.774 s'));

  console.log('OK sección 2D');
})();
