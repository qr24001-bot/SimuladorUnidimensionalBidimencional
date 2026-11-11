// simulation/renderer.js
// Dibuja la escena en Canvas: ejes, suelo, partícula y escala metros → píxeles.
// No calcula física: solo recibe posiciones en metros y las dibuja.

const Renderer = (() => {
  let canvas, ctx;
  let escala = 10;            // píxeles por metro
  let origenX = 0;            // posición en px del (0, 0) físico
  let origenY = 0;
  const margen = { izq: 60, der: 30, arriba: 30, abajo: 40 };
  let centrarX = false;       // true para movimientos verticales (1D)
  let ultima = null;          // última posición dibujada (para las pruebas)

  // Inicia el renderer con el id del <canvas>.
  function iniciar(idCanvas, opciones = {}) {
    canvas = document.getElementById(idCanvas);
    ctx = canvas.getContext("2d");
    centrarX = opciones.centrarX ?? false;
    configurarEscala(opciones.xMax ?? 10, opciones.yMax ?? 10);
  }

  // Calcula la escala para que quepa toda la trayectoria.
  // xMax y yMax son las distancias máximas en metros que se van a dibujar.
  function configurarEscala(xMax, yMax) {
    const anchoUtil = canvas.width - margen.izq - margen.der;
    const altoUtil = canvas.height - margen.arriba - margen.abajo;

    const escalaX = xMax > 0 ? anchoUtil / xMax : Infinity;
    const escalaY = yMax > 0 ? altoUtil / yMax : Infinity;
    escala = Math.min(escalaX, escalaY);
    if (!isFinite(escala)) escala = 10;

    origenX = centrarX ? canvas.width / 2 : margen.izq;
    origenY = canvas.height - margen.abajo;
  }

  // Escala dinámica: muestrea el motor y calcula la escala sola.
  // Funciona con cualquier motor, sin que nadie tenga que dar el alcance.
  function ajustarEscalaAlMotor(motor, muestras = 200) {
    let xMax = 0, yMax = 0;
    for (let i = 0; i <= muestras; i++) {
      const t = (motor.tiempoTotal * i) / muestras;
      const p = normalizar(motor.posicion(t));
      xMax = Math.max(xMax, Math.abs(p.x));
      yMax = Math.max(yMax, p.y);
    }
    configurarEscala(xMax * 1.05, yMax * 1.05);   // 5 % de aire en los bordes
  }

  // Acepta un número (solo Y) o {x, y}. Limpia el ruido de redondeo (-1e-13 → 0).
  function normalizar(pos) {
    const p = typeof pos === "number" ? { x: 0, y: pos } : { x: pos.x, y: pos.y };
    if (Math.abs(p.x) < 1e-9) p.x = 0;
    if (Math.abs(p.y) < 1e-9) p.y = 0;
    return p;
  }

  // Convierte metros a píxeles (invierte Y porque en Canvas crece hacia abajo).
  function metrosAPixeles(x, y) {
    return {
      px: origenX + x * escala,
      py: origenY - y * escala,
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

  // Número sin decimales raros: 0.6000000000000001 → "0.6"
  function formatear(m) {
    return Number(m.toFixed(2)).toString();
  }

  // Redondea a un paso "bonito": 1, 2, 5, 10, 20, 50, 100...
  function pasoBonito(valor) {
    if (valor <= 0) return 1;
    const exp = Math.pow(10, Math.floor(Math.log10(valor)));
    const f = valor / exp;
    const base = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return base * exp;
  }

  function dibujarEjes() {
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#666";
    ctx.font = "12px sans-serif";

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(origenX, origenY);
    ctx.lineTo(origenX, margen.arriba);
    ctx.stroke();

    const paso = pasoBonito(40 / escala);   // una marca cada ~40 px

    // Marcas en Y (contador entero: evita acumular error de decimales)
    for (let i = 1; origenY - i * paso * escala > margen.arriba; i++) {
      const m = i * paso;
      const py = origenY - m * escala;
      ctx.beginPath();
      ctx.moveTo(origenX - 4, py);
      ctx.lineTo(origenX + 4, py);
      ctx.stroke();
      ctx.fillText(formatear(m) + " m", origenX - 50, py + 4);
    }

    // Marcas en X (solo si el origen está a la izquierda)
    if (!centrarX) {
      for (let i = 1; origenX + i * paso * escala < canvas.width - margen.der; i++) {
        const m = i * paso;
        const px = origenX + m * escala;
        ctx.beginPath();
        ctx.moveTo(px, origenY - 4);
        ctx.lineTo(px, origenY + 4);
        ctx.stroke();
        ctx.fillText(formatear(m) + " m", px - 12, origenY + 18);
      }
    }
  }

  function dibujarParticula(x, y) {
    const { px, py } = metrosAPixeles(x, y);
    ultima = { x, y, px, py };
    ctx.fillStyle = "#d9480f";
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dibuja un cuadro completo. "pos" puede ser {x, y} o un número (solo Y).
  function dibujarEscena(pos) {
    const p = normalizar(pos);
    limpiar();
    dibujarSuelo();
    dibujarEjes();
    dibujarParticula(p.x, p.y);
  }

  const ultimaPosicion = () => ultima;

  return {
    iniciar,
    configurarEscala,
    ajustarEscalaAlMotor,
    metrosAPixeles,
    dibujarEscena,
    limpiar,
    ultimaPosicion,
  };
})();
