import { mru as mruBase } from './base.js';

export const mru = ({ x0 = 0, v }) => {
  const motor = mruBase({ x0, v });

  return {
    ...motor,
    ecuaciones: (t) => ({
      ecuacion: "x(t) = x₀ + v · t",
      sustitucion: `x(${t}) = ${x0} + (${v}) · (${t}) = ${(x0 + v * t).toFixed(2)} m`
    })
  };
};
