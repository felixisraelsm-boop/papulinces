const texto = document.getElementById('nombreInput');
const boton = document.getElementById('agregarBtn');
const lista = document.getElementById('listaNombres');
const total = document.getElementById('totalGeneral');

function sumarTotal() {
    let suma = 0;
    const subs = document.querySelectorAll('.subtotal-texto');
    
    subs.forEach(sub => {
        suma += parseFloat(sub.getAttribute('data-valor')) || 0;
    });

    total.textContent = `$${suma.toFixed(2)}`;
}

function agregar() {
    const val = texto.value.trim();

    if (val === "") {
        alert("Escribe un artículo.");
        texto.focus();
        return;
    }

    const li = document.createElement('li');

    // Creamos la estructura del checkbox personalizado (cr-wrapper)
    const label = document.createElement('label');
    label.className = 'cr-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const crInput = document.createElement('div');
    crInput.className = 'cr-input';

    const spanNombre = document.createElement('span');
    spanNombre.textContent = val;

    // Juntamos el checkbox dentro del label
    label.appendChild(checkbox);
    label.appendChild(crInput);
    label.appendChild(spanNombre);

    // Contenedor derecho para los números y el botón
    const div = document.createElement('div');
    div.className = 'controles-derecha';

    const cant = document.createElement('input');
    cant.type = 'number';
    cant.className = 'input-cant';
    cant.step = 'any';
    cant.min = '0';
    cant.value = '1';

    const precio = document.createElement('input');
    precio.type = 'number';
    precio.className = 'input-precio';
    precio.step = '0.01';
    precio.min = '0';
    precio.placeholder = 'Precio';

    const sub = document.createElement('span');
    sub.className = 'subtotal-texto';
    sub.setAttribute('data-valor', '0');
    sub.textContent = '$0.00';

    const eliminar = document.createElement('button');
    eliminar.className = 'btn-eliminar';
    eliminar.textContent = '✕';
    eliminar.onclick = function() {
        lista.removeChild(li);
        sumarTotal();
    };

    function calcular() {
        const c = parseFloat(cant.value) || 0;
        const p = parseFloat(precio.value) || 0;
        const s = c * p;

        sub.setAttribute('data-valor', s);
        sub.textContent = `$${s.toFixed(2)}`;
        
        sumarTotal();
    }

    cant.addEventListener('input', calcular);
    precio.addEventListener('input', calcular);

    div.appendChild(cant);
    div.appendChild(precio);
    div.appendChild(sub);
    div.appendChild(eliminar);

    // Metemos el checkbox y los controles al renglón
    li.appendChild(label);
    li.appendChild(div);

    lista.appendChild(li);

    texto.value = "";
    texto.focus();
}

boton.addEventListener('click', agregar);

texto.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        agregar();
    }
});