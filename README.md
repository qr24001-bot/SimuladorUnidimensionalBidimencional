# SIMUCIN --- Simulador Unidimensional Bidimensional

Aplicación web educativa para estudiar y visualizar movimientos de
cinemática en una y dos dimensiones. Permite configurar las condiciones
iniciales de distintos movimientos, calcular sus magnitudes físicas,
consultar las ecuaciones aplicadas, visualizar gráficas y observar la
evolución de una partícula mediante una animación en Canvas.

## Características principales

-   Simulación de seis tipos de movimiento:
    -   Movimiento rectilíneo uniforme (MRU).
    -   Movimiento rectilíneo uniformemente acelerado (MRUA).
    -   Caída libre.
    -   Lanzamiento vertical.
    -   Lanzamiento horizontal.
    -   Lanzamiento parabólico.
-   Formularios dinámicos que muestran los datos necesarios para cada
    movimiento.
-   Validación de entradas numéricas y de sus rangos.
-   Cálculo de posición, velocidad, aceleración, tiempo de vuelo, altura
    máxima y alcance horizontal, según corresponda.
-   Presentación de resultados y ecuaciones con sustitución numérica.
-   Gráficas de las magnitudes físicas y de la trayectoria.
-   Animación de la partícula en un plano Canvas.
-   Controles para iniciar, pausar, reanudar, reiniciar y cambiar la
    velocidad de reproducción.
-   Resultados mostrados con tres decimales y separador decimal con
    punto.

## Tecnologías utilizadas

-   HTML5 para la estructura de las páginas.
-   CSS3 para los estilos y la presentación.
-   JavaScript (módulos ES) para la lógica de la interfaz, validaciones
    e integración.
-   Canvas 2D para representar la simulación.
-   Chart.js para generar las gráficas.

La distribución local de Chart.js se encuentra en `js/vendor/`; no es
necesario cargar la biblioteca desde un CDN cuando se utiliza esa copia
local.

## Requisitos

-   Un navegador moderno compatible con JavaScript ES Modules, Canvas 2D
    y `requestAnimationFrame`.
-   Visual Studio Code u otro editor de código.
-   Un servidor local para ejecutar el proyecto. Se recomienda la
    extensión **Live Server** de Visual Studio Code.

> No se recomienda abrir las páginas directamente con `file://`, porque
> los módulos JavaScript pueden ser bloqueados por las políticas de
> seguridad del navegador. Ejecuta el proyecto mediante un servidor
> local.

## Ejecución del proyecto

1.  Clona el repositorio:

    ``` bash
    git clone https://github.com/qr24001-bot/SimuladorUnidimensionalBidimencional.git
    ```

2.  Entra en la carpeta del proyecto:

    ``` bash
    cd SimuladorUnidimensionalBidimencional
    ```

3.  Abre la carpeta en Visual Studio Code.

4.  Inicia **Live Server** desde `index.html`.

5.  Desde la página principal, accede a la simulación unidimensional o
    bidimensional.

Si ya tienes una copia local del proyecto, abre esa carpeta en el editor
y ejecuta `index.html` con Live Server.

## Uso de la aplicación

1.  Selecciona la sección unidimensional o bidimensional.
2.  Escoge el tipo de movimiento.
3.  Introduce los datos solicitados en el formulario.
4.  Pulsa **Simular** para validar los datos y calcular los resultados.
5.  Consulta la tabla de resultados, las ecuaciones y las gráficas.
6.  Pulsa **Iniciar** para comenzar la animación.
7.  Utiliza **Pausar** para detener temporalmente la animación. Pulsa
    **Iniciar** nuevamente para continuar.
8.  Pulsa **Reiniciar** para regresar al instante inicial. Después,
    pulsa **Iniciar** para volver a ejecutar la animación.
9.  Selecciona la velocidad de reproducción disponible para modificar el
    ritmo de la animación.

## Convenciones físicas

-   Se utilizan unidades del Sistema Internacional (SI): metros (m),
    metros por segundo (m/s), metros por segundo al cuadrado (m/s²) y
    segundos (s).
-   El eje X positivo apunta hacia la derecha.
-   El eje Y positivo apunta hacia arriba.
-   El suelo se representa en `y = 0`.
-   La magnitud de la gravedad predeterminada es `g = 9.81 m/s²`; cuando
    se utiliza el eje Y positivo hacia arriba, la aceleración vertical
    por gravedad es `aᵧ = −g`.
-   Los ángulos se introducen en grados en la interfaz.
-   Los signos de las velocidades y aceleraciones se conservan de
    acuerdo con el sistema de referencia.
-   Los cálculos utilizan la precisión numérica de JavaScript; los
    valores presentados al usuario se redondean a tres decimales.
-   En los movimientos con gravedad, el tiempo de vuelo se determina
    considerando la altura inicial y el instante positivo en que la
    partícula alcanza el suelo, cuando corresponde.

## Estructura del proyecto

