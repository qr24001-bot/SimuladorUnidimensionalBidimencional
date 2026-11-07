import { vertical } from './base.js';

export const lanzamientoVertical = ({ y0 = 0, v0, g }) => {
  const motor = vertical({ y0, v0, g });

  return {
    ...motor,
    ecuaciones: (t) => ({
      ecuacion: "y(t) = y₀ + v₀·t - ½·g·t²",
      sustitucion: `y(${t}) = ${y0} + (${v0})·(${t}) - ½·(${g})·(${t}²) = ${(y0 + v0 * t - 0.5 * g * t * t).toFixed(2)} m`
    })
  };
};