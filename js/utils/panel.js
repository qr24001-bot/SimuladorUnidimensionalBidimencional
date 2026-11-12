
import { CAMPOS_POR_MOVIMIENTO, DECIMALES, UNIDADES, NOMBRES_MOVIMIENTO } from './constantes.js';
import { ETIQUETAS } from './validation.js';

const formato = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: DECIMALES,
  maximumFractionDigits: DECIMALES,
  useGrouping: false
});

// Muestra un número con tres decimales y coma.
export function formatear(valor) {
  if (typeof valor !== 'number') return String(valor);
  if (!Number.isFinite(valor)) return '—';

  const redondeado = Number(valor.toFixed(DECIMALES));
  return formato.format(redondeado === 0 ? 0 : redondeado);
}

function crear(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);

  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;

  return nodo;
}

// Recibe una lista de { etiqueta, valor, unidad } y llena la tabla.
export function mostrarResultados(lista) {
  const cuerpo = document.querySelector('#tabla-resultados tbody');
  cuerpo.replaceChildren();

  if (!lista || lista.length === 0) {
    const fila = crear('tr');
    const celda = crear('td', 'vacio', 'No hay resultados para mostrar.');

    celda.colSpan = 3;
    fila.appendChild(celda);
    cuerpo.appendChild(fila);
    return;
  }

  lista.forEach(({ etiqueta, valor, unidad }) => {
    const fila = crear('tr');

    fila.append(
      crear('td', '', etiqueta),
      crear('td', '', formatear(valor)),
      crear('td', '', unidad ?? '')
    );

    cuerpo.appendChild(fila);
  });
}

// Recibe el movimiento, los datos validados y las ecuaciones.
export function mostrarEcuaciones(movimiento, datos, ecuaciones) {
  const panel = document.getElementById('panel-ecuaciones');
  panel.replaceChildren();

  panel.appendChild(
    crear('h3', '', NOMBRES_MOVIMIENTO[movimiento] ?? movimiento)
  );

  panel.appendChild(crear('h4', '', 'Datos iniciales'));

  const listaDatos = crear('ul', 'lista-datos');

  (CAMPOS_POR_MOVIMIENTO[movimiento] ?? []).forEach(clave => {
    if (!(clave in datos)) return;

    listaDatos.appendChild(
      crear(
        'li',
        '',
        `${ETIQUETAS[clave]} = ${formatear(datos[clave])} ${UNIDADES[clave]}`
      )
    );
  });

  panel.appendChild(listaDatos);

  panel.appendChild(crear('h4', '', 'Sistema de referencia'));

  const referencia = crear('ul', 'lista-datos');

  [
    'Eje X positivo hacia la derecha.',
    'Eje Y positivo hacia arriba.',
    'El suelo está en y = 0.'
  ].forEach(texto => {
    referencia.appendChild(crear('li', '', texto));
  });

  panel.appendChild(referencia);

  panel.appendChild(crear('h4', '', 'Desarrollo'));

  if (!ecuaciones || ecuaciones.length === 0) {
    panel.appendChild(
      crear('p', 'vacio', 'No hay ecuaciones para mostrar.')
    );
    return;
  }

  ecuaciones.forEach(({ ecuacion, sustitucion, resultado }) => {
    const paso = crear('div', 'paso');

    [
      ['Ecuación', ecuacion],
      ['Sustitución', sustitucion],
      ['Resultado', resultado]
    ].forEach(([nombre, texto]) => {
      const linea = crear('p', 'linea-paso');

      linea.append(
        crear('span', 'nombre-paso', nombre),
        crear('code', 'texto-paso', texto)
      );

      paso.appendChild(linea);
    });

    panel.appendChild(paso);
  });
}
