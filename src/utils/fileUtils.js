const fs = require('fs');
const path = require('path');

// Ruta del archivo de productos
const PRODUCTS_FILE = path.join(__dirname, '../../products.json');

/**
 * Lee todos los productos del archivo JSON
 * @returns {Array} Array de productos
 */
function readProducts() {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o hay error, retorna array vacío
        console.error('Error al leer productos:', error.message);
        return [];
    }
}

/**
 * Escribe los productos en el archivo JSON
 * @param {Array} products - Array de productos a escribir
 * @returns {boolean} true si se escribió correctamente
 */
function writeProducts(products) {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error al escribir productos:', error.message);
        return false;
    }
}

/**
 * Agrega un nuevo producto al inventario
 * @param {Object} product - Objeto del producto a agregar
 * @returns {Object} Producto agregado con ID generado
 */
function addProduct(product) {
    const products = readProducts();

    // Generar ID único si no se proporciona
    const newId = product.id || Date.now();

    const newProduct = {
        id: newId,
        name: product.name,
        price: product.price,
        quantity: product.quantity
    };

    products.push(newProduct);

    if (writeProducts(products)) {
        return newProduct;
    }

    return null;
}

/**
 * Actualiza un producto existente por su ID
 * @param {number} id - ID del producto a actualizar
 * @param {Object} newData - Nuevos datos del producto
 * @returns {Object|null} Producto actualizado o null si no se encontró
 */
function updateProduct(id, newData) {
    const products = readProducts();
    const productIndex = products.findIndex(product => product.id === parseInt(id));

    if (productIndex === -1) {
        return null; // Producto no encontrado
    }

    // Actualizar solo los campos proporcionados
    const updatedProduct = {
        ...products[productIndex],
        ...newData,
        id: parseInt(id) // Mantener el ID original
    };

    products[productIndex] = updatedProduct;

    if (writeProducts(products)) {
        return updatedProduct;
    }

    return null;
}

/**
 * Elimina un producto por su ID
 * @param {number} id - ID del producto a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
function deleteProduct(id) {
    const products = readProducts();
    const productIndex = products.findIndex(product => product.id === parseInt(id));

    if (productIndex === -1) {
        return false; // Producto no encontrado
    }

    products.splice(productIndex, 1);

    return writeProducts(products);
}

/**
 * Busca un producto por su ID
 * @param {number} id - ID del producto a buscar
 * @returns {Object|null} Producto encontrado o null
 */
function getProductById(id) {
    const products = readProducts();
    return products.find(product => product.id === parseInt(id)) || null;
}

module.exports = {
    readProducts,
    writeProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
};
