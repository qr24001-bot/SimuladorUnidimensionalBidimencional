
import { mru } from '../js/physics/mru.js';
import { mrua } from '../js/physics/mrua.js';
import { caidaLibre } from '../js/physics/caida-libre.js';
import { lanzamientoVertical } from '../js/physics/lanzamiento-vertical.js';

const motores = [
  {
    nombre: 'MRU',
    crear: () => mru({ x0: 0, v: 5, t: 4 })
  },
  {
    nombre: 'MRUA',
    crear: () => mrua({ x0: 0, v0: 2, a: 2, t: 4 })
  },
  {
    nombre: 'Caída libre',
    crear: () => caidaLibre({ y0: 20, v0: 0, g: 9.81 })
  },
  {
    nombre: 'Lanzamiento vertical',
    crear: () => lanzamientoVertical({ y0: 0, v0: 20, g: 9.81 })
  },
  {
    nombre: 'Lanzamiento horizontal',
    crear: () => SIMUCIN.crearLanzamientoHorizontal({
      y0: 10,
      vx: 10,
      g: 9.81
    })
  },
  {
  nombre: 'Lanzamiento parabólico',
  crear: () => SIMUCIN.crearLanzamientoParabolico({
    x0: 0,
    y0: 0,
    v0: 20,
    ang: 45,
    g: 9.81
  })
},
  {
    nombre: 'MRU velocidad negativa',
    crear: () => mru({ x0: 0, v: -5, t: 4 })
  },
  {
    nombre: 'MRUA aceleración negativa',
    crear: () => mrua({ x0: 0, v0: 2, a: -2, t: 4 })
  },
  {
    nombre: 'Caída libre hacia arriba',
    crear: () => caidaLibre({ y0: -20, v0: 0, g: -9.81 })
  },
  {
    nombre: 'Lanzamiento vertical hacia abajo',
    crear: () => lanzamientoVertical({ y0: 20, v0: -15, g: 9.81 })
  }
];

let total = 0;
let correctas = 0;
let fallidas = 0;

const resultados = document.getElementById('resultados');
const resumen = document.getElementById('resumen');
const canvas = document.getElementById('canvas-pruebas');

function registrar(nombre, condicion, detalle = '') {
  total++;

  const elemento = document.createElement('li');

  if (condicion) {
    correctas++;
    elemento.textContent = `✓ ${nombre}`;
    elemento.style.color = 'green';
  } else {
    fallidas++;
    elemento.textContent = `✗ ${nombre} ${detalle}`;
    elemento.style.color = 'red';
  }

  resultados.appendChild(elemento);
}

function ajustarLimites(minimo, maximo, centrar = false) {
  const rango = maximo - minimo;

  if (rango < 0.000001) {
    return centrar
      ? { min: -5, max: 5 }
      : { min: 0, max: 10 };
  }

  const espacio = Math.max(0.5, rango * 0.15);

  if (minimo >= 0) {
    return {
      min: 0,
      max: Math.max(10, maximo + espacio)
    };
  }

  if (maximo <= 0) {
    return {
      min: Math.min(-10, minimo - espacio),
      max: 0
    };
  }

  return {
    min: minimo - espacio,
    max: maximo + espacio
  };
}

function obtenerEscala(motor) {
  const T = motor.duracion();

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i <= 200; i++) {
    const t = T * i / 200;
    const posicion = motor.posicion(t);

    let x;
    let y;

    if (typeof posicion === 'number') {
      if (motor.eje === 'y') {
        x = 0;
        y = posicion;
      } else {
        x = posicion;
        y = 0;
      }
    } else {
      x = posicion.x;
      y = posicion.y;
    }

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const centrarX = motor.dim === 1 && motor.eje === 'y';

  const limitesX = ajustarLimites(minX, maxX, centrarX);
  const limitesY = ajustarLimites(minY, maxY);

  return {
    xMin: limitesX.min,
    xMax: limitesX.max,
    yMin: limitesY.min,
    yMax: limitesY.max,
    centrarX
  };
}

function colorEnPixel(x, y) {
  const ctx = canvas.getContext('2d');

  if (
    x < 0 ||
    y < 0 ||
    x >= canvas.width ||
    y >= canvas.height
  ) {
    return false;
  }

  const pixel = ctx.getImageData(
    Math.floor(x),
    Math.floor(y),
    1,
    1
  ).data;

  return pixel[3] > 0;
}

function probarMotor(nombre, motor) {
  const T = motor.duracion();

  const escala = obtenerEscala(motor);

  globalThis.SIMUCIN.Renderer.iniciar('canvas-pruebas', escala);

  const instantes = [
    { nombre: 'inicio', tiempo: 0 },
    { nombre: 'mitad', tiempo: T / 2 },
    { nombre: 'final', tiempo: T }
  ];

  for (const instante of instantes) {
    const posicion = motor.posicion(instante.tiempo);

    let x;
    let y;

    if (typeof posicion === 'number') {
      if (motor.eje === 'y') {
        x = 0;
        y = posicion;
      } else {
        x = posicion;
        y = 0;
      }
    } else {
      x = posicion.x;
      y = posicion.y;
    }

    globalThis.SIMUCIN.Renderer.dibujarEscena(x, y);

    const ultima = globalThis.SIMUCIN.Renderer.ultimaPosicion();

    registrar(
      `${nombre} - ${instante.nombre}: posición en metros`,
      ultima &&
        Math.abs(ultima.x - x) < 0.001 &&
        Math.abs(ultima.y - y) < 0.001
    );

    const pixel = globalThis.SIMUCIN.Renderer.metrosAPixeles(x, y);

    registrar(
      `${nombre} - ${instante.nombre}: conversión a píxeles`,
      Number.isFinite(pixel.x) &&
        Number.isFinite(pixel.y) &&
        pixel.x >= 0 &&
        pixel.x < canvas.width &&
        pixel.y >= 0 &&
        pixel.y < canvas.height
    );

    registrar(
      `${nombre} - ${instante.nombre}: color de partícula`,
      colorEnPixel(pixel.x, pixel.y)
    );

    const radio = 8;

    registrar(
      `${nombre} - ${instante.nombre}: encuadre`,
      pixel.x - radio >= 0 &&
        pixel.x + radio < canvas.width &&
        pixel.y - radio >= 0 &&
        pixel.y + radio < canvas.height
    );
  }
}

resultados.innerHTML = '';
resumen.textContent = 'Ejecutando pruebas...';

for (const elemento of motores) {
  try {
    const motor = elemento.crear();
    probarMotor(elemento.nombre, motor);
  } catch (error) {
    registrar(
      `${elemento.nombre}: ejecución`,
      false,
      error.message
    );
  }
}

resumen.textContent =
  `Pruebas realizadas: ${total} | ` +
  `Correctas: ${correctas} | ` +
  `Fallidas: ${fallidas}`;
