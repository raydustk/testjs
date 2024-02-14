let chartInstance = null;

document.addEventListener('DOMContentLoaded', function () {
    const btnConvertir = document.getElementById('btnConvertir');
    btnConvertir.addEventListener('click', convertirMoneda);
});

async function convertirMoneda(event) {
    event.preventDefault();
    try {
        const cantidadPesos = document.getElementById('cantidadPesos').value;
        const monedaSeleccionada = document.getElementById('monedaSeleccionada').value;
        const url = `https://mindicador.cl/api/${monedaSeleccionada}`;
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
        const datos = await respuesta.json();
        const valorMoneda = datos.serie[0].valor;
        const resultado = (cantidadPesos / valorMoneda).toFixed(2);
        document.getElementById('resultadoConversion').textContent = `Resultado: ${monedaSeleccionada === 'dolar' ? '$' : '€'}${resultado}`;
        mostrarHistorial(datos.serie);
    } catch (error) {
        document.getElementById('mensajeError').textContent = `Error al realizar la conversión: ${error.message}`;
    }
}

function mostrarHistorial(datosHistoricos) {
    const ctx = document.getElementById('historialConversion').getContext('2d');
    if (chartInstance) {
        chartInstance.destroy();
    }
    const fechas = datosHistoricos.slice(0, 10).map(d => d.fecha.substr(0, 10));
    const valores = datosHistoricos.slice(0, 10).map(d => d.valor);
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas.reverse(),
            datasets: [{
                label: 'Historial últimos 10 días',
                data: valores.reverse(),
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
