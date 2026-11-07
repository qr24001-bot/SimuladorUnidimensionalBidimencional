import { mrua as mruaBase } from './base.js';

export const mrua = ({ x0 = 0, v0 = 0, a }) => {
  const motor = mruaBase({ x0, v0, a });

  return {
    ...motor,
    ecuaciones: (t) => ({
      ecuacion: "x(t) = x₀ + v₀·t + ½·a·t² | v(t) = v₀ + a·t",
      sustitucion: `x(${t}) = ${x0} + (${v0})·(${t}) + ½·(${a})·(${t}²) = ${(x0 + v0 * t + 0.5 * a * t * t).toFixed(2)} m`
    })
  };
};
