
// Motor 2D: lanzamiento horizontal.
// Datos: x0, y0, vx, g.
// Script clásico: disponible mediante SIMUCIN.crearLanzamientoHorizontal.

(function (raiz) {
  const fmt = n => n.toFixed(3).replace(/^-(0\.0+)$/, '$1');

  function crearLanzamientoHorizontal(datos) {
    const x0 = datos.x0 ?? 0;
    const y0 = datos.y0;
    const vx = datos.vx;
    const g = datos.g ?? 9.81;

    const T = Math.sqrt(2 * y0 / g);
    const R = vx * T;
    const vyF = -g * T;
    const vF = Math.hypot(vx, vyF);

    return {
      posicion: t => ({
        x: x0 + vx * t,
        y: y0 - 0.5 * g * t * t
      }),

      velocidad: t => ({
        x: vx,
        y: -g * t
      }),

      aceleracion: () => ({
        x: 0,
        y: -g
      }),

      duracion: () => T,

      resultados: () => [
        { etiqueta: 'Tiempo de vuelo', valor: T, unidad: 's' },
        { etiqueta: 'Alcance horizontal', valor: R, unidad: 'm' },
        { etiqueta: 'Altura máxima', valor: y0, unidad: 'm' },
        { etiqueta: 'Velocidad de impacto', valor: vF, unidad: 'm/s' }
      ],

      ecuaciones: () => [
        {
          ecuacion: 't = √(2 · y₀ / g)',
          sustitucion: `t = √(2 · ${fmt(y0)} / ${fmt(g)})`,
          resultado: `t = ${fmt(T)} s`
        },
        {
          ecuacion: 'R = vₓ · t',
          sustitucion: `R = ${fmt(vx)} · ${fmt(T)}`,
          resultado: `R = ${fmt(R)} m`
        },
        {
          ecuacion: 'vᵧ = −g · t',
          sustitucion: `vᵧ = −${fmt(g)} · ${fmt(T)}`,
          resultado: `vᵧ = ${fmt(vyF)} m/s`
        },
        {
          ecuacion: '|v| = √(vₓ² + vᵧ²)',
          sustitucion: `|v| = √(${fmt(vx)}² + ${fmt(vyF)}²)`,
          resultado: `|v| = ${fmt(vF)} m/s`
        }
      ]
    };
  }

  raiz.SIMUCIN = raiz.SIMUCIN || {};
  raiz.SIMUCIN.crearLanzamientoHorizontal = crearLanzamientoHorizontal;

  if (typeof module !== 'undefined') {
    module.exports = { crearLanzamientoHorizontal };
  }
})(typeof window !== 'undefined' ? window : globalThis);
