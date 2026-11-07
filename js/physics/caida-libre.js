import { vertical } from './base.js';

// Caída libre: lanzamiento vertical con v₀ = 0 por defecto.
export const caidaLibre = ({ y0, v0 = 0, g }) => {
  const motor = vertical({ y0, v0, g });

  return {
    ...motor,
    ecuaciones: (t) => ({
      ecuacion: "y(t) = y₀ - ½ · g · t²",
      sustitucion: `y(${t}) = ${y0} - ½ · (${g}) · (${t}²) = ${(y0 - 0.5 * g * t * t).toFixed(2)} m`
    })
  };
};