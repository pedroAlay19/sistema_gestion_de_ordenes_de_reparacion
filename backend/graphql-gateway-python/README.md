# GraphQL Gateway Python - API Documentation

## 📋 Descripción

Gateway GraphQL desarrollado en Python que actúa como capa de agregación sobre el API REST de NestJS. Proporciona consultas complejas optimizadas para el panel de administración, combinando datos de múltiples endpoints y calculando estadísticas.

## 🚀 Instalación y Configuración

### 1. Crear y activar entorno virtual

```powershell
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1
```

### 2. Instalar dependencias

```powershell
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
NEST_API_URL=http://localhost:3000/
```

### 4. Ejecutar servidor

```powershell
uvicorn src.main:app --reload
```

El servidor estará disponible en:
- **GraphQL Playground**: http://localhost:8000/graphql
- **Documentación**: http://localhost:8000/docs

## 📚 Estructura del Proyecto

```
src/
├── admin_queries/          # Gestión de usuarios (clientes y técnicos)
│   ├── admin_service.py    # Lógica de negocio
│   └── admin_resolvers.py  # Resolvers GraphQL
├── repair_order_queries/   # Órdenes de reparación
│   ├── repair_order_service.py
│   └── repair_order_resolvers.py
├── equipment_queries/      # Equipos
│   ├── equipment_service.py
│   └── equipment_resolvers.py
├── review_queries/         # Reseñas
│   ├── review_service.py
│   └── review_resolvers.py
├── graphql_types/          # Definición de tipos GraphQL
│   └── graphql_types.py
├── schema.py               # Schema principal
└── main.py                 # Punto de entrada
```

## 🔍 Queries Disponibles

### 1. Admin Queries - Gestión de Usuarios

#### `allClients`
Obtiene todos los clientes con estadísticas calculadas.

**Query:**
```graphql
query {
  allClients {
    client {
      id
      name
      lastName
      email
      phone
      address
      createdAt
    }
    stats {
      totalEquipments
      totalOrders
      completedOrders
      activeOrders
      
      totalSpent
      lastOrderDate
    }
  }
}
```

**Retorna:**
- Lista de clientes con estadísticas
- Total de equipos registrados
- Total de órdenes (completadas, activas)
- Gasto total
- Fecha de última orden

---

#### `clientProfile(clientId: ID!)`
Obtiene el perfil completo de un cliente específico.

**Query:**
```graphql
query {
  clientProfile(clientId: "123e4567-e89b-12d3-a456-426614174000") {
    id
    name
    lastName
    email
    phone
    address
    createdAt
    totalOrders
    totalSpent
    equipments {
      id
      name
      type
      brand
      model
      currentStatus
    }
    repairOrders {
      id
      problemDescription
      status
      finalCost
      createdAt
    }
  }
}
```

**Retorna:**
- Información completa del cliente
- Lista de equipos registrados
- Historial de órdenes de reparación
- Estadísticas agregadas

---

#### `allTechnicians`
Obtiene todos los técnicos con estadísticas de desempeño.

**Query:**
```graphql
query {
  allTechnicians {
    technician {
      id
      name
      lastName
      email
      phone
      specialty
      experienceYears
      active
      isEvaluator
    }
    stats {
      ordersCompleted
      ordersInProgress
      ordersPending
      totalRevenue
      averageRating
      totalReviews
    }
  }
}
```

**Retorna:**
- Lista de técnicos
- Órdenes completadas, en progreso y pendientes
- Ingresos totales generados
- Rating promedio y total de reseñas

---

#### `technicianProfile(technicianId: ID!)`
Obtiene el perfil completo de un técnico específico.

**Query:**
```graphql
query {
  technicianProfile(technicianId: "123e4567-e89b-12d3-a456-426614174001") {
    id
    name
    lastName
    email
    phone
    specialty
    experienceYears
    active
    isEvaluator
    statistics {
      ordersCompleted
      ordersInProgress
      ordersPending
      totalRevenue
      averageRating
      totalReviews
    }
    assignedOrders {
      id
      status
      unitPrice
      subTotal
      service {
        serviceName
        description
      }
    }
    reviews {
      id
      rating
      comment
      createdAt
    }
  }
}
```

