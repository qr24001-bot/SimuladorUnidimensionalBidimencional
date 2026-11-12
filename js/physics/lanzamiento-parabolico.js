
// Motor 2D: lanzamiento parabólico con altura inicial.
// Datos: x0, y0, v0, ang (grados), g.
// Script clásico: disponible mediante SIMUCIN.crearLanzamientoParabolico.

(function (raiz) {
  const fmt = n => n.toFixed(3).replace(/^-(0\.0+)$/, '$1');

  function crearLanzamientoParabolico(datos) {
    const x0 = datos.x0 ?? 0;
    const y0 = datos.y0 ?? 0;
    const v0 = datos.v0;
    const ang = datos.ang;
    const g = datos.g ?? 9.81;

    const rad = ang * Math.PI / 180;
    const vx = v0 * Math.cos(rad);
    const v0y = v0 * Math.sin(rad);

    const T = (v0y + Math.sqrt(v0y * v0y + 2 * g * y0)) / g;
    const R = vx * T;
    const tSube = v0y > 0 ? v0y / g : 0;
    const yMax = y0 + (v0y > 0 ? v0y * v0y / (2 * g) : 0);
    const vyF = v0y - g * T;
    const vF = Math.hypot(vx, vyF);

    return {
      posicion: t => ({
        x: x0 + vx * t,
        y: y0 + v0y * t - 0.5 * g * t * t
      }),

      velocidad: t => ({
        x: vx,
        y: v0y - g * t
      }),

      aceleracion: () => ({
        x: 0,
        y: -g
      }),

      duracion: () => T,

      resultados: () => [
        { etiqueta: 'Tiempo de vuelo', valor: T, unidad: 's' },
        { etiqueta: 'Alcance horizontal', valor: R, unidad: 'm' },
        { etiqueta: 'Altura máxima', valor: yMax, unidad: 'm' },
        { etiqueta: 'Tiempo de altura máxima', valor: tSube, unidad: 's' },
        { etiqueta: 'Velocidad de impacto', valor: vF, unidad: 'm/s' }
      ],

      ecuaciones: () => [
        {
          ecuacion: 'vₓ = v₀ · cos(θ)',
          sustitucion: `vₓ = ${fmt(v0)} · cos(${fmt(ang)}°)`,
          resultado: `vₓ = ${fmt(vx)} m/s`
        },
        {
          ecuacion: 'v₀ᵧ = v₀ · sin(θ)',
          sustitucion: `v₀ᵧ = ${fmt(v0)} · sin(${fmt(ang)}°)`,
          resultado: `v₀ᵧ = ${fmt(v0y)} m/s`
        },
        {
          ecuacion: 't = (v₀ᵧ + √(v₀ᵧ² + 2 · g · y₀)) / g',
          sustitucion: `t = (${fmt(v0y)} + √(${fmt(v0y)}² + 2 · ${fmt(g)} · ${fmt(y0)})) / ${fmt(g)}`,
          resultado: `t = ${fmt(T)} s`
        },
        {
          ecuacion: 'R = vₓ · t',
          sustitucion: `R = ${fmt(vx)} · ${fmt(T)}`,
          resultado: `R = ${fmt(R)} m`
        },
        v0y > 0
          ? {
              ecuacion: 'y_max = y₀ + v₀ᵧ² / (2 · g)',
              sustitucion: `y_max = ${fmt(y0)} + ${fmt(v0y)}² / (2 · ${fmt(g)})`,
              resultado: `y_max = ${fmt(yMax)} m`
            }
          : {
              ecuacion: 'y_max = y₀ (no sube)',
              sustitucion: `y_max = ${fmt(y0)}`,
              resultado: `y_max = ${fmt(yMax)} m`
            }
      ]
    };
  }

  raiz.SIMUCIN = raiz.SIMUCIN || {};
  raiz.SIMUCIN.crearLanzamientoParabolico = crearLanzamientoParabolico;

  if (typeof module !== 'undefined') {
    module.exports = { crearLanzamientoParabolico };
  }
})(typeof window !== 'undefined' ? window : globalThis);
