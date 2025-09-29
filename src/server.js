const express = require('express');
const path = require('path');
const {
    readProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
} = require('./utils/fileUtils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static('../public'));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta raíz - servir la interfaz web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta de información de la API
app.get('/api', (req, res) => {
    res.json({
        message: 'Sistema de Gestión de Inventarios - API',
        version: '1.0.0',
        endpoints: {
            'GET /products': 'Obtener todos los productos',
            'POST /products': 'Crear un nuevo producto',
            'PUT /products/:id': 'Actualizar un producto',
            'DELETE /products/:id': 'Eliminar un producto'
        }
    });
});

// GET /products - Obtener todos los productos
app.get('/products', (req, res) => {
    try {
        const products = readProducts();
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
});

// POST /products - Crear un nuevo producto
app.post('/products', (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        // Validar datos requeridos
        if (!name || !price || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos. Se necesitan: name, price, quantity'
            });
        }

        // Validar tipos de datos
        if (typeof name !== 'string' || typeof price !== 'number' || typeof quantity !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Tipos de datos inválidos. name debe ser string, price y quantity deben ser números'
            });
        }

        // Validar valores positivos
        if (price <= 0 || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser mayor a 0 y la cantidad no puede ser negativa'
            });
        }

        const newProduct = addProduct({ name, price, quantity });

        if (newProduct) {
            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: newProduct
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error al crear el producto'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// PUT /products/:id - Actualizar un producto
app.put('/products/:id', (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, quantity } = req.body;

        // Validar que el ID sea un número
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        // Verificar que el producto existe
        const existingProduct = getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Preparar datos para actualización
        const updateData = {};
        if (name !== undefined) {
            if (typeof name !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre debe ser una cadena de texto'
                });
            }
            updateData.name = name;
        }

        if (price !== undefined) {
            if (typeof price !== 'number' || price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El precio debe ser un número mayor a 0'
                });
            }
            updateData.price = price;
        }

        if (quantity !== undefined) {
            if (typeof quantity !== 'number' || quantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser un número mayor o igual a 0'
                });
            }
            updateData.quantity = quantity;
        }

        // Verificar que hay datos para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionaron datos para actualizar'
            });
        }

        const updatedProduct = updateProduct(productId, updateData);

        if (updatedProduct) {
            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: updatedProduct
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el producto'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// DELETE /products/:id - Eliminar un producto
app.delete('/products/:id', (req, res) => {
    try {
        const productId = req.params.id;

        // Validar que el ID sea un número
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        // Verificar que el producto existe
        const existingProduct = getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        const deleted = deleteProduct(productId);

        if (deleted) {
            res.json({
                success: true,
                message: 'Producto eliminado exitosamente',
                data: existingProduct
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el producto'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// GET /products/:id - Obtener un producto específico
app.get('/products/:id', (req, res) => {
    try {
        const productId = req.params.id;

        // Validar que el ID sea un número
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        const product = getProductById(productId);

        if (product) {
            res.json({
                success: true,
                data: product
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📋 Sistema de Gestión de Inventarios iniciado`);
    console.log(`📁 Archivo de productos: products.json`);
});

module.exports = app;
