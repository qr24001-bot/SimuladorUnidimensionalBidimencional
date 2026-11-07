import { iniciarFormulario } from './utils/formulario.js';

iniciarFormulario((movimiento, datos) => {
  // Temporal: en el Paso 6 se validará y luego se conectará con los motores.
  console.log('Movimiento:', movimiento, 'Datos crudos:', datos);
});