**Retorna:**
- Información completa del técnico
- Estadísticas de desempeño
- Órdenes asignadas (detalles de servicios)
- Reseñas recibidas

---

### 2. Repair Order Queries - Órdenes de Reparación

#### `repairOrderComplete(orderId: ID!)`
Obtiene una orden de reparación con todas sus relaciones.

**Query:**
```graphql
query {
  repairOrderComplete(orderId: "123e4567-e89b-12d3-a456-426614174002") {
    id
    problemDescription
    diagnosis
    estimatedCost
    finalCost
    warrantyStartDate
    warrantyEndDate
    status
    imageUrls
    createdAt
    updatedAt
    equipment {
      id
      name
      type
      brand
      model
      serialNumber
      currentStatus
      owner {
        id
        name
        email
        phone
      }
    }
    evaluatedBy {
      id
      name
      lastName
      specialty
    }
    repairOrderDetails {
      id
      service {
        serviceName
        description
        basePrice
      }
      technician {
        name
        lastName
        specialty
      }
      unitPrice
      discount
      subTotal
      status
      notes
      imageUrl
    }
    repairOrderParts {
      id
      part {
        name
        description
        unitPrice
      }
      quantity
      subTotal
      imgUrl
    }
    notifications {
      id
      message
      type
      isRead
      createdAt
    }
    reviews {
      id
      rating
      comment
      visible
      createdAt
    }
  }
}
```

**Retorna:**
- Orden completa con todas las relaciones
- Información del equipo y propietario
- Técnico evaluador
- Detalles de servicios realizados
- Repuestos utilizados
- Notificaciones asociadas
- Reseñas del cliente

---

#### `repairOrdersFiltered`
Filtra órdenes de reparación por múltiples criterios.

**Query:**
```graphql
query {
  repairOrdersFiltered(
    status: "IN_REPAIR"
    startDate: "2025-01-01"
    endDate: "2025-12-31"
    technicianId: "123e4567-e89b-12d3-a456-426614174001"
    clientId: "123e4567-e89b-12d3-a456-426614174000"
  ) {
    id
    problemDescription
    status
    estimatedCost
    finalCost
    createdAt
    equipment {
      name
      type
      brand
      owner {
        name
        email
      }
    }
    evaluatedBy {
      name
      lastName
    }
  }
}
```

**Parámetros (todos opcionales):**
- `status`: PENDING, IN_EVALUATION, EVALUATED, IN_REPAIR, READY, DELIVERED, CANCELLED
- `startDate`: Fecha inicio (formato: YYYY-MM-DD)
- `endDate`: Fecha fin
- `technicianId`: ID del técnico
- `clientId`: ID del cliente

---

#### `ordersAnalytics(startDate: String!, endDate: String!)`
Análisis de órdenes por período con estadísticas agregadas.

**Query:**
```graphql
query {
  ordersAnalytics(
    startDate: "2025-01-01"
    endDate: "2025-12-31"
  ) {
    totalOrders
    totalRevenue
    averageCost
    ordersByStatus {
      status
      count
    }
    ordersByService {
      serviceName
      count
      revenue
    }
    ordersByTechnician {
      technicianName
      count
      revenue
    }
  }
}
```

**Retorna:**
- Total de órdenes y facturación
- Costo promedio
- Distribución por estado
- Servicios más solicitados
- Desempeño por técnico

---

### 3. Equipment Queries - Equipos

#### `allEquipments`
Obtiene todos los equipos con estadísticas de reparación.

**Query:**
```graphql
query {
  allEquipments {
    equipment {
      id
      name
      type
      brand
      model
      serialNumber
      currentStatus
      createdAt
      owner {
        id
        name
        email
        phone
      }
    }
    stats {
      totalRepairs
      completedRepairs
      activeRepairs
      totalSpent
      lastRepairDate
    }
  }
}
```

