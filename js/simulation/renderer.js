
// simulation/renderer.js
// Dibuja la escena en Canvas: ejes, suelo, partícula y escala metros a píxeles.
// No calcula física: solo recibe posiciones en metros y las dibuja.

const Renderer = (() => {
  let canvas, ctx;
  let escala = 10;
  let origenX = 0;
  let origenY = 0;

  const margen = {
    izq: 60,
    der: 30,
    arriba: 30,
    abajo: 40
  };

  let centrarX = false;
  let ultima = null;

  // Inicia el renderer con el id del canvas.
  function iniciar(idCanvas, opciones = {}) {
    canvas = document.getElementById(idCanvas);
    ctx = canvas.getContext("2d");

    centrarX = opciones.centrarX ?? false;
    ultima = null;

    configurarEscala(
      opciones.xMax ?? 10,
      opciones.yMax ?? 10
    );
  }

  // Calcula la escala para que quepa toda la trayectoria.
  function configurarEscala(xMax, yMax) {
    const anchoUtil = canvas.width - margen.izq - margen.der;
    const altoUtil = canvas.height - margen.arriba - margen.abajo;

    const escalaX = xMax > 0 ? anchoUtil / xMax : Infinity;
    const escalaY = yMax > 0 ? altoUtil / yMax : Infinity;

    escala = Math.min(escalaX, escalaY);

    if (!isFinite(escala)) {
      escala = 10;
    }

    origenX = centrarX ? canvas.width / 2 : margen.izq;
    origenY = canvas.height - margen.abajo;
  }

  // Convierte metros a píxeles.
  // En Canvas el eje Y crece hacia abajo.
  function metrosAPixeles(x, y) {
    return {
      px: origenX + x * escala,
      py: origenY - y * escala
    };
  }

  function limpiar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function dibujarSuelo() {
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, origenY);
    ctx.lineTo(canvas.width, origenY);
    ctx.stroke();
  }

  // Evita mostrar decimales innecesarios.
  function formatear(m) {
    return Number(m.toFixed(2)).toString();
  }

  // Redondea a un paso bonito: 1, 2, 5, 10, 20, 50, 100...
  function pasoBonito(valor) {
    if (valor <= 0) return 1;

    const exp = Math.pow(10, Math.floor(Math.log10(valor)));
    const f = valor / exp;

    const base =
      f <= 1 ? 1 :
      f <= 2 ? 2 :
      f <= 5 ? 5 : 10;

    return base * exp;
  }

  function dibujarEjes() {
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#666";
    ctx.font = "12px sans-serif";

    // Eje Y.
    ctx.beginPath();
    ctx.moveTo(origenX, origenY);
    ctx.lineTo(origenX, margen.arriba);
    ctx.stroke();

    const paso = pasoBonito(40 / escala);

    // Marcas en Y.
    // Se utiliza un contador entero para evitar errores decimales.
    for (
      let i = 1;
      origenY - i * paso * escala > margen.arriba;
      i++
    ) {
      const m = i * paso;
      const py = origenY - m * escala;

      ctx.beginPath();
      ctx.moveTo(origenX - 4, py);
      ctx.lineTo(origenX + 4, py);
      ctx.stroke();

      ctx.fillText(
        formatear(m) + " m",
        origenX - 50,
        py + 4
      );
    }

    // Marcas en X (solo cuando el origen está a la izquierda).
    if (!centrarX) {
      for (
        let i = 1;
        origenX + i * paso * escala < canvas.width - margen.der;
        i++
      ) {
        const m = i * paso;
        const px = origenX + m * escala;

        ctx.beginPath();
        ctx.moveTo(px, origenY - 4);
        ctx.lineTo(px, origenY + 4);
        ctx.stroke();

        ctx.fillText(
          formatear(m) + " m",
          px - 12,
          origenY + 18
        );
      }
    }
  }

  function dibujarParticula(x, y) {
    const { px, py } = metrosAPixeles(x, y);

    // Guardar la última posición dibujada para las pruebas.
    ultima = { x, y, px, py };

    ctx.fillStyle = "#d9480f";
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dibuja un cuadro completo.
  // Acepta {x, y} o un número (solo Y).
  function dibujarEscena(pos) {
    const p = typeof pos === "number"
      ? { x: 0, y: pos }
      : pos;

    limpiar();
    dibujarSuelo();
    dibujarEjes();
    dibujarParticula(p.x, p.y);
  }

  // Devuelve la última posición dibujada.
  function ultimaPosicion() {
    return ultima;
  }

  return {
    iniciar,
    configurarEscala,
    metrosAPixeles,
    dibujarEscena,
    limpiar,
    ultimaPosicion
  };
})();

// Registrar Renderer para utilizarlo desde main.js.
globalThis.SIMUCIN ??= {};
globalThis.SIMUCIN.Renderer = Renderer;
