import { validar, convertirNumero } from '../js/utils/validation.js';

let aprobadas = 0;
let falladas = 0;

// Muestra el resultado en la consola y, si existe, en la página de pruebas.
function mostrar(texto, bien) {
  const marca = bien ? '✓' : '✗';
  console.log(`${marca} ${texto}`);

  if (typeof document !== 'undefined') {
    const lista = document.getElementById('resultados');
    if (lista) {
      const item = document.createElement('li');
      item.textContent = `${marca} ${texto}`;
      item.className = bien ? 'ok' : 'fallo';
      lista.appendChild(item);
    }
  }
}

function probar(nombre, funcion) {
  try {
    funcion();
    aprobadas++;
    mostrar(nombre, true);
  } catch (error) {
    falladas++;
    mostrar(`${nombre} — ${error.message}`, false);
  }
}

function verificar(condicion, mensaje) {
  if (!condicion) throw new Error(mensaje);
}

function esperarIgual(actual, esperado, nombre) {
  verificar(actual === esperado, `${nombre}: se esperaba ${esperado} y se obtuvo ${actual}`);
}

function camposConError(resultado) {
  return resultado.errores.map(error => error.campo).join(',');
}

// ===== Casos válidos =====

probar('MRU válido devuelve los datos como números', () => {
  const r = validar('mru', { x0: '0', v: '5', t: '10' });
  verificar(r.valido, 'debía ser válido');
  esperarIgual(r.datos.x0, 0, 'x0');
  esperarIgual(r.datos.v, 5, 'v');
  esperarIgual(r.datos.t, 10, 't');
});

probar('Acepta la coma decimal (9,81)', () => {
  const r = validar('caida-libre', { y0: '100', v0: '0', g: '9,81' });
  verificar(r.valido, 'debía ser válido');
  esperarIgual(r.datos.g, 9.81, 'g');
});

probar('Acepta punto decimal y signo negativo', () => {
  const r = validar('mrua', { x0: '-2.5', v0: '1', a: '1', t: '1' });
  verificar(r.valido, 'debía ser válido');
  esperarIgual(r.datos.x0, -2.5, 'x0');
});

probar('Permite velocidad y aceleración negativas', () => {
  const r = validar('mrua', { x0: '0', v0: '-4', a: '-2', t: '3' });
  verificar(r.valido, 'debía ser válido');
  esperarIgual(r.datos.v0, -4, 'v0');
  esperarIgual(r.datos.a, -2, 'a');
});

probar('Ángulo: acepta -90, 0 y 90', () => {
  ['-90', '0', '90'].forEach(ang => {
    const r = validar('lanzamiento-parabolico', { x0: '0', y0: '0', v0: '20', ang, g: '9,81' });
    verificar(r.valido, `θ = ${ang} debía ser válido`);
  });
});

probar('Ignora campos que no corresponden al movimiento', () => {
  const r = validar('mru', { x0: '0', v: '5', t: '10', y0: 'abc' });
  verificar(r.valido, 'debía ser válido');
  esperarIgual(r.datos.y0, undefined, 'y0');
});

// ===== Casos inválidos =====

probar('Rechaza campos vacíos', () => {
  const r = validar('mru', { x0: '0', v: '', t: '10' });
  verificar(!r.valido, 'debía ser inválido');
  esperarIgual(camposConError(r), 'v', 'campos con error');
});

probar('Rechaza texto que no es número', () => {
  const r = validar('mru', { x0: '0', v: 'abc', t: '10' });
  verificar(!r.valido, 'debía ser inválido');
  esperarIgual(camposConError(r), 'v', 'campos con error');
});

probar('Rechaza Infinity y NaN', () => {
  ['Infinity', 'NaN'].forEach(texto => {
    const r = validar('mru', { x0: '0', v: texto, t: '10' });
    verificar(!r.valido, `«${texto}» debía ser inválido`);
  });
});

probar('Rechaza notación científica', () => {
  const r = validar('mru', { x0: '0', v: '1e3', t: '10' });
  verificar(!r.valido, 'debía ser inválido');
});

probar('Rechaza valores demasiado grandes', () => {
  const r = validar('mru', { x0: '0', v: '10000000', t: '10' });
  verificar(!r.valido, 'debía ser inválido');
});

probar('Rechaza tiempo negativo', () => {
  const r = validar('mru', { x0: '0', v: '5', t: '-1' });
  verificar(!r.valido, 'debía ser inválido');
  esperarIgual(camposConError(r), 't', 'campos con error');
});

probar('Rechaza altura inicial negativa', () => {
  const r = validar('caida-libre', { y0: '-3', v0: '0', g: '9,81' });
  verificar(!r.valido, 'debía ser inválido');
  esperarIgual(camposConError(r), 'y0', 'campos con error');
});

probar('Rechaza gravedad 0 y negativa', () => {
  ['0', '-9,81'].forEach(g => {
    const r = validar('caida-libre', { y0: '10', v0: '0', g });
    verificar(!r.valido, `g = ${g} debía ser inválido`);
  });
});

probar('Ángulo: rechaza -91 y 91', () => {
  ['-91', '91'].forEach(ang => {
    const r = validar('lanzamiento-parabolico', { x0: '0', y0: '0', v0: '20', ang, g: '9,81' });
    verificar(!r.valido, `θ = ${ang} debía ser inválido`);
  });
});

probar('Informa varios errores a la vez', () => {
  const r = validar('mru', { x0: '', v: 'abc', t: '-1' });
  verificar(!r.valido, 'debía ser inválido');
  esperarIgual(camposConError(r), 'x0,v,t', 'campos con error');
});

probar('Rechaza un movimiento desconocido', () => {
  const r = validar('movimiento-inventado', {});
  verificar(!r.valido, 'debía ser inválido');
  esperarIgual(r.errores.length, 1, 'cantidad de errores');
});

// ===== Función de conversión =====

probar('convertirNumero maneja coma, punto y vacío', () => {
  esperarIgual(convertirNumero('9,81'), 9.81, '9,81');
  esperarIgual(convertirNumero('-3'), -3, '-3');
  verificar(Number.isNaN(convertirNumero('')), 'vacío debía dar NaN');
  verificar(Number.isNaN(convertirNumero('1,2,3')), '1,2,3 debía dar NaN');
});

// ===== Resumen =====

mostrar(`Resultado: ${aprobadas} aprobadas, ${falladas} falladas`, falladas === 0);

if (typeof process !== 'undefined' && falladas > 0) {
  process.exitCode = 1;
}