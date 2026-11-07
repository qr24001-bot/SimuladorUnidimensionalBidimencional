import { iniciarFormulario, mostrarErrores, limpiarErrores } from './utils/formulario.js';
import { validar } from './utils/validation.js';

iniciarFormulario((movimiento, crudos) => {
  const resultado = validar(movimiento, crudos);

  if (!resultado.valido) {
    mostrarErrores(resultado.errores);
    return;
  }

  limpiarErrores();

  // Temporal: en el siguiente paso se conectará con los motores.
  console.log('Movimiento:', movimiento, 'Datos válidos:', resultado.datos);
});