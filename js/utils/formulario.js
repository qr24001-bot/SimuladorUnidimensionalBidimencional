import { CAMPOS_POR_MOVIMIENTO } from './constantes.js';

const formulario = document.getElementById('formulario-datos');
const selector = document.getElementById('sel-movimiento');

export function movimientoActual() {
  return selector.value;
}

// Muestra solo los campos que corresponden al movimiento elegido.
export function mostrarCampos() {
  const necesarios = CAMPOS_POR_MOVIMIENTO[movimientoActual()];

  formulario.querySelectorAll('.campo input').forEach(input => {
    const visible = necesarios.includes(input.name);
    input.closest('.campo').hidden = !visible;
    input.disabled = !visible;
  });
}

// Devuelve los valores escritos, sin convertir ni validar todavía (texto).
export function leerDatosCrudos() {
  const datos = {};
  CAMPOS_POR_MOVIMIENTO[movimientoActual()].forEach(clave => {
    datos[clave] = formulario.elements[clave].value.trim();
  });
  return datos;
}

// Prepara el formulario y avisa cuando el usuario presiona «Simular».
export function iniciarFormulario(alEnviar) {
  mostrarCampos();
  selector.addEventListener('change', mostrarCampos);

  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    alEnviar(movimientoActual(), leerDatosCrudos());
  });
}