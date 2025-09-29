# Sistema de Gestión de Inventarios

Una aplicación Node.js completa que simula un sistema de gestión de inventarios con interfaz web moderna y API REST. Utiliza archivos JSON para almacenar productos sin necesidad de base de datos.

## Características

### Backend (API REST)
- ✅ Crear productos (POST)
- ✅ Leer todos los productos (GET)
- ✅ Leer un producto específico (GET por ID)
- ✅ Actualizar productos (PUT)
- ✅ Eliminar productos (DELETE)
- ✅ Almacenamiento en archivos JSON
- ✅ Validación de datos
- ✅ Manejo de errores

### Frontend (Interfaz Web)
- ✅ Interfaz web moderna y responsiva
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Tabla de productos con búsqueda y filtros
- ✅ Modales para formularios y confirmaciones
- ✅ Diseño profesional con paleta de colores personalizada
- ✅ Iconos profesionales con Font Awesome
- ✅ Completamente responsivo para móviles y tablets

## Instalación

1. Instalar las dependencias:
```bash
npm install
```

2. Iniciar el servidor:
```bash
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

3. Abrir la interfaz web:
```
http://localhost:3000
```

El servidor se ejecutará en `http://localhost:3000` y la interfaz web estará disponible en la misma URL.

## Estructura del Proyecto

```
sistema-gestor-inventario/
├── package.json          # Configuración del proyecto
├── products.json         # Archivo de almacenamiento de productos
├── README.md            # Este archivo
├── src/                 # Código del backend
│   ├── server.js        # Servidor Express con rutas API
│   └── utils/           # Utilidades del backend
│       └── fileUtils.js # Funciones para manejo de archivos
└── public/              # Archivos del frontend
    ├── index.html       # Interfaz web principal
    ├── css/             # Estilos CSS
    │   └── styles.css   # Estilos CSS responsivos
    └── js/              # JavaScript del frontend
        └── script.js    # JavaScript para funcionalidades frontend
```

## API Endpoints

### 1. Obtener todos los productos
```http
GET /products
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1234567890,
      "name": "Laptop Dell",
      "price": 1500.00,
      "quantity": 10
    }
  ],
  "count": 1
}
```

### 2. Crear un nuevo producto
```http
POST /products
Content-Type: application/json

{
  "name": "Laptop Dell",
  "price": 1500.00,
  "quantity": 10
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 1234567890,
    "name": "Laptop Dell",
    "price": 1500.00,
    "quantity": 10
  }
}
```

### 3. Obtener un producto específico
```http
GET /products/1234567890
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1234567890,
    "name": "Laptop Dell",
    "price": 1500.00,
    "quantity": 10
  }
}
```

### 4. Actualizar un producto
```http
PUT /products/1234567890
Content-Type: application/json

{
  "name": "Laptop Dell XPS",
  "price": 1800.00,
  "quantity": 5
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 1234567890,
    "name": "Laptop Dell XPS",
    "price": 1800.00,
    "quantity": 5
  }
}
```

### 5. Eliminar un producto
```http
DELETE /products/1234567890
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente",
  "data": {
    "id": 1234567890,
    "name": "Laptop Dell XPS",
    "price": 1800.00,
    "quantity": 5
  }
}
```

## Estructura de un Producto

```json
{
  "id": 1234567890,        // ID único (generado automáticamente)
  "name": "Nombre del producto",  // Nombre (requerido)
  "price": 100.00,         // Precio (requerido, debe ser > 0)
  "quantity": 50           // Cantidad (requerido, debe ser >= 0)
}
```

## Validaciones

- **name**: Debe ser una cadena de texto no vacía
- **price**: Debe ser un número mayor a 0
- **quantity**: Debe ser un número mayor o igual a 0
- **id**: Se genera automáticamente si no se proporciona

## Códigos de Estado HTTP

- `200` - Operación exitosa
- `201` - Producto creado exitosamente
- `400` - Datos inválidos o faltantes
- `404` - Producto no encontrado
- `500` - Error interno del servidor

## Ejemplos de Uso con cURL

### Crear un producto:
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse Logitech", "price": 25.99, "quantity": 100}'
```

### Obtener todos los productos:
```bash
curl http://localhost:3000/products
```

### Actualizar un producto:
```bash
curl -X PUT http://localhost:3000/products/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"price": 29.99, "quantity": 80}'
```

### Eliminar un producto:
```bash
curl -X DELETE http://localhost:3000/products/1234567890
```

## Interfaz Web

La aplicación incluye una interfaz web moderna y responsiva que permite gestionar el inventario de forma visual e intuitiva.

### Características de la Interfaz

- **Dashboard**: Estadísticas en tiempo real del inventario
- **Tabla de Productos**: Vista completa con búsqueda y filtros
- **Formularios Modales**: Para agregar y editar productos
- **Confirmaciones**: Modales de confirmación para acciones críticas
- **Responsive Design**: Optimizado para móviles, tablets y desktop
- **Paleta de Colores**: Diseño profesional con colores personalizados

### Funcionalidades de la Interfaz

1. **Gestión de Productos**:
   - Agregar nuevos productos con validación
   - Editar productos existentes
   - Eliminar productos con confirmación
   - Búsqueda en tiempo real

2. **Filtros y Búsqueda**:
   - Filtrar por stock bajo
   - Filtrar por productos de alto valor
   - Búsqueda por nombre o ID

3. **Estadísticas**:
   - Total de productos
   - Valor total del inventario
   - Productos con stock bajo

4. **Experiencia de Usuario**:
   - Modales para todas las interacciones
   - Indicadores de estado del stock
   - Loading states y feedback visual
   - Diseño limpio y profesional

## Notas Técnicas

- Los datos se almacenan en el archivo `products.json`
- Los IDs se generan automáticamente usando timestamps
- El servidor incluye logging de requests
- Manejo robusto de errores y validaciones
- Código modularizado para fácil mantenimiento
- Interfaz web completamente integrada con la API
- Diseño responsivo con CSS Grid y Flexbox
- Iconos profesionales con Font Awesome
# gestor-inventario
