// Variables globales
let inversionistas = [];
let compras = []; // Lista para registrar las compras
const totalInversion = 6000; // Total de inversión inicial

// Cargar datos de los inversionistas desde el JSON
async function cargarInversionistas() {
    try {
        const response = await fetch('./db/inversionistas.json'); // Ruta al archivo JSON
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
        }
        inversionistas = await response.json();
        mostrarInversionistas();
        cargarSelectCompradores();
        cargarFiltroInversionistas();
        mostrarTotalInversion();
        console.log('Datos de inversionistas cargados:', inversionistas);
    } catch (error) {
        console.error('Error al cargar los datos de los inversionistas:', error);
        alert('No se pudieron cargar los datos de los inversionistas. Asegúrate de que el servidor esté funcionando.');
    }
}

// Registrar una nueva compra
function registrarCompra(buyerName, productCode, quantity, price) {
    const compra = {
        comprador: buyerName,
        producto: productCode,
        cantidad: quantity,
        precio: price,
        total: quantity * price
    };

    compras.push(compra);
    console.log('Compra registrada:', compra);

    // Actualizar la interfaz y mostrar un mensaje
    alert(`Compra registrada: ${buyerName} compró ${quantity} unidades del producto ${productCode} por $${compra.total.toFixed(2)}.`);
}

// Exportar las compras registradas a un archivo JSON
function exportarCompras() {
    const comprasJson = JSON.stringify(compras, null, 2); // Convertir compras a formato JSON
    const blob = new Blob([comprasJson], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'compras.json';
    link.click();
}

// Mostrar los inversionistas en la tabla
function mostrarInversionistas() {
    const investorList = document.getElementById('investor-list');
    investorList.innerHTML = '';

    inversionistas.forEach(inversionista => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="./fotos/${inversionista.nombre}.jpg" alt="Foto de ${inversionista.nombre}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
            </td>
            <td>${inversionista.nombre}</td>
            <td>$${inversionista.inversion.toFixed(2)}</td>
        `;
        investorList.appendChild(row);
    });
}

// Mostrar el total de inversión en la interfaz
function mostrarTotalInversion() {
    const totalInvestmentElement = document.getElementById('total-investment');
    totalInvestmentElement.textContent = `$${totalInversion.toFixed(2)}`;
}

// Cargar los nombres de los inversionistas en el select para ventas
function cargarSelectCompradores() {
    const select = document.getElementById('buyer-name');
    select.innerHTML = '<option value="">Selecciona un comprador</option>';
    inversionistas.forEach(inversionista => {
        const option = document.createElement('option');
        option.value = inversionista.nombre;
        option.textContent = inversionista.nombre;
        select.appendChild(option);
    });
}

// Cargar los nombres de los inversionistas en el filtro de consulta
function cargarFiltroInversionistas() {
    const filter = document.getElementById('investor-filter');
    filter.innerHTML = '<option value="">Selecciona un usuario</option>';
    inversionistas.forEach(inversionista => {
        const option = document.createElement('option');
        option.value = inversionista.nombre;
        option.textContent = inversionista.nombre;
        filter.appendChild(option);
    });
}

// Filtrar información del inversionista seleccionado
function filtrarInversionista() {
    const select = document.getElementById('investor-filter');
    const investorInfo = document.getElementById('investor-info');
    const selectedName = select.value;

    if (!selectedName) {
        investorInfo.style.display = 'none';
        return;
    }

    const investor = inversionistas.find(inv => inv.nombre === selectedName);

    if (investor) {
        document.getElementById('investor-name').textContent = investor.nombre;
        document.getElementById('investor-photo').src = `./fotos/${investor.nombre}.jpg`;
        document.getElementById('investor-investment').textContent = `$${investor.inversion.toFixed(2)}`;
        
        // Mostrar saldo pendiente como ejemplo (puedes ampliar esto según tu lógica)
        const balanceElement = document.getElementById('investor-balance');
        balanceElement.textContent = 'Sin saldos pendientes';
        balanceElement.className = 'green';

        // Mostrar ganancias como ejemplo
        document.getElementById('investor-earnings').textContent = '$0.00';

        // Historial de compras del inversionista
        const purchaseHistory = document.getElementById('purchase-history');
        purchaseHistory.innerHTML = '';
        compras
            .filter(compra => compra.comprador === investor.nombre)
            .forEach(compra => {
                const li = document.createElement('li');
                li.textContent = `${compra.producto} - ${compra.cantidad} x $${compra.precio.toFixed(2)}`;
                purchaseHistory.appendChild(li);
            });

        investorInfo.style.display = 'block';
    } else {
        investorInfo.style.display = 'none';
    }
}

// Función para mostrar una sección y ocultar el menú principal
function showSection(sectionId) {
    const sections = document.querySelectorAll('main');
    const menu = document.getElementById('main-menu');
    menu.style.display = 'none'; // Ocultar el menú principal

    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('show');
            section.classList.remove('hide');
        } else {
            section.classList.add('hide');
            setTimeout(() => section.classList.remove('show'), 300); // Retira la visibilidad después de la animación
        }
    });
}

// Mostrar el menú principal y ocultar las otras secciones
function showMenu() {
    const sections = document.querySelectorAll('main');
    const menu = document.getElementById('main-menu');
    menu.style.display = 'flex'; // Mostrar el menú principal

    sections.forEach(section => {
        section.classList.add('hide');
        setTimeout(() => section.classList.remove('show'), 300); // Oculta después de la animación
    });
}

// Registro de ventas
document.getElementById('form-sales').addEventListener('submit', function (event) {
    event.preventDefault();

    const buyerName = document.getElementById('buyer-name').value;
    const productCode = document.getElementById('product-code').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = 10; // Ejemplo: Precio fijo de cada producto

    if (!buyerName || !productCode || isNaN(quantity)) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    registrarCompra(buyerName, productCode, quantity, price);
    this.reset();
});

// Llamar a cargar inversionistas al iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarInversionistas();
});
