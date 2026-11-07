import { CAMPOS_POR_MOVIMIENTO } from './constantes.js';

const formulario = document.getElementById('formulario-datos');
const selector = document.getElementById('sel-movimiento');
const listaErrores = document.getElementById('lista-errores');

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

export function limpiarErrores() {
  listaErrores.hidden = true;
  listaErrores.replaceChildren();
  formulario.querySelectorAll('input.invalido').forEach(input => {
    input.classList.remove('invalido');
  });
}

// Recibe una lista [{ campo, mensaje }] y la muestra en pantalla.
export function mostrarErrores(errores) {
  limpiarErrores();

  errores.forEach(({ campo, mensaje }) => {
    const item = document.createElement('li');
    item.textContent = mensaje;
    listaErrores.appendChild(item);

    if (campo) {
      formulario.elements[campo].classList.add('invalido');
    }
  });

  listaErrores.hidden = false;

  const primero = errores.find(error => error.campo);
  if (primero) {
    formulario.elements[primero.campo].focus();
  }
}

// Prepara el formulario y avisa cuando el usuario presiona «Simular».
export function iniciarFormulario(alEnviar) {
  mostrarCampos();

  selector.addEventListener('change', () => {
    mostrarCampos();
    limpiarErrores();
  });

  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    alEnviar(movimientoActual(), leerDatosCrudos());
  });
}