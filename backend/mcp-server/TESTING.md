# 🧪 Guía de Testing - MCP Server

Guía completa para probar todas las herramientas del MCP Server y verificar que la integración con el REST API funcione correctamente.

---

## 📋 Pre-requisitos

### 1. Servicios Necesarios
Asegúrate de tener todos los servicios corriendo:

```bash
# Terminal 1 - Auth Service
cd backend/auth-service
npm run start:dev
# Debe estar en: http://localhost:3001

# Terminal 2 - REST Service
cd backend/rest-service-typescript
npm run start:dev
# Debe estar en: http://localhost:3000

# Terminal 3 - MCP Server
cd backend/mcp-server
npm run dev
# Debe estar en: http://localhost:3004
```

### 2. Verificar que los servicios estén activos

```bash
# Health check del MCP Server
curl http://localhost:3004/health

# Respuesta esperada:
{
  "status": "ok",
  "service": "mcp-server",
  "timestamp": "2026-01-07T...",
  "toolsCount": 4
}
```

---

## 🔐 Paso 0: Obtener Token de Autenticación

### Opción A: Usuario Existente (Login)

```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Opción B: Nuevo Usuario (Registro)

```http
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta esperada:**
```json
{
  "message": "Usuario registrado exitosamente",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ IMPORTANTE:** Guarda el `accessToken` - lo usarás en todos los siguientes pasos.

---

## 🛠️ Paso 1: Listar Tools Disponibles

Verifica que el MCP Server tenga las 4 herramientas registradas.

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "name": "search_equipment",
      "description": "Search for equipment by partial or full name...",
      "inputSchema": { ... }
    },
    {
      "name": "validate_availability",
      "description": "Validates if a piece of equipment is available...",
      "inputSchema": { ... }
    },
    {
      "name": "create_repair_order",
      "description": "Creates a new repair order...",
      "inputSchema": { ... }
    },
    {
      "name": "get_repair_orders",
      "description": "Retrieve all repair orders...",
      "inputSchema": { ... }
    }
  ],
  "id": 1
}
```

✅ **Verificación:** Debes ver exactamente 4 tools.

---

## 🔍 Paso 2: Crear Equipos de Prueba

Primero necesitas crear algunos equipos para poder probar las tools.

### 2.1 Crear Equipo 1 - Laptop Dell

```http
POST http://localhost:3000/api/equipments
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "name": "Laptop Dell",
  "brand": "Dell",
  "model": "Latitude 5420",
  "serialNumber": "SN123456",
  "equipmentType": "Laptop",
  "purchaseDate": "2024-01-15"
}
```

**Guarda el `id` que te devuelve** - Lo llamaremos `{EQUIPMENT_ID_1}`

### 2.2 Crear Equipo 2 - Laptop HP

```http
POST http://localhost:3000/api/equipments
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "name": "Laptop HP",
  "brand": "HP",
  "model": "Pavilion 15",
  "serialNumber": "SN789012",
  "equipmentType": "Laptop",
  "purchaseDate": "2024-02-20"
}
```

**Guarda el `id`** - Lo llamaremos `{EQUIPMENT_ID_2}`

### 2.3 Crear Equipo 3 - Impresora

```http
POST http://localhost:3000/api/equipments
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "name": "Impresora Canon",
  "brand": "Canon",
  "model": "PIXMA G3270",
  "serialNumber": "SN345678",
  "equipmentType": "Printer",
  "purchaseDate": "2024-03-10"
}
```

✅ **Verificación:** Debes tener 3 equipos creados con status `AVAILABLE`.

---

## 🧪 Paso 3: Probar `search_equipment`

### Test 3.1: Búsqueda por marca "Dell"

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_equipment",
    "arguments": {
      "query": "Dell"
    }
  },
  "id": 1
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "message": "Found 1 equipment(s) matching \"Dell\"",
    "equipments": [
      {
        "id": "{EQUIPMENT_ID_1}",
        "name": "Laptop Dell",
        "model": "Latitude 5420",
        "status": "AVAILABLE"
      }
    ]
  },
  "id": 1
}
```

✅ **Verificación:** Debe encontrar 1 equipo Dell.

### Test 3.2: Búsqueda por palabra "Laptop"

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_equipment",
    "arguments": {
      "query": "Laptop"
    }
  },
  "id": 2
}
```

✅ **Verificación:** Debe encontrar 2 equipos (ambas laptops).

