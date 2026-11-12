
import {
  iniciarFormulario,
  mostrarErrores,
  limpiarErrores
} from './utils/formulario.js';

import { validar } from './utils/validation.js';

// Motores 1D
import { mru } from './physics/mru.js';
import { mrua } from './physics/mrua.js';
import { caidaLibre } from './physics/caida-libre.js';
import { lanzamientoVertical } from './physics/lanzamiento-vertical.js';

// Panel y gráficas
import {
  mostrarResultados,
  mostrarEcuaciones
} from './utils/panel.js';

import { graficas, marcar } from './charts/graphs.js';

// Animación
const Renderer = globalThis.SIMUCIN?.Renderer;
const Animator = globalThis.SIMUCIN?.Animator;

let animator = null;


// Elementos de la interfaz
const canvas = document.getElementById('canvas-simulacion');
const btnIniciar = document.getElementById('btn-iniciar');
const btnPausar = document.getElementById('btn-pausar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const selVelocidad = document.getElementById('sel-velocidad');
const lblTiempo = document.getElementById('lbl-tiempo');


// Crear el motor correspondiente al movimiento seleccionado
function crearMotor(movimiento, datos) {
  switch (movimiento) {
    case 'mru':
      return mru(datos);

    case 'mrua':
      return mrua(datos);

    case 'caida-libre':
      return caidaLibre(datos);

    case 'lanzamiento-vertical':
      return lanzamientoVertical(datos);

    case 'lanzamiento-horizontal': {
      const motor = globalThis.SIMUCIN?.crearLanzamientoHorizontal(datos);

      if (!motor) {
        throw new Error('No se encontró el motor de lanzamiento horizontal.');
      }

      motor.dim = 2;
      return motor;
    }

    case 'lanzamiento-parabolico': {
      const motor = globalThis.SIMUCIN?.crearLanzamientoParabolico(datos);

      if (!motor) {
        throw new Error('No se encontró el motor de lanzamiento parabólico.');
      }

      motor.dim = 2;
      return motor;
    }

    default:
      throw new Error(`Movimiento no reconocido: ${movimiento}`);
  }
}


// Adaptar resultados al formato del panel
function adaptarResultados(movimiento, resultados) {
  if (Array.isArray(resultados)) {
    return resultados;
  }

  const etiquetas = {
    xFinal: ['Posición final', 'm'],
    desplazamiento: ['Desplazamiento', 'm'],
    velocidad: ['Velocidad', 'm/s'],
    tiempo: ['Tiempo', 's'],
    vFinal: ['Velocidad final', 'm/s'],
    tInversion: ['Tiempo de inversión', 's'],
    tImpacto: ['Tiempo de impacto', 's'],
    vImpacto: ['Velocidad de impacto', 'm/s'],
    tMax: ['Tiempo para alcanzar altura máxima', 's'],
    hMax: ['Altura máxima', 'm']
  };

  return Object.entries(resultados).map(([clave, valor]) => ({
    etiqueta: etiquetas[clave]?.[0] ?? clave,
    valor: valor === null ? '—' : valor,
    unidad: etiquetas[clave]?.[1] ?? ''
  }));
}


// Adaptar ecuaciones al formato del panel
function adaptarEcuaciones(ecuaciones) {
  if (ecuaciones.length === 0 || !Array.isArray(ecuaciones[0])) {
    return ecuaciones;
  }

  return ecuaciones.map(([ecuacion, sustitucion, resultado]) => ({
    ecuacion,
    sustitucion,
    resultado
  }));
}


// Obtener ecuaciones según el motor
function obtenerEcuaciones(motor) {
  if (typeof motor.ecuaciones === 'function') {
    return motor.ecuaciones();
  }

  if (typeof motor.ecuacion === 'function') {
    return motor.ecuacion();
  }

  throw new Error('El motor no proporciona ecuaciones.');
}


// Obtener las dimensiones máximas de la trayectoria
function obtenerEscala(motor) {
  const T = motor.duracion();

  let maxX = 0;
  let maxY = 0;

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

    maxX = Math.max(maxX, Math.abs(x));
    maxY = Math.max(maxY, Math.abs(y));
  }

  return {
    xMax: Math.max(10, maxX * 1.15),
    yMax: Math.max(10, maxY * 1.15),
    centrarX: motor.dim === 1 && motor.eje === 'y'
  };
}


// Actualizar el tiempo mostrado
function actualizarTiempo(t) {
  lblTiempo.textContent =
    `t = ${t.toFixed(3).replace('.', ',')} s`;
}


// Conectar los botones de animación
btnIniciar.addEventListener('click', () => {
  animator?.iniciar();
});

btnPausar.addEventListener('click', () => {
  animator?.pausar();
});

btnReiniciar.addEventListener('click', () => {
  if (animator) {
    animator.reiniciar();
  }
});

selVelocidad.addEventListener('change', () => {
  animator?.setVelocidad(Number(selVelocidad.value));
});


// Evento principal del formulario
iniciarFormulario((movimiento, crudos) => {

  // Detener una animación anterior al realizar otro cálculo.
  animator?.pausar();

  const resultado = validar(movimiento, crudos);

  if (!resultado.valido) {
    mostrarErrores(resultado.errores);
    return;
  }

  limpiarErrores();

  try {
    if (!Renderer || !Animator) {
      throw new Error('No se encontraron los archivos de animación.');
    }

    const motor = crearMotor(movimiento, resultado.datos);

    // Mostrar resultados
    const resultados = adaptarResultados(
      movimiento,
      motor.resultados()
    );

    mostrarResultados(resultados);

    // Mostrar ecuaciones
    const ecuaciones = adaptarEcuaciones(
      obtenerEcuaciones(motor)
    );

    mostrarEcuaciones(
      movimiento,
      resultado.datos,
      ecuaciones
    );

    // Crear gráficas
    graficas(
      document.getElementById('contenedor-graficas'),
      motor
    );

    // Configurar el renderer según el movimiento.
    const escala = obtenerEscala(motor);

    Renderer.iniciar('canvas-simulacion', escala);

    // Crear el animador y sincronizar tiempo y gráficas.
    animator = new Animator(motor, Renderer, t => {
      marcar(t);
      actualizarTiempo(t);
    });

    // Aplicar la velocidad seleccionada.
    animator.setVelocidad(Number(selVelocidad.value));

    console.log('Motor:', motor);
    console.log('Animación preparada correctamente.');

  } catch (error) {
    console.error('Error al ejecutar la simulación:', error);

    mostrarErrores([
      'Ocurrió un error al calcular o preparar la simulación.'
    ]);
  }
});
