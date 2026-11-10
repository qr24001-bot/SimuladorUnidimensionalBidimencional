// Motor 2D: lanzamiento horizontal. Datos: x0, y0, vx, g. Contrato en ConvencionesBasicas.txt.
// Script clásico (sin módulos): queda en SIMUCIN.crearLanzamientoHorizontal y en module.exports (pruebas en Node).
(function (raiz) {
  const fmt = n => n.toFixed(3).replace(/^-(0\.0+)$/, '$1'); // 3 decimales, sin "-0.000"

  function crearLanzamientoHorizontal(datos) {
    const x0 = datos.x0 ?? 0, y0 = datos.y0, vx = datos.vx;
    const g = datos.g ?? 9.81; // ponytail: duplica el valor por defecto; leerlo de utils/constantes.js cuando exista
    const T = Math.sqrt(2 * y0 / g);      // raíz positiva de y(t) = 0, con la altura inicial
    const R = vx * T;                     // alcance horizontal
    const vyF = -g * T;                   // vy al tocar el suelo (signo negativo: baja)
    const vF = Math.hypot(vx, vyF);

    return {
      posicion: t => ({ x: x0 + vx * t, y: y0 - 0.5 * g * t * t }),
      velocidad: t => ({ x: vx, y: -g * t }),
      aceleracion: () => ({ x: 0, y: -g }),
      duracion: () => T,
      resultados: () => [
        { etiqueta: 'Tiempo de vuelo', valor: T, unidad: 's' },
        { etiqueta: 'Alcance horizontal', valor: R, unidad: 'm' },
        { etiqueta: 'Altura máxima', valor: y0, unidad: 'm' },
        { etiqueta: 'Velocidad de impacto', valor: vF, unidad: 'm/s' },
      ],
      ecuaciones: () => [
        { ecuacion: 't = √(2·y0 / g)', sustitucion: `t = √(2·${fmt(y0)} / ${fmt(g)})`, resultado: `t = ${fmt(T)} s` },
        { ecuacion: 'R = vx·t', sustitucion: `R = ${fmt(vx)}·${fmt(T)}`, resultado: `R = ${fmt(R)} m` },
        { ecuacion: 'vy = −g·t', sustitucion: `vy = −${fmt(g)}·${fmt(T)}`, resultado: `vy = ${fmt(vyF)} m/s` },
        { ecuacion: '|v| = √(vx² + vy²)', sustitucion: `|v| = √(${fmt(vx)}² + ${fmt(vyF)}²)`, resultado: `|v| = ${fmt(vF)} m/s` },
      ],
    };
  }

  raiz.SIMUCIN = raiz.SIMUCIN || {};
  raiz.SIMUCIN.crearLanzamientoHorizontal = crearLanzamientoHorizontal;
  if (typeof module !== 'undefined') module.exports = { crearLanzamientoHorizontal };
})(typeof window !== 'undefined' ? window : globalThis);
