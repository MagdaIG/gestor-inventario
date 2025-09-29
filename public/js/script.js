// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

// Estado global de la aplicación
let products = [];
let currentProduct = null;
let isEditing = false;

// Elementos del DOM
const elements = {
    // Botones principales
    addProductBtn: document.getElementById('addProductBtn'),
    addFirstProductBtn: document.getElementById('addFirstProductBtn'),

    // Tabla y contenido
    productsTableBody: document.getElementById('productsTableBody'),
    emptyState: document.getElementById('emptyState'),

    // Estadísticas
    totalProducts: document.getElementById('totalProducts'),
    totalValue: document.getElementById('totalValue'),
    lowStock: document.getElementById('lowStock'),

    // Búsqueda y filtros
    searchInput: document.getElementById('searchInput'),
    filterButtons: document.querySelectorAll('[data-filter]'),

    // Modales
    productModal: document.getElementById('productModal'),
    confirmModal: document.getElementById('confirmModal'),
    alertModal: document.getElementById('alertModal'),
    loadingOverlay: document.getElementById('loadingOverlay'),

    // Formulario de producto
    productForm: document.getElementById('productForm'),
    modalTitle: document.getElementById('modalTitle'),
    productName: document.getElementById('productName'),
    productPrice: document.getElementById('productPrice'),
    productQuantity: document.getElementById('productQuantity'),

    // Botones de modal
    closeModal: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    saveBtn: document.getElementById('saveBtn'),

    // Modal de confirmación
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    closeConfirmModal: document.getElementById('closeConfirmModal'),
    cancelConfirmBtn: document.getElementById('cancelConfirmBtn'),
    confirmBtn: document.getElementById('confirmBtn'),

    // Modal de alerta
    alertTitle: document.getElementById('alertTitle'),
    alertMessage: document.getElementById('alertMessage'),
    alertIcon: document.getElementById('alertIcon'),
    closeAlertModal: document.getElementById('closeAlertModal'),
    alertOkBtn: document.getElementById('alertOkBtn')
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProducts();
});

// Configurar event listeners
function setupEventListeners() {
    // Botones principales
    elements.addProductBtn.addEventListener('click', () => openProductModal());
    elements.addFirstProductBtn.addEventListener('click', () => openProductModal());

    // Formulario de producto
    elements.productForm.addEventListener('submit', handleProductSubmit);
    elements.closeModal.addEventListener('click', closeProductModal);
    elements.cancelBtn.addEventListener('click', closeProductModal);

    // Modal de confirmación
    elements.closeConfirmModal.addEventListener('click', closeConfirmModal);
    elements.cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    elements.confirmBtn.addEventListener('click', handleConfirmAction);

    // Modal de alerta
    elements.closeAlertModal.addEventListener('click', closeAlertModal);
    elements.alertOkBtn.addEventListener('click', closeAlertModal);

    // Búsqueda
    elements.searchInput.addEventListener('input', handleSearch);

    // Filtros
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => handleFilter(e.target.dataset.filter));
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Inicializar la aplicación
function initializeApp() {
    showLoading();
    updateStats();
}

// Mostrar/ocultar loading
function showLoading() {
    elements.loadingOverlay.classList.add('show');
}

function hideLoading() {
    elements.loadingOverlay.classList.remove('show');
}

// Cargar productos desde la API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (data.success) {
            products = data.data;
            renderProducts();
            updateStats();
        } else {
            showAlert('Error', 'No se pudieron cargar los productos', 'error');
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showAlert('Error', 'Error de conexión con el servidor', 'error');
    } finally {
        hideLoading();
    }
}

