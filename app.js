// Variables globales
let inversionistas = [];
const totalInversion = 6000; // Total de inversión inicial

// Cargar datos de los inversionistas desde el JSON
async function cargarInversionistas() {
    try {
        const response = await fetch('./db/inversionistas.json'); // Ruta al archivo JSON
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
        }
        inversionistas = await response.json();

        // Asignar valores predeterminados para los campos faltantes
        inversionistas = inversionistas.map(inversionista => ({
            ...inversionista,
            saldo: inversionista.saldo || 0,
            ganancias: inversionista.ganancias || 0,
            compras: inversionista.compras || []
        }));

        mostrarInversionistas();
        cargarSelectCompradores();
        cargarFiltroInversionistas();
        mostrarTotalInversion();
        console.log('Datos cargados correctamente:', inversionistas);
    } catch (error) {
        console.error('Error al cargar los datos de los inversionistas:', error);
        alert('No se pudieron cargar los datos de los inversionistas. Asegúrate de que el servidor esté funcionando.');
    }
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
        
        // Saldo pendiente
        const balance = investor.saldo || 0;
        const balanceElement = document.getElementById('investor-balance');
        balanceElement.textContent = balance > 0 ? `$${balance.toFixed(2)}` : 'Sin saldos pendientes';
        balanceElement.className = balance > 0 ? 'red' : 'green';

        // Ganancias
        document.getElementById('investor-earnings').textContent = `$${(investor.ganancias || 0).toFixed(2)}`;

        // Historial de compras
        const purchaseHistory = document.getElementById('purchase-history');
        purchaseHistory.innerHTML = '';
        (investor.compras || []).forEach(compra => {
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

    if (!buyerName || !productCode || isNaN(quantity)) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    alert(`Venta registrada: ${buyerName} compró ${quantity} unidades del producto ${productCode}.`);
    this.reset();
});

// Registro de entradas
document.getElementById('form-entries').addEventListener('submit', function (event) {
    event.preventDefault();

    const productCode = document.getElementById('product-code').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!productCode || isNaN(quantity)) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    alert(`Entrada registrada: ${quantity} unidades del producto ${productCode} añadidas al inventario.`);
    this.reset();
});

// Llamar a cargar inversionistas al iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarInversionistas();
});
