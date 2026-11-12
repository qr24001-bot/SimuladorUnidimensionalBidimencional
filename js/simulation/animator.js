
// simulation/animator.js
// Controla la animación de los motores físicos de SIMUCIN.

class Animator {
  static DT = 1 / 60;
  static MAX_DELTA = 0.1;

  constructor(motor, renderer, alActualizar = () => {}) {
    this.motor = motor;
    this.renderer = renderer;
    this.alActualizar = alActualizar;

    this.tFisico = 0;
    this.velocidad = 1;
    this.corriendo = false;

    this._acumulador = 0;
    this._ultimoReal = null;
    this._idFrame = null;

    this._bucle = this._bucle.bind(this);

    this._dibujar();
  }

  iniciar() {
    if (this.corriendo) return;

    if (this.tFisico >= this.motor.duracion()) {
      this.reiniciar(false);
    }

    this.corriendo = true;
    this._ultimoReal = null;

    this._idFrame = requestAnimationFrame(this._bucle);
  }

  pausar() {
    this.corriendo = false;

    if (this._idFrame !== null) {
      cancelAnimationFrame(this._idFrame);
      this._idFrame = null;
    }
  }

  reiniciar(dibujar = true) {
    this.pausar();

    this.tFisico = 0;
    this._acumulador = 0;
    this._ultimoReal = null;

    if (dibujar) {
      this._dibujar();
    }
  }

  setVelocidad(v) {
    this.velocidad = Math.max(0.1, Number(v) || 1);
  }

  setMotor(motor) {
    this.motor = motor;
    this.reiniciar();
  }

  _bucle(ahora) {
    if (!this.corriendo) return;

    if (this._ultimoReal === null) {
      this._ultimoReal = ahora;
    }

    let delta = (ahora - this._ultimoReal) / 1000;
    this._ultimoReal = ahora;

    delta = Math.min(delta, Animator.MAX_DELTA);

    this._acumulador += delta * this.velocidad;

    while (this._acumulador >= Animator.DT) {
      this.tFisico += Animator.DT;
      this._acumulador -= Animator.DT;
    }

    const duracion = this.motor.duracion();

    if (this.tFisico >= duracion) {
      this.tFisico = duracion;
      this._acumulador = 0;

      this._dibujar();

      this.corriendo = false;
      this._idFrame = null;

      return;
    }

    // Dibujar con interpolación entre pasos físicos.
    this._dibujar(true);

    this._idFrame = requestAnimationFrame(this._bucle);
  }

  _dibujar(interpolar = false) {
    let t = this.tFisico;

    if (interpolar) {
      t += this._acumulador;
    }

    t = Math.min(t, this.motor.duracion());

    const posicion = this.motor.posicion(t);

    let pos;

    if (typeof posicion === 'number') {
      if (this.motor.eje === 'y') {
        pos = {
          x: 0,
          y: posicion
        };
      } else {
        pos = {
          x: posicion,
          y: 0
        };
      }
    } else {
      pos = posicion;
    }

    this.renderer.dibujarEscena(pos);

    // Comunicar el tiempo físico actual a la interfaz.
    this.alActualizar(this.tFisico);
  }
}

// Registrar Animator para utilizarlo desde main.js.
globalThis.SIMUCIN ??= {};
globalThis.SIMUCIN.Animator = Animator;
