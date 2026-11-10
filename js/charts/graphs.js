// ===== Gráficas 2D (Integrante 2) =====
// graficar2D(motor, contenedor): crea 5 gráficas de Chart.js dentro del contenedor (elemento o id,
// p. ej. 'contenedor-graficas'): y(x), x(t), y(t), vx(t) y vy(t). Requiere Chart.js cargado antes.
// Cada gráfica va en un <div class="grafica"> (la página decide el aspecto de la tarjeta).
// Colores por entidad (horizontal = azul, vertical = naranja, trayectoria = violeta), claro u oscuro según el SO.
(function (raiz) {
  const PUNTOS = 200;
  const FUENTE = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TEMAS = {
    claro: { fondo: '#fcfcfb', tinta: '#0b0b0b', tinta2: '#52514e', suave: '#898781', rejilla: '#e1e0d9', eje: '#c3c2b7',
             x: '#2a78d6', y: '#eb6834', tray: '#6250d6' },
    oscuro: { fondo: '#1a1a19', tinta: '#f0efec', tinta2: '#c3c2b7', suave: '#898781', rejilla: '#2c2c2a', eje: '#383835',
              x: '#3987e5', y: '#d95926', tray: '#9085e9' },
  };
  const tema = () => TEMAS[typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'];

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

  // ejes: [símbolo, unidad]; aspecto: ancho / alto de la gráfica
  const GRAFICAS_2D = [
    { titulo: 'Trayectoria y(x)', kx: 'x', ky: 'y', ejeX: ['x', 'm'], ejeY: ['y', 'm'], color: 'tray', aspecto: 2.4 },
    { titulo: 'Posición horizontal x(t)', kx: 't', ky: 'x', ejeX: ['t', 's'], ejeY: ['x', 'm'], color: 'x', aspecto: 1.7 },
    { titulo: 'Posición vertical y(t)', kx: 't', ky: 'y', ejeX: ['t', 's'], ejeY: ['y', 'm'], color: 'y', aspecto: 1.7 },
    { titulo: 'Velocidad horizontal vx(t)', kx: 't', ky: 'vx', ejeX: ['t', 's'], ejeY: ['vx', 'm/s'], color: 'x', aspecto: 1.7 },
    { titulo: 'Velocidad vertical vy(t)', kx: 't', ky: 'vy', ejeX: ['t', 's'], ejeY: ['vy', 'm/s'], color: 'y', aspecto: 1.7 },
  ];

  function graficar2D(motor, contenedor) {
    const el = typeof contenedor === 'string' ? document.getElementById(contenedor) : contenedor;
    el.querySelectorAll('canvas').forEach(c => Chart.getChart(c)?.destroy()); // al re-simular
    el.innerHTML = '';
    const s = muestrear(motor), t = tema();
    const fuente = { family: FUENTE, size: 12 };
    const eje = ([simbolo, unidad]) => ({
      beginAtZero: true,
      title: { display: true, text: `${simbolo} (${unidad})`, color: t.tinta2, font: fuente },
      grid: { color: t.rejilla, lineWidth: 1 },
      border: { color: t.eje },
      ticks: { color: t.suave, font: fuente },
    });

    // Primero toda la estructura y luego las gráficas, para que Chart.js mida con el diseño ya final.
    const lienzos = GRAFICAS_2D.map(g => {
      const caja = document.createElement('div'); // Chart.js pide un contenedor propio por canvas
      caja.className = 'grafica';
      caja.style.position = 'relative';
      const canvas = document.createElement('canvas');
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', g.titulo);
      caja.appendChild(canvas);
      el.appendChild(caja);
      return canvas;
    });

    return GRAFICAS_2D.map((g, k) => {
      const canvas = lienzos[k];
      const aspecto = canvas.parentNode?.clientWidth < 420 ? 1.25 : g.aspecto; // tarjeta angosta (teléfono): menos alargada
      const datos = s[g.kx].map((x, i) => ({ x, y: s[g.ky][i] }));
      const color = t[g.color], extremo = i => i === 0 || i === datos.length - 1; // puntos de salida y de llegada
      return new Chart(canvas, {
        type: 'scatter',
        data: { datasets: [{
          data: datos, showLine: true, fill: 'origin',
          borderColor: color, backgroundColor: color + '1a', borderWidth: 2, borderJoinStyle: 'round', borderCapStyle: 'round',
          pointRadius: c => (extremo(c.dataIndex) ? 4 : 0), pointHoverRadius: 5,
          pointBackgroundColor: color, pointBorderColor: t.fondo, pointBorderWidth: 2,
        }] },
        options: {
          aspectRatio: aspecto,
          interaction: { mode: 'nearest', axis: 'x', intersect: false },
          plugins: {
            legend: { display: false },
            title: { display: true, text: g.titulo, align: 'start', color: t.tinta, font: { family: FUENTE, size: 14, weight: '600' }, padding: { bottom: 12 } },
            tooltip: {
              displayColors: false, backgroundColor: t.fondo, borderColor: t.eje, borderWidth: 1, padding: 10, cornerRadius: 8,
              titleColor: t.tinta, bodyColor: t.tinta2, titleFont: fuente, bodyFont: fuente,
              callbacks: {
                title: it => `${g.ejeX[0]} = ${it[0].parsed.x.toFixed(3)} ${g.ejeX[1]}`,
                label: it => `${g.ejeY[0]} = ${it.parsed.y.toFixed(3)} ${g.ejeY[1]}`,
              },
            },
          },
          scales: { x: eje(g.ejeX), y: eje(g.ejeY) },
        },
      });
    });
  }

  raiz.SIMUCIN = raiz.SIMUCIN || {};
  raiz.SIMUCIN.graficar2D = graficar2D;
  raiz.SIMUCIN.muestrear = muestrear;
  if (typeof module !== 'undefined') module.exports = { graficar2D, muestrear };
})(typeof window !== 'undefined' ? window : globalThis);