**Retorna:**
- Lista de equipos con propietarios
- Total de reparaciones (completadas y activas)
- Gasto total en reparaciones
- Fecha de última reparación

---

#### `equipmentHistory(equipmentId: ID!)`
Obtiene el historial completo de reparaciones de un equipo.

**Query:**
```graphql
query {
  equipmentHistory(equipmentId: "123e4567-e89b-12d3-a456-426614174003") {
    id
    problemDescription
    diagnosis
    estimatedCost
    finalCost
    status
    warrantyStartDate
    warrantyEndDate
    createdAt
    updatedAt
    evaluatedBy {
      name
      lastName
      specialty
    }
  }
}
```

**Retorna:**
- Historial cronológico de reparaciones
- Detalles de cada intervención
- Técnicos que evaluaron/repararon
- Información de garantías

---

#### `equipmentStats`
Estadísticas generales de equipos (retorna JSON string).

**Query:**
```graphql
query {
  equipmentStats
}
```

**Retorna (JSON):**
```json
{
  "total_equipments": 150,
  "equipments_by_type": [
    {"type": "LAPTOP", "count": 45},
    {"type": "DESKTOP", "count": 30},
    {"type": "PRINTER", "count": 25}
  ],
  "equipments_by_brand": [
    {"brand": "HP", "count": 40},
    {"brand": "Dell", "count": 35}
  ],
  "equipments_by_status": [
    {"status": "OPERATIONAL", "count": 100},
    {"status": "IN_REPAIR", "count": 20}
  ]
}
```

---

### 4. Review Queries - Reseñas

#### `allReviews`
Obtiene todas las reseñas con información de la orden asociada.

**Query:**
```graphql
query {
  allReviews {
    review {
      id
      rating
      comment
      visible
      createdAt
    }
    order {
      id
      problemDescription
      status
      finalCost
      equipment {
        name
        type
        owner {
          name
          email
        }
      }
    }
  }
}
```

**Retorna:**
- Todas las reseñas del sistema
- Información de la orden asociada
- Equipo y cliente relacionado

---

#### `reviewsStats`
Estadísticas completas de reseñas.

**Query:**
```graphql
query {
  reviewsStats {
    totalReviews
    visibleReviews
    averageRating
    rating1Count
    rating1Percentage
    rating2Count
    rating2Percentage
    rating3Count
    rating3Percentage
    rating4Count
    rating4Percentage
    rating5Count
    rating5Percentage
  }
}
```

**Retorna:**
- Total de reseñas (visibles y ocultas)
- Rating promedio
- Distribución por estrellas (1-5) con porcentajes

---

## 🔧 Arquitectura

### Flujo de Datos

```
Frontend → GraphQL Gateway → REST API (NestJS) → Database
         ↑                  ↑
         |                  |
    Query simplificada   Múltiples endpoints
    + estadísticas       + cálculos
```

### Responsabilidades

**GraphQL Gateway (Python):**
- Agregar datos de múltiples endpoints REST
- Calcular estadísticas complejas
- Optimizar queries para frontend
- Reducir número de llamadas HTTP

**REST API (NestJS):**
- Operaciones CRUD
- Validaciones de negocio
- Autenticación y autorización
- Acceso directo a base de datos

---

## 📊 Tipos GraphQL Principales

### UserType
```graphql
type UserType {
  id: ID!
  name: String!
  lastName: String
  email: String!
  phone: String
  address: String
  role: String!
  createdAt: String!
  updatedAt: String!
}
```

### TechnicianType
```graphql
type TechnicianType {
  id: ID!
  name: String!
  lastName: String
  email: String!
  phone: String
  specialty: String!
  experienceYears: Int!
  active: Boolean!
  isEvaluator: Boolean!
}
```

