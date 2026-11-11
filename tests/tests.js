
animador.tFisico = t;
animador._dibujar();
const esperado = motor.posicion(t);
const dibujado = Renderer.ultimaPosicion();
console.assert(Math.abs(dibujado.y - esperado.y) < 1e-9, `y no coincide en t=${t}`);