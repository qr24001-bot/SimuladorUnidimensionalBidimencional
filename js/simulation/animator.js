// simulation/animator.js
// Anima un motor físico. Separa el tiempo físico del tiempo real usando
// un paso fijo (DT) y un acumulador.
//
// Un "motor" es cualquier objeto con:
//   motor.tiempoTotal      -> duración de la simulación en segundos
//   motor.posicion(t)      -> {x, y} (o un número) en metros

class Animator {
  static DT = 1 / 60;          // paso físico fijo (segundos)
  static MAX_DELTA = 0.1;      // evita saltos enormes si la pestaña se pausa

  constructor(motor, renderer) {
    this.motor = motor;
    this.renderer = renderer;
    this.tFisico = 0;          // tiempo de la simulación
    this.velocidad = 1;        // 1 = tiempo real, 0.5 = cámara lenta, 2 = doble
    this.corriendo = false;
    this._acumulador = 0;
    this._ultimoReal = null;
    this._idFrame = null;
    this._bucle = this._bucle.bind(this);
    this._dibujar();           // muestra la posición inicial (t = 0)
  }

  iniciar() {
    if (this.corriendo) return;
    if (this.tFisico >= this.motor.tiempoTotal) this.reiniciar(false);
    this.corriendo = true;
    this._ultimoReal = null;
    this._idFrame = requestAnimationFrame(this._bucle);
  }

  pausar() {
    this.corriendo = false;
    cancelAnimationFrame(this._idFrame);
  }

  // Vuelve a t = 0. Si "dibujar" es true, redibuja el estado inicial.
  reiniciar(dibujar = true) {
    this.pausar();
    this.tFisico = 0;
    this._acumulador = 0;
    if (dibujar) this._dibujar();
  }

  setVelocidad(v) {
    this.velocidad = Math.max(0.1, v);
  }

  // Cambia de motor (cuando el usuario elige otro movimiento).
  setMotor(motor) {
    this.motor = motor;
    this.reiniciar();
  }

  _bucle(ahora) {
    if (!this.corriendo) return;

    if (this._ultimoReal === null) this._ultimoReal = ahora;
    let delta = (ahora - this._ultimoReal) / 1000;   // segundos reales
    this._ultimoReal = ahora;
    delta = Math.min(delta, Animator.MAX_DELTA);

    // El tiempo real alimenta el acumulador; la física avanza en pasos fijos.
    this._acumulador += delta * this.velocidad;
    while (this._acumulador >= Animator.DT) {
      this.tFisico += Animator.DT;
      this._acumulador -= Animator.DT;
    }

    if (this.tFisico >= this.motor.tiempoTotal) {
      this.tFisico = this.motor.tiempoTotal;         // queda exactamente al final
      this._dibujar();
      this.corriendo = false;
      return;
    }

    this._dibujar();
    this._idFrame = requestAnimationFrame(this._bucle);
  }

  _dibujar() {
    this.renderer.dibujarEscena(this.motor.posicion(this.tFisico));
  }
}
