import { vertical } from './base.js';
// Caída libre: lanzamiento vertical con v₀ = 0 por defecto.
export const caidaLibre = ({ y0, v0 = 0, g }) => vertical({ y0, v0, g });
