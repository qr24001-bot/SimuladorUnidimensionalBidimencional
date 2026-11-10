// Motor 2D: lanzamiento parabólico con altura inicial. Datos: x0, y0, v0, ang (grados), g.
// Script clásico (sin módulos): queda en SIMUCIN.crearLanzamientoParabolico y en module.exports (pruebas en Node).
(function (raiz) {
  const fmt = n => n.toFixed(3).replace(/^-(0\.0+)$/, '$1'); // 3 decimales, sin "-0.000"

  function crearLanzamientoParabolico(datos) {
    const x0 = datos.x0 ?? 0, y0 = datos.y0 ?? 0, v0 = datos.v0, ang = datos.ang;
    const g = datos.g ?? 9.81; // ponytail: duplica el valor por defecto; leerlo de utils/constantes.js cuando exista
    const rad = ang * Math.PI / 180;      // la interfaz da grados, el motor trabaja en radianes
    const vx = v0 * Math.cos(rad), v0y = v0 * Math.sin(rad);
    const T = (v0y + Math.sqrt(v0y * v0y + 2 * g * y0)) / g; // raíz positiva de y(t) = 0
    const R = vx * T;                                        // alcance horizontal
    const tSube = v0y > 0 ? v0y / g : 0;                     // instante de la altura máxima
    const yMax = y0 + (v0y > 0 ? v0y * v0y / (2 * g) : 0);
    const vyF = v0y - g * T;
    const vF = Math.hypot(vx, vyF);

    return {
      posicion: t => ({ x: x0 + vx * t, y: y0 + v0y * t - 0.5 * g * t * t }),
      velocidad: t => ({ x: vx, y: v0y - g * t }),
      aceleracion: () => ({ x: 0, y: -g }),
      duracion: () => T,
      resultados: () => [
        { etiqueta: 'Tiempo de vuelo', valor: T, unidad: 's' },
        { etiqueta: 'Alcance horizontal', valor: R, unidad: 'm' },
        { etiqueta: 'Altura máxima', valor: yMax, unidad: 'm' },
        { etiqueta: 'Tiempo de altura máxima', valor: tSube, unidad: 's' },
        { etiqueta: 'Velocidad de impacto', valor: vF, unidad: 'm/s' },
      ],
      ecuaciones: () => [
        { ecuacion: 'vx = v0·cos(θ)', sustitucion: `vx = ${fmt(v0)}·cos(${fmt(ang)}°)`, resultado: `vx = ${fmt(vx)} m/s` },
        { ecuacion: 'v0y = v0·sin(θ)', sustitucion: `v0y = ${fmt(v0)}·sin(${fmt(ang)}°)`, resultado: `v0y = ${fmt(v0y)} m/s` },
        { ecuacion: 't = (v0y + √(v0y² + 2·g·y0)) / g',
          sustitucion: `t = (${fmt(v0y)} + √(${fmt(v0y)}² + 2·${fmt(g)}·${fmt(y0)})) / ${fmt(g)}`,
          resultado: `t = ${fmt(T)} s` },
        { ecuacion: 'R = vx·t', sustitucion: `R = ${fmt(vx)}·${fmt(T)}`, resultado: `R = ${fmt(R)} m` },
        v0y > 0
          ? { ecuacion: 'ymáx = y0 + v0y² / (2·g)', sustitucion: `ymáx = ${fmt(y0)} + ${fmt(v0y)}² / (2·${fmt(g)})`, resultado: `ymáx = ${fmt(yMax)} m` }
          : { ecuacion: 'ymáx = y0 (no sube)', sustitucion: `ymáx = ${fmt(y0)}`, resultado: `ymáx = ${fmt(yMax)} m` },
      ],
    };
  }

  raiz.SIMUCIN = raiz.SIMUCIN || {};
  raiz.SIMUCIN.crearLanzamientoParabolico = crearLanzamientoParabolico;
  if (typeof module !== 'undefined') module.exports = { crearLanzamientoParabolico };
})(typeof window !== 'undefined' ? window : globalThis);
