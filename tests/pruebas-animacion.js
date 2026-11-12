
import { mru } from '../js/physics/mru.js';
import { mrua } from '../js/physics/mrua.js';
import { caidaLibre } from '../js/physics/caida-libre.js';
import { lanzamientoVertical } from '../js/physics/lanzamiento-vertical.js';

const Renderer = globalThis.SIMUCIN.Renderer;
const Animator = globalThis.SIMUCIN.Animator;

const TOLERANCIA = 1e-9;
const COLOR_PARTICULA = [217, 72, 15];

const canvas = document.getElementById('canvas-pruebas');
const lista = document.getElementById('resultados');
const resumen = document.getElementById('resumen');

const motores = [
  {
    nombre: 'MRU',
    motor: mru({ x0: 0, v: 5, t: 4 })
  },
  {
    nombre: 'MRUA',
    motor: mrua({ x0: 0, v0: 2, a: 1, t: 4 })
  },
  {
    nombre: 'Caída libre',
    motor: caidaLibre({ y0: 20, v0: 0, g: 9.81 })
  },
  {
    nombre: 'Lanzamiento vertical',
    motor: lanzamientoVertical({ y0: 0, v0: 15, g: 9.81 })
  },
  {
    nombre: 'Lanzamiento horizontal',
    motor: globalThis.SIMUCIN.crearLanzamientoHorizontal({
      x0: 0, y0: 10, vx: 10, g: 9.81
    })
  },
  {
    nombre: 'Lanzamiento parabólico',
    motor: globalThis.SIMUCIN.crearLanzamientoParabolico({
      x0: 0, y0: 0, v0: 20, ang: 45, g: 9.81
    })
  }
];

function convertirPosicion(posicion, motor) {
  if (typeof posicion !== 'number') {
    return posicion;
  }

  return motor.eje === 'y'
    ? { x: 0, y: posicion }
    : { x: posicion, y: 0 };
}

function obtenerEscala(motor) {
  const T = motor.duracion();
  let maxX = 0;
  let maxY = 0;

  for (let i = 0; i <= 200; i++) {
    const t = T * i / 200;
    const p = convertirPosicion(motor.posicion(t), motor);

    maxX = Math.max(maxX, Math.abs(p.x));
    maxY = Math.max(maxY, Math.abs(p.y));
  }

  return {
    xMax: Math.max(10, maxX * 1.15),
    yMax: Math.max(10, maxY * 1.15),
    centrarX: motor.dim === 1 && motor.eje === 'y'
  };
}

function colorEnPixel(px, py) {
  const datos = canvas.getContext('2d').getImageData(
    Math.round(px),
    Math.round(py),
    1,
    1
  ).data;

  return [datos[0], datos[1], datos[2]];
}

let total = 0;
let fallas = 0;

function registrar(ok, nombre, detalle) {
  total++;

  if (!ok) fallas++;

  const elemento = document.createElement('li');
  elemento.className = ok ? 'correcta' : 'incorrecta';
  elemento.textContent =
    `${ok ? 'CORRECTO' : 'ERROR'}: ${nombre} — ${detalle}`;

  lista.appendChild(elemento);
}

function ejecutarPruebas() {
  motores.forEach(({ nombre, motor }) => {
    Renderer.iniciar('canvas-pruebas', obtenerEscala(motor));

    const animador = new Animator(motor, Renderer);

    const duracion = motor.duracion();

    const instantes = [
      ['inicio', 0],
      ['mitad', duracion / 2],
      ['final', duracion]
    ];

    instantes.forEach(([etiqueta, t]) => {
      animador.tFisico = t;
      animador._acumulador = 0;
      animador._dibujar();

      const esperado = convertirPosicion(
        motor.posicion(t),
        motor
      );

      const dibujado = Renderer.ultimaPosicion();

      const okMetros =
        Math.abs(dibujado.x - esperado.x) < TOLERANCIA &&
        Math.abs(dibujado.y - esperado.y) < TOLERANCIA;

      registrar(
        okMetros,
        `${nombre} - ${etiqueta} - metros`,
        `esperado (${esperado.x.toFixed(3)}, ${esperado.y.toFixed(3)}), ` +
        `dibujado (${dibujado.x.toFixed(3)}, ${dibujado.y.toFixed(3)})`
      );

      const pixeles = Renderer.metrosAPixeles(
        esperado.x,
        esperado.y
      );

      const okPixeles =
        Math.abs(dibujado.px - pixeles.px) < TOLERANCIA &&
        Math.abs(dibujado.py - pixeles.py) < TOLERANCIA;

      registrar(
        okPixeles,
        `${nombre} - ${etiqueta} - píxeles`,
        `esperado (${pixeles.px.toFixed(2)}, ${pixeles.py.toFixed(2)}), ` +
        `dibujado (${dibujado.px.toFixed(2)}, ${dibujado.py.toFixed(2)})`
      );

      const color = colorEnPixel(pixeles.px, pixeles.py);

      const okColor = color.every(
        (valor, i) =>
          Math.abs(valor - COLOR_PARTICULA[i]) <= 3
      );

      registrar(
        okColor,
        `${nombre} - ${etiqueta} - color`,
        `rgb(${color.join(', ')})`
      );
    });
  });

  resumen.textContent =
    `Pruebas realizadas: ${total} | Correctas: ${total - fallas} | Fallidas: ${fallas}`;
}

try {
  ejecutarPruebas();
} catch (error) {
  resumen.textContent = 'Error al ejecutar las pruebas: ' + error.message;
  console.error(error);
}
