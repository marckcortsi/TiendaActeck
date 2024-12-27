// Variables globales
let inversionistas = [];
const totalInversion = 6000; // Total de inversión inicial

// Cargar datos de los inversionistas desde el JSON
async function cargarInversionistas() {
    try {
        const response = await fetch('./db/inversionistas.json'); // Ruta al archivo JSON
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        inversionistas = await response.json();
        mostrarInversionistas();
        cargarSelectCompradores();
        mostrarTotalInversion();
        console.log('Datos cargados correctamente:', inversionistas);
    } catch (error) {
        console.error('Error al cargar los datos de los inversionistas:', error);
        alert('No se pudieron cargar los datos de los inversionistas. Verifica la configuración.');
    }
}

// Mostrar los inversionistas en la tabla
function mostrarInversionistas() {
    const investorList = document.getElementById('investor-list');
    investorList.innerHTML = '';

    inversionistas.forEach(inversionista => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${inversionista.nombre}</td>
            <td>$${inversionista.inversion.toFixed(2)}</td>
            <td>-</td> <!-- Historial de Compras -->
            <td>-</td> <!-- Ganancias -->
        `;
        investorList.appendChild(row);
    });
}

// Mostrar el total de inversión en la interfaz
function mostrarTotalInversion() {
    const totalInvestmentElement = document.getElementById('total-investment');
    totalInvestmentElement.textContent = `$${totalInversion.toFixed(2)}`;
}

// Cargar los nombres de los inversionistas en el select
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

// Funciones para manejar secciones
function showSection(sectionId) {
    const sections = document.querySelectorAll('main');
    const menu = document.getElementById('main-menu');
    sections.forEach(section => (section.style.display = 'none'));
    menu.style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

function showMenu() {
    const sections = document.querySelectorAll('main');
    const menu = document.getElementById('main-menu');
    sections.forEach(section => (section.style.display = 'none'));
    menu.style.display = 'flex';
}

// Registro de ventas
document.getElementById('form-sales').addEventListener('submit', function (event) {
    event.preventDefault();

    const buyerName = document.getElementById('buyer-name').value;
    const productCode = document.getElementById('product-code').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!buyerName || !productCode || isNaN(quantity)) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    alert(`Venta registrada: ${buyerName} compró ${quantity} unidades del producto ${productCode}.`);
    this.reset();
});

// Llamar a cargar inversionistas al iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarInversionistas();
});
