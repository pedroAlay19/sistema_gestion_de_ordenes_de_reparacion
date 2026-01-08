# MCP Server - Equipment Repair System

Model Context Protocol (MCP) server para el sistema de reparación de equipos. Proporciona herramientas para buscar equipos, validar disponibilidad, crear órdenes de reparación y consultar historial.

## 🔐 Autenticación

**IMPORTANTE:** Todos los endpoints del REST API requieren autenticación JWT.

### Cómo usar con autenticación:

1. Obtén un token JWT del servicio de autenticación (`auth-service`)
2. Incluye el token en el header `Authorization` de las peticiones al MCP:

```http
POST http://localhost:3004/mcp
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_equipment",
    "arguments": { "query": "laptop" }
  },
  "id": 1
}
```

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con:
PORT=3004
REST_API_URL=http://localhost:3000/api

# Modo desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🛠️ Herramientas Disponibles

### 1. `search_equipment`
Busca equipos por nombre, marca o modelo en el inventario del usuario autenticado.

**Requiere:** Token JWT con rol USER

```json
{
  "name": "search_equipment",
  "arguments": {
    "query": "Dell Latitude"
  }
}
```

### 2. `validate_availability`
Valida si un equipo está disponible para crear una orden de reparación.

**Requiere:** Token JWT

```json
{
  "name": "validate_availability",
  "arguments": {
    "equipmentId": "uuid-del-equipo"
  }
}
```

### 3. `create_repair_order`
Crea una nueva orden de reparación para un equipo.

**Requiere:** Token JWT con rol USER

```json
{
  "name": "create_repair_order",
  "arguments": {
    "equipmentId": "uuid-del-equipo",
    "problemDescription": "La pantalla no enciende",
    "imageUrls": ["https://example.com/image1.jpg"]
  }
}
```

### 4. `get_repair_orders`
Obtiene todas las órdenes de reparación de un equipo.

**Requiere:** Token JWT (USER, TECHNICIAN o ADMIN)

```json
{
  "name": "get_repair_orders",
  "arguments": {
    "equipmentId": "uuid-del-equipo"
  }
}
```

## 📡 Endpoints

### Health Check
```http
GET http://localhost:3004/health
```

### JSON-RPC Endpoint
```http
POST http://localhost:3004/mcp
```

#### Listar herramientas disponibles
```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}
```

#### Ejecutar una herramienta
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "nombre_de_la_herramienta",
    "arguments": { ... }
  },
  "id": 1
}
```

## 🔄 Integración con REST API

El MCP server se comunica con `rest-service-typescript` en `http://localhost:3000/api`.

**Endpoints utilizados:**
- `GET /equipments/search?q={query}` - Buscar equipos (requiere auth)
- `GET /equipments/:id` - Obtener equipo (requiere auth)
- `PATCH /equipments/:id` - Actualizar estado (requiere auth)
- `POST /repair-orders` - Crear orden (requiere auth con rol USER)
- `GET /repair-orders/equipment/:equipmentId` - Obtener órdenes (requiere auth)

## ⚠️ Consideraciones de Seguridad

1. **Siempre usa HTTPS en producción**
2. **Los tokens JWT tienen tiempo de expiración** - Renuévalos periódicamente
3. **Cada usuario solo puede ver sus propios equipos** - El filtrado se hace en el backend
4. **Roles requeridos:**
   - USER: Crear órdenes, buscar equipos propios
   - TECHNICIAN: Ver órdenes asignadas
   - ADMIN: Acceso completo

## 🐛 Debugging

El servidor incluye logs detallados:

```bash
🔧 Ejecutando tool: search_equipment
🔐 Token de autenticación configurado
✅ Tool ejecutado: { success: true, ... }
```

Si obtienes errores 401/403, verifica que:
1. El token sea válido y no haya expirado
2. El usuario tenga los permisos necesarios
3. El REST API esté ejecutándose

## 📝 Formato de Respuestas

El MCP server retorna respuestas en formato JSON-RPC 2.0:

**Éxito:**
```json
{
  "jsonrpc": "2.0",
  "result": { ... },
  "id": 1
}
```

**Error:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Descripción del error"
  },
  "id": 1
}
```
