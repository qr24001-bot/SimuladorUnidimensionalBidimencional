import { CAMPOS_POR_MOVIMIENTO, LIMITE_ABSOLUTO } from './constantes.js';

export const ETIQUETAS = {
  x0: 'Posición inicial x₀',
  y0: 'Altura inicial y₀',
  v: 'Velocidad v',
  v0: 'Velocidad inicial v₀',
  vx: 'Velocidad horizontal vₓ',
  a: 'Aceleración a',
  t: 'Tiempo t',
  g: 'Gravedad g',
  ang: 'Ángulo θ'
};

// Reglas adicionales por campo. Reciben el número y devuelven un mensaje si no es válido.
const REGLAS = {
  y0: n => (n < 0 ? 'no puede ser negativa (el suelo está en y = 0).' : null),
  t: n => (n < 0 ? 'no puede ser negativo.' : null),
  g: n => (n <= 0 ? 'debe ser mayor que 0.' : null),
  ang: n => (n < -90 || n > 90 ? 'debe estar entre -90° y 90°.' : null)
};

// Acepta enteros y decimales con punto o coma, con signo opcional. Sin notación científica.
const FORMATO_NUMERO = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)$/;

export function convertirNumero(texto) {
  if (!FORMATO_NUMERO.test(texto)) return NaN;
  return Number(texto.replace(',', '.'));
}

// Recibe el movimiento y los datos crudos (texto) del formulario.
// Devuelve { valido, datos (números), errores: [{ campo, mensaje }] }.
export function validar(movimiento, crudos) {
  const campos = CAMPOS_POR_MOVIMIENTO[movimiento];
  const datos = {};
  const errores = [];

  if (!campos) {
    errores.push({ campo: null, mensaje: 'Movimiento no reconocido.' });
    return { valido: false, datos, errores };
  }

  campos.forEach(clave => {
    const etiqueta = ETIQUETAS[clave];
    const texto = String(crudos[clave] ?? '').trim();

    if (texto === '') {
      errores.push({ campo: clave, mensaje: `${etiqueta}: escribe un valor.` });
      return;
    }

    const numero = convertirNumero(texto);

    if (!Number.isFinite(numero)) {
      errores.push({ campo: clave, mensaje: `${etiqueta}: «${texto}» no es un número válido.` });
      return;
    }

    if (Math.abs(numero) > LIMITE_ABSOLUTO) {
      errores.push({ campo: clave, mensaje: `${etiqueta}: el valor es demasiado grande.` });
      return;
    }

    const problema = REGLAS[clave] ? REGLAS[clave](numero) : null;
    if (problema) {
      errores.push({ campo: clave, mensaje: `${etiqueta}: ${problema}` });
      return;
    }

    datos[clave] = numero;
  });

  return { valido: errores.length === 0, datos, errores };
}