### EquipmentType
```graphql
type EquipmentType {
  id: ID!
  name: String!
  type: String!
  brand: String!
  model: String!
  serialNumber: String
  currentStatus: String!
  createdAt: String!
  owner: EquipmentOwnerType
}
```

### RepairOrderType
```graphql
type RepairOrderType {
  id: ID!
  problemDescription: String!
  diagnosis: String
  estimatedCost: Float!
  finalCost: Float!
  warrantyStartDate: String
  warrantyEndDate: String
  status: String!
  imageUrls: [String!]
  equipment: EquipmentType
  evaluatedBy: TechnicianType
  repairOrderDetails: [RepairOrderDetailType!]
  repairOrderParts: [RepairOrderPartType!]
  notifications: [RepairOrderNotificationType!]
  reviews: [ReviewType!]
  createdAt: String!
  updatedAt: String!
}
```

---

## 🎯 Casos de Uso

### Dashboard de Admin
```graphql
query AdminDashboard {
  # KPIs generales
  ordersAnalytics(startDate: "2025-01-01", endDate: "2025-12-31") {
    totalOrders
    totalRevenue
    averageCost
  }
  
  # Técnicos destacados
  allTechnicians {
    technician { name }
    stats {
      ordersCompleted
      totalRevenue
      averageRating
    }
  }
  
  # Estadísticas de reseñas
  reviewsStats {
    averageRating
    totalReviews
  }
}
```

### Gestión de Clientes
```graphql
query ClientManagement($clientId: ID!) {
  clientProfile(clientId: $clientId) {
    name
    email
    phone
    totalOrders
    totalSpent
    equipments {
      name
      type
      currentStatus
    }
    repairOrders {
      id
      status
      finalCost
      createdAt
    }
  }
}
```

### Historial de Equipo
```graphql
query EquipmentDetail($equipmentId: ID!) {
  equipmentHistory(equipmentId: $equipmentId) {
    id
    problemDescription
    diagnosis
    finalCost
    status
    createdAt
    evaluatedBy {
      name
      specialty
    }
  }
}
```

---

## 🛠️ Tecnologías

- **Strawberry GraphQL**: Framework GraphQL para Python
- **Uvicorn**: Servidor ASGI de alto rendimiento
- **Requests**: Cliente HTTP para llamadas al REST API
- **Python-dotenv**: Gestión de variables de entorno
- **HTTPX**: Cliente HTTP asíncrono (opcional)

---

## 📝 Notas de Desarrollo

### Agregar Nuevas Queries

1. **Definir tipos en `graphql_types.py`:**
```python
@strawberry.type
class MyNewType:
    id: strawberry.ID
    name: str
```

2. **Crear servicio en `my_queries/my_service.py`:**
```python
def get_my_data():
    res = requests.get(f"{API_URL}my-endpoint")
    res.raise_for_status()
    return res.json()
```

3. **Crear resolver en `my_queries/my_resolvers.py`:**
```python
@strawberry.type
class MyQueries:
    @strawberry.field
    def my_query(self) -> List[MyNewType]:
        return get_my_data()
```

4. **Registrar en `schema.py`:**
```python
from my_queries.my_resolvers import MyQueries

@strawberry.type
class Query(AdminQueries, MyQueries, ...):
    pass
```

---

## 🚨 Troubleshooting

### Error: "Cannot find module"
- Verificar que todas las importaciones usen rutas relativas (`..` para parent, `.` para mismo nivel)

### Error: "Connection refused"
- Verificar que el API REST esté corriendo en `http://localhost:3000`
- Revisar archivo `.env`

### Error al instalar dependencias
- Recrear entorno virtual: `Remove-Item -Recurse -Force venv; python -m venv venv`
- Activar y reinstalar: `.\venv\Scripts\Activate.ps1; pip install -r requirements.txt`

---

## 📞 Soporte

Para más información sobre el API REST, consultar:
- `backend/rest-service-typescript/README.md`
- Documentación Swagger: http://localhost:3000/api

---

**Última actualización:** Noviembre 2025
