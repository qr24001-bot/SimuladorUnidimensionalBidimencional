## Módulo 1D: Movimientos Unidimensionales (Integrante 1)

Este módulo gestiona la simulación de partículas en una sola dimensión física, calculando la posición, velocidad y aceleración en función del tiempo t.

### 1. Motores Físicos Implementados

* **MRU (Movimiento Rectilíneo Uniforme):** 
  Movimiento a velocidad constante (v) en un solo eje.
  - Fórmula: x(t) = x0 + v * t

* **MRUA (Movimiento Rectilíneo Uniformemente Acelerado):** 
  Movimiento en un eje con aceleración constante (a).
  - Fórmula Posición: x(t) = x0 + v0 * t + 0.5 * a * t^2
  - Fórmula Velocidad: v(t) = v0 + a * t

* **Caída Libre:** 
  Movimiento vertical en el eje Y afectado por la gravedad (g = 9.81 m/s²), partiendo desde una altura y0.
  - Fórmula: y(t) = y0 - 0.5 * g * t^2

* **Lanzamiento Vertical:** 
  Movimiento vertical hacia arriba con velocidad inicial (v0) acelerado negativamente por la gravedad.
  - Fórmula: y(t) = y0 + v0 * t - 0.5 * g * t^2

---

### 2. Gráficas Unidimensionales (`js/charts/graphs.js`)

El módulo genera tres gráficas dinámicas con Chart.js en el contenedor `#contenedor-graficas`:

1. **Posición vs Tiempo:** x(t) o y(t)
2. **Velocidad vs Tiempo:** v(t)
3. **Aceleración vs Tiempo:** a(t)

---

### 3. Pruebas Unitarias (`tests/physics.test.js`)

Se incluyen pruebas para verificar los métodos de posición, velocidad y aceleración de los 4 motores 1D con precisión de 3 decimales.