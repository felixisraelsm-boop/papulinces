const texto = document.getElementById('nombreInput');
const boton = document.getElementById('agregarBtn');
const lista = document.getElementById('listaNombres');
const total = document.getElementById('totalGeneral');
const guardarBtn = document.getElementById('guardarListaBtn'); // Referencia al botón

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

    const label = document.createElement('label');
    label.className = 'cr-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const crInput = document.createElement('div');
    crInput.className = 'cr-input';

    const spanNombre = document.createElement('span');
    spanNombre.textContent = val;

    label.appendChild(checkbox);
    label.appendChild(crInput);
    label.appendChild(spanNombre);

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

    li.appendChild(label);
    li.appendChild(div);
    lista.appendChild(li);

    texto.value = "";
    texto.focus();
}

// Función para enviar el total a Node.js y XAMPP
function guardarListaEnDB() {
    const itemsLi = lista.querySelectorAll('li');

    if (itemsLi.length === 0) {
        alert("La lista está vacía, agrega al menos un producto.");
        return;
    }

    const totalTexto = total.textContent.replace('$', '').trim();
    const totalGeneralNum = parseFloat(totalTexto) || 0;

    fetch('http://localhost:3000/api/guardar-lista', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            totalGeneral: totalGeneralNum
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Hubo un error al guardar: " + data.error);
        } else {
            alert("¡Total de la lista guardado en el historial con su fecha!");
            lista.innerHTML = ''; 
            sumarTotal(); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("No se pudo conectar con el servidor. Revisa si Node.js está encendido.");
    });
}

boton.addEventListener('click', agregar);

texto.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        agregar();
    }
});

// ¡Vinculamos el clic del botón aquí!
if (guardarBtn) {
    guardarBtn.addEventListener('click', guardarListaEnDB);
}