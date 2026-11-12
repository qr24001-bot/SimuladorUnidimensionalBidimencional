
// Convenciones: x → derecha, y → arriba, suelo en y = 0, unidades SI, ángulos en grados.
export const G = 9.81;
export const rad = d => d * Math.PI / 180;
export const f = n => String(+n.toFixed(3)); // Formato solo para mostrar; los cálculos usan precisión completa.

// Movimiento con aceleración constante: p = p0 + v0·t + ½·a·t²
export const movConstante = (p0, v0, a, T) => ({
  posicion: t => p0 + v0 * t + 0.5 * a * t * t,
  velocidad: t => v0 + a * t,
  aceleracion: () => a,
  duracion: () => T,
});

// Raíz positiva de y0 + vy·t − ½·g·t² = 0.
export const tiempoImpacto = (y0, vy, g) => (vy + Math.sqrt(vy * vy + 2 * g * y0)) / g;

// Motor vertical (1D, eje Y). Retorna escalares.
export function vertical({ y0, v0, g }) {
  const T = tiempoImpacto(y0, v0, g), m = movConstante(y0, v0, -g, T);
  const tMax = v0 > 0 ? v0 / g : 0, hMax = y0 + (v0 > 0 ? v0 * v0 / (2 * g) : 0), vI = v0 - g * T;
  return { ...m, dim: 1, eje: 'y',
    resultados: () => ({ tImpacto: T, vImpacto: vI, tMax, hMax }),
    ecuacion: () => [
      ['t = [v₀ + √(v₀² + 2·g·y₀)] / g', `t = [(${v0}) + √((${v0})² + 2(${g})(${y0}))] / ${g}`, `t = ${f(T)} s`],
      ['v = v₀ − g·t', `v = (${v0}) − (${g})(${f(T)})`, `v = ${f(vI)} m/s`],
      ['h = y₀ + v₀²/(2g) (si v₀ > 0)', `h = (${y0}) + (${v0})²/(2·${g})`, `h = ${f(hMax)} m`]] };
}

// Motor de proyectil (2D). Posición y velocidad devuelven {x, y}.
export function proyectil({ x0, y0, vx, vy, g }) {
  const T = tiempoImpacto(y0, vy, g), R = vx * T, vyI = vy - g * T, rap = Math.hypot(vx, vyI);
  const tH = vy > 0 ? vy / g : 0, hMax = y0 + (vy > 0 ? vy * vy / (2 * g) : 0);
  return { dim: 2, duracion: () => T,
    posicion: t => ({ x: x0 + vx * t, y: y0 + vy * t - 0.5 * g * t * t }),
    velocidad: t => ({ x: vx, y: vy - g * t }),
    aceleracion: () => ({ x: 0, y: -g }),
    resultados: () => ({ tVuelo: T, alcance: R, hMax, tMax: tH, vxImpacto: vx, vyImpacto: vyI, rapidezImpacto: rap }),
    ecuacion: () => [
      ['t = [v₀ᵧ + √(v₀ᵧ² + 2·g·y₀)] / g', `t = [(${f(vy)}) + √((${f(vy)})² + 2(${g})(${y0}))] / ${g}`, `t = ${f(T)} s`],
      ['R = vₓ·t', `R = (${f(vx)})(${f(T)})`, `R = ${f(R)} m`],
      ['h = y₀ + v₀ᵧ²/(2g) (si v₀ᵧ > 0)', `h = (${y0}) + (${f(vy)})²/(2·${g})`, `h = ${f(hMax)} m`],
      ['|v| = √(vₓ² + vᵧ²), vᵧ = v₀ᵧ − g·t', `|v| = √((${f(vx)})² + (${f(vyI)})²)`, `|v| = ${f(rap)} m/s`]] };
}
