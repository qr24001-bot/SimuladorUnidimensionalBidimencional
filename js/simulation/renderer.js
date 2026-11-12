
// simulation/renderer.js
// Dibuja la escena en Canvas: ejes, suelo, partícula y escala.
// No calcula física: recibe posiciones en metros y las dibuja.

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

    if (!canvas) {
      throw new Error(`No se encontró el canvas: ${idCanvas}`);
    }

    ctx = canvas.getContext("2d");

    centrarX = opciones.centrarX ?? false;
    ultima = null;

    configurarEscala(opciones);
  }

  // Calcula la escala usando los límites reales.
  function configurarEscala(opciones = {}, yMaxAnterior) {
    if (typeof opciones === "number") {
      opciones = {
        xMin: 0,
        xMax: opciones,
        yMin: 0,
        yMax: yMaxAnterior ?? 10
      };
    }

    const xMin = Math.min(0, opciones.xMin ?? 0);
    const xMax = Math.max(0, opciones.xMax ?? 10);
    const yMin = Math.min(0, opciones.yMin ?? 0);
    const yMax = Math.max(0, opciones.yMax ?? 10);

    if (centrarX && xMin === 0 && xMax === 0) {
      // Se conserva espacio a ambos lados del eje Y.
      origenX = canvas.width / 2;
    }

    const anchoUtil = canvas.width - margen.izq - margen.der;
    const altoUtil = canvas.height - margen.arriba - margen.abajo;

    const rangoX = xMax - xMin;
    const rangoY = yMax - yMin;

    const escalaX = rangoX > 0 ? anchoUtil / rangoX : Infinity;
    const escalaY = rangoY > 0 ? altoUtil / rangoY : Infinity;

    escala = Math.min(escalaX, escalaY);

    if (!Number.isFinite(escala) || escala <= 0) {
      escala = 10;
    }

    if (!(centrarX && xMin === 0 && xMax === 0)) {
      origenX = margen.izq - xMin * escala;
    }

    origenY = margen.arriba + yMax * escala;
  }

  // Convierte metros a píxeles.
  function metrosAPixeles(x, y) {
    const px = origenX + x * escala;
    const py = origenY - y * escala;

    // Se conservan ambos formatos para compatibilidad.
    return {
      x: px,
      y: py,
      px,
      py
    };
  }

  function limpiar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function dibujarSuelo() {
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(margen.izq, origenY);
    ctx.lineTo(canvas.width - margen.der, origenY);
    ctx.stroke();
  }

  function formatear(m) {
    return Number(m.toFixed(2)).toString();
  }

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

    ctx.beginPath();
    ctx.moveTo(origenX, margen.arriba);
    ctx.lineTo(origenX, canvas.height - margen.abajo);
    ctx.stroke();

    const paso = pasoBonito(40 / escala);

    for (const signo of [1, -1]) {
      for (let i = 1; i <= 100; i++) {
        const m = signo * i * paso;
        const py = origenY - m * escala;

        if (
          py <= margen.arriba ||
          py >= canvas.height - margen.abajo
        ) {
          break;
        }

        ctx.beginPath();
        ctx.moveTo(origenX - 4, py);
        ctx.lineTo(origenX + 4, py);
        ctx.stroke();

        ctx.fillText(
          formatear(m) + " m",
          origenX - 52,
          py + 4
        );
      }
    }

    for (const signo of [1, -1]) {
      for (let i = 1; i <= 100; i++) {
        const m = signo * i * paso;
        const px = origenX + m * escala;

        if (
          px <= margen.izq ||
          px >= canvas.width - margen.der
        ) {
          break;
        }

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
    const pixel = metrosAPixeles(x, y);

    ultima = {
      x,
      y,
      px: pixel.px,
      py: pixel.py
    };

    ctx.fillStyle = "#d9480f";
    ctx.beginPath();
    ctx.arc(pixel.px, pixel.py, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Acepta dibujarEscena(x, y), {x, y} o un número.
  function dibujarEscena(pos, y) {
    let p;

    if (typeof pos === "number" && typeof y === "number") {
      p = { x: pos, y };
    } else if (typeof pos === "number") {
      p = { x: 0, y: pos };
    } else {
      p = pos;
    }

    limpiar();
    dibujarSuelo();
    dibujarEjes();
    dibujarParticula(p.x, p.y);
  }

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