### Test 3.3: Búsqueda sin resultados

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_equipment",
    "arguments": {
      "query": "MacBook"
    }
  },
  "id": 3
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": false,
    "message": "No equipment found with the term \"MacBook\"",
    "equipments": []
  },
  "id": 3
}
```

✅ **Verificación:** Debe retornar array vacío sin error.

### Test 3.4: Búsqueda sin autenticación (Error esperado)

```http
POST http://localhost:3004/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_equipment",
    "arguments": {
      "query": "Dell"
    }
  },
  "id": 4
}
```

✅ **Verificación:** Debe retornar array vacío y ver warning en logs del MCP Server.

---

## ✅ Paso 4: Probar `validate_availability`

### Test 4.1: Validar equipo disponible

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "validate_availability",
    "arguments": {
      "equipmentId": "{EQUIPMENT_ID_1}"
    }
  },
  "id": 1
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "available": true,
    "message": "Equipment available for repair order creation.",
    "equipment": {
      "id": "{EQUIPMENT_ID_1}",
      "name": "Laptop Dell",
      "status": "AVAILABLE",
      "model": "Latitude 5420",
      "brand": "Dell"
    }
  },
  "id": 1
}
```

✅ **Verificación:** `available` debe ser `true`.

### Test 4.2: Validar equipo inexistente

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "validate_availability",
    "arguments": {
      "equipmentId": "00000000-0000-0000-0000-000000000000"
    }
  },
  "id": 2
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": false,
    "available": false,
    "message": "Equipment with ID \"00000000-0000-0000-0000-000000000000\" not found. Please verify the ID.",
    "equipmentId": "00000000-0000-0000-0000-000000000000"
  },
  "id": 2
}
```

✅ **Verificación:** `available` debe ser `false` con mensaje apropiado.

---

## 📝 Paso 5: Probar `create_repair_order`

### Test 5.1: Crear orden de reparación exitosa

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "create_repair_order",
    "arguments": {
      "equipmentId": "{EQUIPMENT_ID_1}",
      "problemDescription": "La pantalla no enciende al presionar el botón de encendido. Se escucha el ventilador funcionando pero no hay imagen.",
      "imageUrls": [
        "https://example.com/damage1.jpg",
        "https://example.com/damage2.jpg"
      ]
    }
  },
  "id": 1
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "message": "✅ Repair order successfully created for Laptop Dell",
    "repairOrder": {
      "id": "{REPAIR_ORDER_ID}",
      "equipmentId": "{EQUIPMENT_ID_1}",
      "equipmentName": "Laptop Dell",
      "problemDescription": "La pantalla no enciende al presionar...",
      "status": "PENDING",
      "createdAt": "2026-01-07T..."
    }
  },
  "id": 1
}
```

**⚠️ IMPORTANTE:** Guarda el `id` de la orden - Lo llamaremos `{REPAIR_ORDER_ID}`

✅ **Verificación:** 
- La orden debe crearse con status `PENDING`
- El equipo debe cambiar a status `IN_REPAIR`

### Test 5.2: Verificar que el equipo cambió de estado

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "validate_availability",
    "arguments": {
      "equipmentId": "{EQUIPMENT_ID_1}"
    }
  },
  "id": 2
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "available": false,
    "message": "The equipment is already under repair. A new order cannot be created.",
    "equipment": {
      "id": "{EQUIPMENT_ID_1}",
      "name": "Laptop Dell",
      "status": "IN_REPAIR",
      ...
    }
  },
  "id": 2
}
```

✅ **Verificación:** El equipo ahora debe tener `status: "IN_REPAIR"` y `available: false`.

### Test 5.3: Intentar crear otra orden para el mismo equipo (Error esperado)

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "create_repair_order",
    "arguments": {
      "equipmentId": "{EQUIPMENT_ID_1}",
      "problemDescription": "Otro problema"
    }
  },
  "id": 3
}
```

✅ **Verificación:** Debe fallar porque el equipo ya está en reparación.

### Test 5.4: Crear orden sin imágenes (opcional)

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "create_repair_order",
    "arguments": {
      "equipmentId": "{EQUIPMENT_ID_2}",
      "problemDescription": "El teclado no responde correctamente. Algunas teclas quedan pegadas."
    }
  },
  "id": 4
}
```

✅ **Verificación:** La orden debe crearse exitosamente sin `imageUrls`.

---

## 📊 Paso 6: Probar `get_repair_orders`

### Test 6.1: Obtener órdenes de un equipo con 1 orden

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_repair_orders",
    "arguments": {
      "equipmentId": "{EQUIPMENT_ID_1}"
    }
  },
  "id": 1
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "message": "Found 1 repair order(s)",
    "repairOrders": [
      {
        "id": "{REPAIR_ORDER_ID}",
        "equipmentId": "{EQUIPMENT_ID_1}",
        "problemDescription": "La pantalla no enciende...",
        "status": "PENDING",
        "createdAt": "2026-01-07T...",
        ...
      }
    ],
    "summary": {
      "total": 1,
      "inRepair": 0,
      "completed": 0,
      "pending": 1
    }
  },
  "id": 1
}
```

✅ **Verificación:** 
- Debe retornar 1 orden
- El summary debe mostrar `pending: 1`