// Renderizar productos en la tabla
function renderProducts(filteredProducts = null) {
    const productsToRender = filteredProducts || products;

    if (productsToRender.length === 0) {
        elements.productsTableBody.innerHTML = '';
        elements.emptyState.style.display = 'block';
        return;
    }

    elements.emptyState.style.display = 'none';

    elements.productsTableBody.innerHTML = productsToRender.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <div>
                        <div class="product-name">${escapeHtml(product.name)}</div>
                        <small class="text-muted">ID: ${product.id}</small>
                    </div>
                </div>
            </td>
            <td>
                <span class="product-price">$${formatPrice(product.price)}</span>
            </td>
            <td>
                <span class="product-quantity">${product.quantity}</span>
            </td>
            <td>
                <span class="product-total">$${formatPrice(product.price * product.quantity)}</span>
            </td>
            <td>
                <span class="status-badge ${getStockStatus(product.quantity)}">
                    <i class="fas ${getStockIcon(product.quantity)}"></i>
                    ${getStockText(product.quantity)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit" onclick="editProduct(${product.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Obtener estado del stock
function getStockStatus(quantity) {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= 5) return 'low-stock';
    return 'in-stock';
}

function getStockIcon(quantity) {
    if (quantity === 0) return 'fa-times-circle';
    if (quantity <= 5) return 'fa-exclamation-triangle';
    return 'fa-check-circle';
}

function getStockText(quantity) {
    if (quantity === 0) return 'Sin Stock';
    if (quantity <= 5) return 'Stock Bajo';
    return 'En Stock';
}

// Actualizar estadísticas
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockCount = products.filter(product => product.quantity <= 5 && product.quantity > 0).length;

    elements.totalProducts.textContent = totalProducts;
    elements.totalValue.textContent = `$${formatPrice(totalValue)}`;
    elements.lowStock.textContent = lowStockCount;
}

// Formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Abrir modal de producto
function openProductModal(product = null) {
    isEditing = !!product;
    currentProduct = product;

    if (isEditing) {
        elements.modalTitle.textContent = 'Editar Producto';
        elements.productName.value = product.name;
        elements.productPrice.value = product.price;
        elements.productQuantity.value = product.quantity;
    } else {
        elements.modalTitle.textContent = 'Agregar Producto';
        elements.productForm.reset();
    }

    elements.productModal.classList.add('show');
    elements.productName.focus();
}

// Cerrar modal de producto
function closeProductModal() {
    elements.productModal.classList.remove('show');
    elements.productForm.reset();
    currentProduct = null;
    isEditing = false;
}

// Manejar envío del formulario
async function handleProductSubmit(e) {
    e.preventDefault();

    const formData = new FormData(elements.productForm);
    const productData = {
        name: formData.get('name').trim(),
        price: parseFloat(formData.get('price')),
        quantity: parseInt(formData.get('quantity'))
    };

    // Validaciones
    if (!productData.name) {
        showAlert('Error', 'El nombre del producto es requerido', 'error');
        return;
    }

    if (productData.price <= 0) {
        showAlert('Error', 'El precio debe ser mayor a 0', 'error');
        return;
    }

    if (productData.quantity < 0) {
        showAlert('Error', 'La cantidad no puede ser negativa', 'error');
        return;
    }

    showLoading();

    try {
        let response;
        if (isEditing) {
            response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }

        const data = await response.json();

        if (data.success) {
            showAlert(
                'Éxito',
                isEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
                'success'
            );
            closeProductModal();
            loadProducts();
        } else {
            showAlert('Error', data.message || 'Error al guardar el producto', 'error');
        }
    } catch (error) {
        console.error('Error al guardar producto:', error);
        showAlert('Error', 'Error de conexión con el servidor', 'error');
    } finally {
        hideLoading();
    }
}

// Editar producto
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
}

// Eliminar producto
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        elements.confirmTitle.textContent = 'Eliminar Producto';
        elements.confirmMessage.textContent = `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`;
        elements.confirmBtn.onclick = () => confirmDeleteProduct(id);
        elements.confirmModal.classList.add('show');
    }
}

// Confirmar eliminación
async function confirmDeleteProduct(id) {
    closeConfirmModal();
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Éxito', 'Producto eliminado correctamente', 'success');
            loadProducts();
        } else {
            showAlert('Error', data.message || 'Error al eliminar el producto', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showAlert('Error', 'Error de conexión con el servidor', 'error');
    } finally {
        hideLoading();
    }
}

// Manejar búsqueda
function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        renderProducts();
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.id.toString().includes(searchTerm)
    );

    renderProducts(filteredProducts);
}

// Manejar filtros
function handleFilter(filter) {
    // Actualizar botones activos
    elements.filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    let filteredProducts = products;

    switch (filter) {
        case 'low-stock':
            filteredProducts = products.filter(product => product.quantity <= 5 && product.quantity > 0);
            break;
        case 'high-value':
            filteredProducts = products.filter(product => product.price >= 1000);
            break;
        case 'all':
        default:
            filteredProducts = products;
            break;
    }

    renderProducts(filteredProducts);
}

// Mostrar alerta
function showAlert(title, message, type = 'info') {
    elements.alertTitle.textContent = title;
    elements.alertMessage.textContent = message;

    // Configurar icono según el tipo
    const iconClass = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';

    elements.alertIcon.className = `alert-icon ${type}`;
    elements.alertIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;

    elements.alertModal.classList.add('show');
}

// Cerrar modales
function closeConfirmModal() {
    elements.confirmModal.classList.remove('show');
}

function closeAlertModal() {
    elements.alertModal.classList.remove('show');
}

function closeAllModals() {
    closeProductModal();
    closeConfirmModal();
    closeAlertModal();
}

// Manejar acción de confirmación
function handleConfirmAction() {
    // Esta función se asigna dinámicamente según la acción
    if (elements.confirmBtn.onclick) {
        elements.confirmBtn.onclick();
    }
}

// Manejar errores de conexión
window.addEventListener('online', () => {
    showAlert('Conexión Restaurada', 'La conexión a internet se ha restaurado', 'success');
});

window.addEventListener('offline', () => {
    showAlert('Sin Conexión', 'No hay conexión a internet. Algunas funciones pueden no estar disponibles', 'warning');
});

// Prevenir envío de formulario con Enter en campos de búsqueda
elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

// Auto-guardar búsqueda en localStorage
elements.searchInput.addEventListener('input', () => {
    localStorage.setItem('inventorySearch', elements.searchInput.value);
});

// Restaurar búsqueda guardada
window.addEventListener('load', () => {
    const savedSearch = localStorage.getItem('inventorySearch');
    if (savedSearch) {
        elements.searchInput.value = savedSearch;
        handleSearch();
    }
});
