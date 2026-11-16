document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('listaHistorial');

    fetch('http://localhost:3000/api/historial')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                lista.innerHTML = `<p class="mensaje-estado mensaje-error">Error al cargar el historial.</p>`;
                return;
            }

            if (data.length === 0) {
                lista.innerHTML = `<p class="mensaje-estado">No hay listas guardadas todavía.</p>`;
                return;
            }

            lista.innerHTML = '';

            data.forEach(item => {
                const fecha = new Date(item.fecha);
                const dia = fecha.toLocaleDateString('es-ES', { day: 'numeric' });
                const mes = fecha.toLocaleDateString('es-ES', { month: 'long' });
                const anio = fecha.toLocaleDateString('es-ES', { year: 'numeric' });

                const li = document.createElement('li');

                const info = document.createElement('div');
                info.innerHTML = `
                    <span class="registro-fecha">
                        ${dia} de ${mes} <span class="registro-anio">(${anio})</span>
                    </span>
                    <span class="registro-id">ID Registro: #${item.id}</span>
                `;

                const total = document.createElement('span');
                total.className = 'registro-total';
                total.textContent = `$${parseFloat(item.total_general).toFixed(2)}`;

                li.appendChild(info);
                li.appendChild(total);
                lista.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Error:', err);
            lista.innerHTML = `<p class="mensaje-estado mensaje-error">No se pudo conectar con el servidor.</p>`;
        });
});