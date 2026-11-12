
// Gráficas con Chart.js (global `Chart`, cargado desde js/vendor).
// Se destruyen antes de recrearse: sin fugas.

let charts = [];

export function graficas(el, m) {
  charts.forEach(c => c.destroy());
  charts = [];
  el.innerHTML = '';

  const T = m.duracion();
  const e = m.eje;
  const P = t => m.posicion(t);
  const V = t => m.velocidad(t);

  const D = m.dim === 1 ? [
    [`${e}(t)`, 't (s)', `${e} (m)`, t => [t, P(t)]],
    ['v(t)', 't (s)', 'v (m/s)', t => [t, V(t)]],
    ['a(t)', 't (s)', 'a (m/s²)', t => [t, m.aceleracion(t)]]
  ] : [
    ['Trayectoria y(x)', 'x (m)', 'y (m)', t => [P(t).x, P(t).y]],
    ['x(t)', 't (s)', 'x (m)', t => [t, P(t).x]],
    ['y(t)', 't (s)', 'y (m)', t => [t, P(t).y]],
    ['vₓ(t)', 't (s)', 'vₓ (m/s)', t => [t, V(t).x]],
    ['vᵧ(t)', 't (s)', 'vᵧ (m/s)', t => [t, V(t).y]]
  ];

  const eje = tx => ({
    type: 'linear',
    title: {
      display: true,
      text: tx,
      color: '#94A3B8'
    },
    ticks: {
      color: '#94A3B8'
    },
    grid: {
      color: '#26314a'
    }
  });

  charts = D.map(([tit, xl, yl, fn]) => {
    const div = document.createElement('div');
    const cv = document.createElement('canvas');

    div.className = 'ch';
    div.append(cv);
    el.append(div);

    const datos = Array.from({ length: 201 }, (_, i) => {
      const [x, y] = fn(T * i / 200);
      return { x, y };
    });

    const ch = new Chart(cv, {
      type: 'scatter',
      data: {
        datasets: [
          {
            data: datos,
            showLine: true,
            pointRadius: 0,
            borderColor: '#38BDF8'
          },
          {
            data: [],
            pointRadius: 6,
            backgroundColor: '#22C55E'
          }
        ]
      },
      options: {
        animation: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: tit,
            color: '#F8FAFC'
          }
        },
        scales: {
          x: eje(xl),
          y: eje(yl)
        }
      }
    });

    ch.fn = fn;
    return ch;
  });

  marcar(0);
}

// Marcador del instante actual
export function marcar(t) {
  charts.forEach(c => {
    const [x, y] = c.fn(t);

    c.data.datasets[1].data = [{ x, y }];
    c.update('none');
  });
}
