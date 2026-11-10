// ===== Gráficas 2D (Integrante 2) =====
// graficar2D(motor, contenedor): crea 5 canvas de Chart.js dentro del contenedor (elemento o id,
// p. ej. 'contenedor-graficas'): y(x), x(t), y(t), vx(t) y vy(t). Requiere Chart.js cargado antes.
(function (raiz) {
  const PUNTOS = 200;

  // Series muestreadas del motor en [0, duracion()]: { t, x, y, vx, vy } (arreglos). Sin DOM.
  function muestrear(motor, n = PUNTOS) {
    const T = motor.duracion();
    const s = { t: [], x: [], y: [], vx: [], vy: [] };
    for (let i = 0; i <= n; i++) {
      const t = T * i / n, p = motor.posicion(t), v = motor.velocidad(t);
      s.t.push(t); s.x.push(p.x); s.y.push(p.y); s.vx.push(v.x); s.vy.push(v.y);
    }
    return s;
  }

  // [titulo, serie en X, serie en Y, texto eje X, texto eje Y]
  const GRAFICAS_2D = [
    ['Trayectoria y(x)', 'x', 'y', 'x (m)', 'y (m)'],
    ['Posición horizontal x(t)', 't', 'x', 't (s)', 'x (m)'],
    ['Posición vertical y(t)', 't', 'y', 't (s)', 'y (m)'],
    ['Velocidad horizontal vx(t)', 't', 'vx', 't (s)', 'vx (m/s)'],
    ['Velocidad vertical vy(t)', 't', 'vy', 't (s)', 'vy (m/s)'],
  ];

  function graficar2D(motor, contenedor) {
    const el = typeof contenedor === 'string' ? document.getElementById(contenedor) : contenedor;
    el.querySelectorAll('canvas').forEach(c => Chart.getChart(c)?.destroy()); // al re-simular
    el.innerHTML = '';
    const s = muestrear(motor);
    return GRAFICAS_2D.map(([titulo, kx, ky, ejeX, ejeY]) => {
      const caja = document.createElement('div'); // Chart.js pide un contenedor propio por canvas
      caja.style.position = 'relative';
      const canvas = document.createElement('canvas');
      caja.appendChild(canvas);
      el.appendChild(caja);
      return new Chart(canvas, {
        type: 'scatter',
        data: { datasets: [{ data: s[kx].map((x, i) => ({ x, y: s[ky][i] })), showLine: true, pointRadius: 0 }] },
        options: {
          plugins: { legend: { display: false }, title: { display: true, text: titulo } },
          scales: { x: { title: { display: true, text: ejeX } }, y: { title: { display: true, text: ejeY } } },
        },
      });
    });
  }

  raiz.SIMUCIN = raiz.SIMUCIN || {};
  raiz.SIMUCIN.graficar2D = graficar2D;
  raiz.SIMUCIN.muestrear = muestrear;
  if (typeof module !== 'undefined') module.exports = { graficar2D, muestrear };
})(typeof window !== 'undefined' ? window : globalThis);