``` text
SIMUCIN/
├── index.html
├── css/
│   └── style.css
├── pages/
│   ├── unidimensional.html
│   └── bidimensional.html
└── js/
    ├── main.js
    ├── charts/
    │   └── graphs.js
    ├── physics/
    │   ├── base.js
    │   ├── mru.js
    │   ├── mrua.js
    │   ├── caida-libre.js
    │   ├── lanzamiento-vertical.js
    │   ├── lanzamiento-horizontal.js
    │   └── lanzamiento-parabolico.js
    ├── simulation/
    │   ├── renderer.js
    │   └── animator.js
    ├── utils/
    │   ├── constantes.js
    │   ├── validation.js
    │   ├── formulario.js
    │   └── panel.js
    └── vendor/
        └── chart.umd.min.js
```

La estructura anterior resume los módulos principales identificados
durante la integración. Pueden existir otros archivos auxiliares en el
repositorio.

## Organización de los módulos

-   **`js/main.js`**: coordina el formulario, la validación, la creación
    del modelo físico, los resultados, las ecuaciones, las gráficas y la
    animación.
-   **`js/physics/`**: contiene los modelos matemáticos de los
    movimientos. `base.js` reúne funciones físicas compartidas.
-   **`js/simulation/renderer.js`**: dibuja el escenario y la posición
    de la partícula en Canvas.
-   **`js/simulation/animator.js`**: administra el avance temporal de la
    simulación y los controles de reproducción.
-   **`js/charts/graphs.js`**: genera y actualiza las gráficas mediante
    Chart.js.
-   **`js/utils/`**: contiene constantes, validaciones, lógica del
    formulario y presentación del panel de resultados y ecuaciones.
-   **`pages/`**: contiene las páginas de las simulaciones
    unidimensional y bidimensional.

## Validaciones de entrada

La interfaz comprueba, entre otros aspectos:

-   Que los valores introducidos sean numéricos y finitos.
-   Que no se exceda el límite absoluto configurado para las entradas
    (`1 × 10⁶`).
-   Que la altura inicial no sea negativa.
-   Que el tiempo no sea negativo.
-   Que la gravedad sea positiva.
-   Que el ángulo esté dentro del intervalo de −90° a 90°.
-   Que se acepten tanto coma como punto como separador decimal.

Los campos solicitados dependen del movimiento seleccionado:

  Movimiento               Datos de entrada
  ------------------------ ------------------------------
  MRU                      `x0`, `v`, `t`
  MRUA                     `x0`, `v0`, `a`, `t`
  Caída libre              `y0`, `v0`, `g`
  Lanzamiento vertical     `y0`, `v0`, `g`
  Lanzamiento horizontal   `x0`, `y0`, `vx`, `g`
  Lanzamiento parabólico   `x0`, `y0`, `v0`, `ang`, `g`

## Pruebas realizadas durante la integración

Se realizaron pruebas manuales de los seis movimientos, comprobando los resultados numéricos, las ecuaciones, la generación de gráficas y el funcionamiento de los controles de animación.

Se ejecutaron 18 pruebas automatizadas de validación de entradas, con el siguiente resultado: **18 aprobadas y 0 fallidas**.

Adicionalmente, se implementó una página independiente de pruebas de animación en `tests/correr-pruebas.html`, con 54 comprobaciones automatizadas correspondientes a los seis movimientos:

- MRU.
- MRUA.
- Caída libre.
- Lanzamiento vertical.
- Lanzamiento horizontal.
- Lanzamiento parabólico.

Para cada movimiento se comprobaron tres instantes: inicio, mitad y final. En cada instante se verificaron:

- La posición de la partícula en metros.
- La conversión de la posición a píxeles en Canvas.
- El color de la partícula dibujada.

**Resultado de la ejecución:** 54 pruebas correctas y 0 fallidas.

Estas pruebas verifican la representación y conversión de posiciones durante la animación; no constituyen una certificación completa de todos los módulos del proyecto.

## Equipo de trabajo

El proyecto se desarrolló mediante la división de responsabilidades
entre cuatro integrantes:

-   **Integrante 1:** motor físico unidimensional, gráficas y pruebas
    relacionadas con los movimientos 1D.
-   **Integrante 2:** motor físico bidimensional, gráficas y pruebas
    relacionadas con los movimientos 2D.
-   **Integrante 3:** representación visual, Canvas, animación y
    controles de reproducción.
-   **Integrante 4:** interfaz HTML/CSS, formularios, validaciones,
    panel de resultados y ecuaciones, integración y documentación
    general.

La asignación resume las responsabilidades del equipo; la entrega
individual de cada evidencia o documento debe confirmarse con el
integrante correspondiente.

## Repositorio

Código fuente:
https://github.com/qr24001-bot/SimuladorUnidimensionalBidimencional

## Estado del proyecto

La integración local cuenta con las páginas de simulación, los modelos
físicos, las gráficas y el sistema de animación. Se han realizado
pruebas manuales de los seis movimientos y de los controles principales.

Antes de una entrega definitiva, se recomienda verificar:

-   Que todos los cambios estén guardados y versionados en la rama
    acordada.
-   Que las ramas y solicitudes de integración del equipo estén
    revisadas.
-   Que el README y las evidencias individuales estén completos.
-   Que la consola del navegador no presente errores.
-   Que el proyecto funcione desde una descarga limpia del repositorio y
    mediante un servidor local.

## Licencia

No se especifica una licencia de distribución en este documento. Si el
equipo desea publicar o reutilizar el proyecto bajo una licencia de
código abierto, debe acordar e incorporar el archivo de licencia
correspondiente.
