# SIMUCIN — Simulador de cinemática 1D y 2D

## Motores y gráficas 2D (Integrante 2)

**Motores:** `js/physics/lanzamiento-horizontal.js` y `js/physics/lanzamiento-parabolico.js`.
Cada uno es una función que recibe el objeto de datos del formulario y devuelve el contrato común:

| Motor | Datos | Función |
|-------|-------|---------|
| Lanzamiento horizontal | `x0, y0, vx, g` | `SIMUCIN.crearLanzamientoHorizontal(datos)` |
| Lanzamiento parabólico | `x0, y0, v0, ang, g` | `SIMUCIN.crearLanzamientoParabolico(datos)` |

El objeto devuelto tiene `posicion(t)`, `velocidad(t)`, `aceleracion(t)` (los tres devuelven `{x, y}`),
`duracion()`, `resultados()` y `ecuaciones()`. La simulación termina al tocar el suelo (y = 0):
el tiempo de vuelo es la raíz positiva de y(t) = 0, siempre con la altura inicial.
`resultados()` incluye tiempo de vuelo, alcance horizontal, altura máxima y velocidad de impacto
(el parabólico añade el tiempo de la altura máxima).

**Gráficas:** `js/charts/graphs.js` → `SIMUCIN.graficar2D(motor, 'contenedor-graficas')` crea en el
contenedor las gráficas y(x), x(t), y(t), vx(t) y vy(t) con Chart.js (hay que cargarlo antes con su `<script>`).

**Pruebas:** `node tests/tests.js`.
