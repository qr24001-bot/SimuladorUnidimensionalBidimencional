// tests/pruebas-animacion.js  (Integrante 3 — sección animación)
// Comprueba que la posición DIBUJADA coincide con motor.posicion(t)
// en t = 0, t = mitad y t = final.
//
// Cada prueba hace tres comprobaciones:
//   1. La posición que el renderer dice haber dibujado (en metros) = posicion(t).
//   2. Los píxeles donde la dibujó = metrosAPixeles(posicion(t)).
//   3. El canvas realmente tiene el color de la partícula en ese píxel.

const TOLERANCIA = 1e-9;
const COLOR_PARTICULA = [217, 72, 15];   // #d9480f, el color de dibujarParticula

function aPos(p) {
  return typeof p === "number" ? { x: 0, y: p } : p;
}

function colorEnPixel(canvas, px, py) {
  const d = canvas.getContext("2d").getImageData(Math.round(px), Math.round(py), 1, 1).data;
  return [d[0], d[1], d[2]];
}

function pruebasAnimacion(motoresDePrueba, idCanvas, mostrar) {
  const canvas = document.getElementById(idCanvas);
  const resultados = [];

  function registrar(ok, nombre, detalle) {
    resultados.push({ ok, nombre, detalle });
    mostrar(ok, nombre, detalle);
  }

  motoresDePrueba.forEach(({ nombre, motor, es2D }) => {
    // Escala: se calcula con el recorrido real del motor.
    let xMax = 0, yMax = 0;
    for (let i = 0; i <= 200; i++) {
      const p = aPos(motor.posicion((motor.tiempoTotal * i) / 200));
      xMax = Math.max(xMax, Math.abs(p.x));
      yMax = Math.max(yMax, p.y);
    }
    Renderer.iniciar(idCanvas, { centrarX: !es2D, xMax: xMax * 1.05, yMax: yMax * 1.05 });
    const animador = new Animator(motor, Renderer);

    [
      ["inicio", 0],
      ["mitad", motor.tiempoTotal / 2],
      ["final", motor.tiempoTotal],
    ].forEach(([etiqueta, t]) => {
      const id = `${nombre} · ${etiqueta} (t = ${t.toFixed(3)} s)`;

      animador.tFisico = t;
      animador._acumulador = 0;
      animador._dibujar();

      const esperado = aPos(motor.posicion(t));
      const dibujado = Renderer.ultimaPosicion();

      // 1. Posición en metros
      const okMetros =
        Math.abs(dibujado.x - esperado.x) < TOLERANCIA &&
        Math.abs(dibujado.y - esperado.y) < TOLERANCIA;
      registrar(
        okMetros,
        id + " — metros",
        `esperado (${esperado.x.toFixed(3)}, ${esperado.y.toFixed(3)}) ` +
          `dibujado (${dibujado.x.toFixed(3)}, ${dibujado.y.toFixed(3)})`
      );

      // 2. Posición en píxeles
      const px = Renderer.metrosAPixeles(esperado.x, esperado.y);
      const okPixeles =
        Math.abs(dibujado.px - px.px) < TOLERANCIA &&
        Math.abs(dibujado.py - px.py) < TOLERANCIA;
      registrar(
        okPixeles,
        id + " — píxeles",
        `esperado (${px.px.toFixed(1)}, ${px.py.toFixed(1)}) ` +
          `dibujado (${dibujado.px.toFixed(1)}, ${dibujado.py.toFixed(1)})`
      );

      // 3. Color real en el canvas
      const color = colorEnPixel(canvas, px.px, px.py);
      const okColor = color.every((v, i) => Math.abs(v - COLOR_PARTICULA[i]) <= 3);
      registrar(okColor, id + " — pixel del canvas", `color leído rgb(${color.join(", ")})`);
    });
  });

  const fallas = resultados.filter((r) => !r.ok).length;
  return { total: resultados.length, fallas };
}