### Test 6.2: Obtener órdenes de equipo sin órdenes

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_repair_orders",
    "arguments": {
      "equipmentId": "{EQUIPMENT_ID_3}"
    }
  },
  "id": 2
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "message": "No repair orders found for equipment {EQUIPMENT_ID_3}",
    "repairOrders": [],
    "summary": {
      "total": 0,
      "inRepair": 0,
      "completed": 0,
      "pending": 0
    }
  },
  "id": 2
}
```

✅ **Verificación:** Debe retornar array vacío con summary en ceros.

---

## 🔄 Paso 7: Flujo Completo End-to-End

Prueba el flujo completo de creación de una orden:

1. **Buscar equipo disponible**
   ```
   Tool: search_equipment -> query: "HP"
   ```

2. **Validar disponibilidad**
   ```
   Tool: validate_availability -> equipmentId: {id_del_HP}
   ```

3. **Crear orden de reparación**
   ```
   Tool: create_repair_order -> equipmentId, problemDescription
   ```

4. **Verificar que se creó**
   ```
   Tool: get_repair_orders -> equipmentId: {id_del_HP}
   ```

5. **Verificar que ya no está disponible**
   ```
   Tool: validate_availability -> equipmentId: {id_del_HP}
   ```

✅ **Verificación completa:** Todo el flujo debe ejecutarse sin errores.

---

## ❌ Paso 8: Casos de Error

### Test 8.1: JSON-RPC inválido

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "method": "tools/list"
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Solicitud JSON-RPC inválida"
  },
  "id": null
}
```

### Test 8.2: Tool inexistente

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "nonexistent_tool",
    "arguments": {}
  },
  "id": 1
}
```

**Respuesta esperada:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Tool \"nonexistent_tool\" no encontrado"
  },
  "id": 1
}
```

### Test 8.3: Parámetros faltantes

```http
POST http://localhost:3004/mcp
Authorization: Bearer {TU_ACCESS_TOKEN}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_equipment",
    "arguments": {}
  },
  "id": 1
}
```

✅ **Verificación:** Debe retornar error indicando que falta el parámetro `query`.

---

## 🎯 Checklist Final

Marca cada item después de probarlo:

- [ ] Health check responde correctamente
- [ ] Login/Registro retorna token JWT
- [ ] tools/list muestra las 4 herramientas
- [ ] search_equipment encuentra equipos por nombre
- [ ] search_equipment encuentra equipos por marca
- [ ] search_equipment encuentra equipos por modelo
- [ ] search_equipment retorna vacío cuando no hay resultados
- [ ] validate_availability confirma equipo AVAILABLE
- [ ] validate_availability detecta equipo IN_REPAIR
- [ ] validate_availability detecta equipo inexistente
- [ ] create_repair_order crea orden exitosamente
- [ ] create_repair_order actualiza estado del equipo
- [ ] create_repair_order falla si equipo ya está en reparación
- [ ] get_repair_orders muestra órdenes existentes
- [ ] get_repair_orders retorna vacío si no hay órdenes
- [ ] Flujo completo E2E funciona sin errores
- [ ] Errores JSON-RPC se manejan correctamente
- [ ] Sin token JWT se manejan los errores apropiadamente

---

## 🐛 Troubleshooting

### Problema: "No autorizado" / Error 401

**Causa:** Token JWT expirado o inválido

**Solución:**
1. Obtén un nuevo token haciendo login nuevamente
2. Verifica que el header sea: `Authorization: Bearer {token}`
3. Asegúrate de no tener espacios extra en el token

### Problema: Array vacío en search_equipment

**Causa posible:**
1. No tienes equipos creados
2. Los equipos pertenecen a otro usuario
3. No hay token de autenticación

**Solución:**
1. Crea equipos primero con POST /api/equipments
2. Usa el mismo token en todas las peticiones
3. Verifica los logs del MCP Server

### Problema: "Equipment not found"

**Causa:** ID de equipo incorrecto

**Solución:**
1. Verifica que el UUID sea correcto
2. Lista tus equipos con GET /api/equipments
3. Copia el ID exacto sin espacios

### Problema: MCP Server no responde

**Causa:** Servidor no está corriendo

**Solución:**
```bash
cd backend/mcp-server
npm run dev
```

Verifica que veas: `MCP Server corriendo en puerto 3004`

---

## 📝 Logs para Debugging

El MCP Server muestra logs útiles:

```
🔧 Ejecutando tool: search_equipment
🔐 Token de autenticación configurado
✅ Tool ejecutado: { success: true, ... }
```

Si ves `⚠️ No se proporcionó token de autenticación`, añade el header Authorization.

---

## ✅ Conclusión

Si todos los tests pasaron correctamente, tu MCP Server está **funcionando perfectamente** y listo para ser integrado con cualquier cliente que implemente el protocolo JSON-RPC 2.0.

**Próximos pasos:**
- Integrar con un cliente MCP
- Agregar más herramientas según necesidad
- Implementar caché para mejorar performance
- Agregar métricas y monitoreo
