# 🔧 ServicioTec - Sistema de Gestión de Taller de Reparación

Sistema completo de gestión para talleres de reparación de equipos con notificaciones en tiempo real, gestión de órdenes, asignación de técnicos y dashboard administrativo.

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Guía de Uso por Componente](#-guía-de-uso-por-componente)
- [API REST - Documentación de Endpoints](#-api-rest---documentación-de-endpoints)
- [Integración entre Tecnologías](#-integración-entre-tecnologías)
- [Flujos de Trabajo](#-flujos-de-trabajo)

---

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por tres servicios principales:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │◄────►│   Backend REST   │◄────►│   PostgreSQL    │
│   React + TS    │      │   NestJS + TS    │      │   Database      │
└────────┬────────┘      └────────┬─────────┘      └─────────────────┘
         │                        │
         │                        ▼
         │              ┌──────────────────┐
         └─────────────►│  WebSocket Go    │
                        │  Notifications   │
                        └──────────────────┘
```

### Componentes:

1. **Frontend (React + TypeScript + Vite)**
   - Interfaz de usuario moderna con Tailwind CSS
   - Roles: Usuario, Técnico, Admin
   - WebSocket para actualizaciones en tiempo real

2. **Backend REST (NestJS + TypeScript)**
   - API REST con autenticación JWT
   - TypeORM para gestión de base de datos
   - Validación con class-validator
   - Bcrypt para encriptación de contraseñas

3. **WebSocket Server (Go)**
   - Notificaciones en tiempo real
   - Actualización selectiva de métricas
   - Broadcast a múltiples clientes

4. **Base de Datos (PostgreSQL)**
   - Almacenamiento relacional
   - Gestión de usuarios, equipos, órdenes, servicios

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS 4** - Framework CSS
- **React Router v7** - Enrutamiento
- **Heroicons** - Iconos
- **Axios** - Cliente HTTP

### Backend
- **NestJS 11** - Framework Node.js
- **TypeScript** - Lenguaje
- **TypeORM** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Encriptación
- **Class Validator** - Validación de DTOs

### WebSocket
- **Go** - Lenguaje
- **Gorilla WebSocket** - Librería WebSocket
- **HTTP Server** - Servidor HTTP nativo

---

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Go** >= 1.21
- **PostgreSQL** >= 14.x
- **Git**

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/pedroAlay19/TrabajoAutonomo.git
cd TrabajoAutonomo
```

### 2. Configurar Base de Datos PostgreSQL

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE serviciotec;
\q
```

### 3. Backend REST (NestJS)

```bash
cd backend/rest-service-typescript

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

**Configurar `.env`:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=serviciotec

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro
JWT_EXPIRATION=7d

# WebSocket
WEBSOCKET_URL=http://localhost:8081

# Server
PORT=3000
```

**Iniciar servidor:**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3000`

### 4. WebSocket Server (Go)

```bash
cd backend/websocket-go

# Instalar dependencias
go mod download

# Crear .env (opcional)
echo "REST_API_URL=http://localhost:3000" > .env

# Ejecutar servidor
go run main.go
```

El servidor WebSocket estará disponible en:
- WebSocket: `ws://localhost:8081/ws`
- HTTP Notify: `http://localhost:8081/notify`
- Health Check: `http://localhost:8081/health`

### 5. Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Crear .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

**Build para producción:**
```bash
npm run build
npm run preview
```

---

## 📁 Estructura del Proyecto

```
TrabajoAutonomop/
├── backend/
│   ├── rest-service-typescript/          # API REST NestJS
│   │   ├── src/
│   │   │   ├── auth/                    # Autenticación JWT
│   │   │   ├── users/                   # Gestión de usuarios
│   │   │   ├── equipments/              # Gestión de equipos
│   │   │   ├── repair-orders/           # Órdenes de reparación
│   │   │   ├── maintenance-services/    # Servicios de mantenimiento
│   │   │   ├── spare-parts/             # Repuestos
│   │   │   ├── repair-order-reviews/    # Reseñas
│   │   │   └── websocket/               # Cliente WebSocket
│   │   └── package.json
│   │
│   └── websocket-go/                     # Servidor WebSocket
│       ├── main.go                       # Servidor principal
│       ├── go.mod
│       └── .gitignore
│
├── frontend/                             # Aplicación React
│   ├── src/
│   │   ├── api/                         # Clientes HTTP
│   │   ├── components/                  # Componentes reutilizables
│   │   ├── pages/                       # Páginas por rol
│   │   │   ├── admin/                   # Vistas de admin
│   │   │   ├── technician/              # Vistas de técnico
│   │   │   ├── user/                    # Vistas de usuario
│   │   │   └── auth/                    # Login/Registro
│   │   ├── hooks/                       # Custom hooks
│   │   ├── context/                     # Context API
│   │   ├── types/                       # TypeScript types
│   │   └── utils/                       # Utilidades
│   └── package.json
│
└── README.md
```

---

## 📖 Guía de Uso por Componente

### Backend REST (NestJS)

#### Módulos Principales

**1. Auth Module** (`src/auth/`)
- Registro e inicio de sesión
- Generación de tokens JWT
- Guards para protección de rutas
- Decoradores personalizados (@Auth, @ActiveUser)

**2. Users Module** (`src/users/`)
- CRUD de usuarios
- Gestión de técnicos (especialidad, años de experiencia)
- Técnicos evaluadores vs regulares
- Estadísticas de usuarios

**3. Equipments Module** (`src/equipments/`)
- Registro de equipos del cliente
- Estados: AVAILABLE, IN_REPAIR, RETIRED
- Vinculación con usuarios
- Actualización automática de estado

**4. Repair Orders Module** (`src/repair-orders/`)
- Creación de órdenes de reparación
- Estados: IN_REVIEW, WAITING_APPROVAL, REJECTED, IN_REPAIR, WAITING_PARTS, READY, DELIVERED
- Asignación de técnico evaluador automática
- Gestión de detalles (servicios asignados a técnicos)
- Gestión de piezas/repuestos
- Cálculo automático de costos
- Generación de garantía (3 meses al entregar)
- Notificaciones de cambio de estado

**5. Maintenance Services Module** (`src/maintenance-services/`)
- Catálogo de servicios disponibles
- Precios base
- Tipos de servicio

**6. Spare Parts Module** (`src/spare-parts/`)
- Inventario de repuestos
- Stock disponible
- Precios

**7. Reviews Module** (`src/repair-order-reviews/`)
- Reseñas de clientes
- Rating (1-5 estrellas)
- Solo para órdenes DELIVERED
- Una reseña por orden

**8. WebSocket Notification Service** (`src/websocket/`)
- Cliente HTTP para notificar al servidor Go
- Eventos: REPAIR_ORDER_CREATED, USER_CREATED, TECHNICIAN_CREATED

#### Características Especiales

**Validación de Datos:**
- DTOs con decoradores de class-validator
- Transformación automática con class-transformer
- Mensajes de error personalizados

**Seguridad:**
- Passwords hasheados con bcrypt (10 rounds)
- JWT con expiración configurable
- Guards basados en roles
- Validación de ownership en recursos

**Base de Datos:**
- Migraciones automáticas en desarrollo (synchronize: true)
- Relaciones OneToMany, ManyToOne
- Soft deletes opcionales
- Timestamps automáticos (createdAt, updatedAt)

### WebSocket Server (Go)

#### Funcionalidades

**1. Gestión de Conexiones**
- Múltiples clientes conectados simultáneamente
- Reconexión automática con límite de intentos
- Detección de desconexión

**2. Sistema de Eventos**
- Mapeo de eventos a endpoints específicos
- Fetch selectivo de datos según el evento
- Fetch paralelo de múltiples endpoints
- Transformación de keys para el frontend

**3. Endpoints**

`ws://localhost:8081/ws`
- Conexión WebSocket para el frontend
- Recibe actualizaciones en tiempo real

`POST http://localhost:8081/notify`
- Endpoint HTTP para recibir notificaciones desde NestJS
- Body: `{ "type": "REPAIR_ORDER_CREATED", "resourceId": "uuid" }`

`GET http://localhost:8081/health`
- Health check del servidor
- Retorna: `{ "status": "ok", "clients": 2, "events": 3 }`

**4. Eventos Configurados**

- `REPAIR_ORDER_CREATED`: Nueva orden creada
  - Actualiza: overview, by-status, recent, counts
  
- `USER_CREATED`: Nuevo cliente registrado
  - Actualiza: users overview, client count
  
- `TECHNICIAN_CREATED`: Nuevo técnico registrado
  - Actualiza: users overview, technician counts

- `DASHBOARD_FULL_UPDATE`: Actualización completa
  - Actualiza: Todas las métricas

### Frontend (React)

#### Roles y Vistas

**1. Usuario (Cliente)**
- Dashboard con resumen de equipos y órdenes
- Gestión de equipos (CRUD)
- Creación de órdenes de reparación
- Seguimiento de órdenes
- Notificaciones de cambio de estado
- Reseñas de servicio

**2. Técnico Regular**
- Vista "Mis Tareas"
- Lista de detalles asignados
- Filtros por estado (PENDING, IN_PROGRESS, COMPLETED)
- Edición de detalles:
  - Precio unitario
  - Descuento
  - Notas
- Cambio de estado de tareas
- Auto-actualización de orden a READY cuando todos los detalles están completos

**3. Técnico Evaluador**
- Dashboard de órdenes asignadas
- Evaluación de órdenes (diagnóstico, costo estimado)
- Asignación de servicios a técnicos
- Asignación de repuestos
- Cambio de estado de órdenes
- Aprobación/rechazo de reparaciones

**4. Administrador**
- Dashboard con métricas en tiempo real
- Notificaciones WebSocket (nueva orden, etc.)
- Gestión completa de:
  - Órdenes
  - Clientes
  - Técnicos
  - Equipos
  - Servicios
  - Repuestos
  - Reseñas
- Estadísticas y reportes
- Gráficos de rendimiento

#### Hooks Personalizados

**`useAuth`**
```typescript
const { user, signIn, signUp, signOut, isAuthenticated, isLoading } = useAuth();
```
- Gestión de autenticación
- Persistencia de sesión (localStorage)
- Redirección según rol

**`useWebSocket`**
```typescript
useWebSocket({
  onDashboardUpdate: (message) => {
    // Actualizar estado con message.data
  }
});
```
- Conexión automática al WebSocket
- Reconexión en caso de error
- Callback para actualizaciones

#### Componentes Destacados

**NotificationToast**
- Notificaciones visuales animadas
- Auto-cierre configurable
- Tipos: info, success, warning, error

**AdminDashboard**
- KPI Cards con iconos
- Gráficos de barras
- Actividad reciente
- Alertas importantes
- Actualización en tiempo real vía WebSocket

**MyAssignedDetails** (Técnico)
- Cards de tareas con información completa
- Modal de edición compacto
- Botones de acción según estado
- Cálculo automático de subtotal

---

## 🔌 API REST - Documentación de Endpoints

### Base URL
```
http://localhost:3000
```

### Autenticación

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 📝 Auth

#### `POST /auth/register`
Registro de nuevo usuario

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "lastName": "Pérez",
  "phone": "0991234567",
  "address": "Calle Principal 123"
}
```

**Response:** `201`
```json
{
  "access_token": "eyJhbGc...</",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "USER"
  }
}
```

#### `POST /auth/login`
Inicio de sesión

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:** `200`
```json
{
  "access_token": "eyJhbGc...</",
  "user": { ... }
}
```

#### `GET /auth/profile`
Obtener perfil del usuario autenticado

**Headers:** `Authorization: Bearer <token>`

**Response:** `200`
```json
{
  "id": "uuid",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 👥 Users

#### `GET /users`
Listar usuarios (Admin only)

**Response:** `200`
```json
[
  {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "USER"
  }
]
```

#### `GET /users/:id`
Obtener usuario por ID

#### `PATCH /users/:id`
Actualizar usuario

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "phone": "0999999999"
}
```

#### `DELETE /users/:id`
Eliminar usuario (Admin only)

#### `GET /users/stats/overview`
Estadísticas generales de usuarios

**Response:**
```json
{
  "totalUsers": 150,
  "totalClients": 120,
  "totalTechnicians": 30,
  "activeTechnicians": 25
}
```

#### `GET /users/stats/top-clients`
Top clientes por gasto

**Response:**
```json
{
  "topClients": [
    {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "totalOrders": 15,
      "totalSpent": 1500.50
    }
  ]
}
```

#### `GET /users/stats/top-technicians`
Top técnicos por órdenes completadas

---

### 🔧 Equipments

#### `POST /equipments`
Crear equipo (Usuario autenticado)

**Body:**
```json
{
  "name": "Laptop HP",
  "type": "Computadora",
  "brand": "HP",
  "model": "Pavilion 15",
  "serialNumber": "SN123456",
  "acquisitionDate": "2023-01-15"
}
```

**Response:** `201`
```json
{
  "id": "uuid",
  "name": "Laptop HP",
  "currentStatus": "AVAILABLE",
  "user": { "id": "uuid", "name": "Juan Pérez" }
}
```

#### `GET /equipments`
Listar equipos del usuario autenticado

#### `GET /equipments/:id`
Obtener equipo por ID

#### `PATCH /equipments/:id`
Actualizar equipo

#### `DELETE /equipments/:id`
Eliminar equipo

---

### 🛠️ Repair Orders

#### `POST /repair-orders`
Crear orden de reparación

**Body:**
```json
{
  "equipmentId": "uuid",
  "problemDescription": "La laptop no enciende",
  "details": [
    {
      "serviceId": "uuid-servicio",
      "technicianId": "uuid-tecnico",
      "unitPrice": 50.00,
      "discount": 5.00,
      "notes": "Revisar fuente de poder"
    }
  ],
  "parts": [
    {
      "partId": "uuid-repuesto",
      "quantity": 1,
      "unitPrice": 30.00
    }
  ]
}
```

**Response:** `201`
```json
{
  "savedOrder": {
    "id": "uuid",
    "problemDescription": "La laptop no enciende",
    "status": "IN_REVIEW",
    "finalCost": 75.00,
    "equipment": { ... },
    "evaluatedBy": { ... }
  }
}
```

#### `GET /repair-orders`
Listar órdenes según rol:
- **Admin**: Todas las órdenes
- **Técnico**: Órdenes donde está asignado
- **Usuario**: Sus propias órdenes

#### `GET /repair-orders/:id`
Obtener orden por ID (con permisos)

#### `GET /repair-orders/evaluator`
Órdenes asignadas al técnico evaluador

#### `GET /repair-orders/technician/my-details`
Detalles asignados al técnico autenticado

#### `PATCH /repair-orders/:id`
Actualizar orden (diagnóstico, estado, detalles, piezas)

**Body:**
```json
{
  "diagnosis": "Fuente de poder dañada",
  "estimatedCost": 80.00,
  "status": "IN_REPAIR",
  "details": [...],
  "parts": [...]
}
```

#### `PATCH /repair-orders/technician/detail/:detailId`
Técnico actualiza su detalle asignado

**Body:**
```json
{
  "status": "IN_PROGRESS",
  "unitPrice": 55.00,
  "discount": 5.00,
  "notes": "Componente reemplazado"
}
```

#### `DELETE /repair-orders/:id`
Eliminar orden (Admin only)

#### Estadísticas

- `GET /repair-orders/stats/overview` - Resumen general
- `GET /repair-orders/stats/revenue` - Ingresos
- `GET /repair-orders/stats/by-status` - Por estado
- `GET /repair-orders/stats/recent` - Órdenes recientes
- `GET /repair-orders/stats/top-services` - Servicios más usados

---

### 🔨 Services

#### `GET /services`
Listar servicios de mantenimiento

**Response:**
```json
[
  {
    "id": "uuid",
    "serviceName": "Limpieza de componentes",
    "type": "Mantenimiento Preventivo",
    "basePrice": 25.00,
    "description": "Limpieza profunda de componentes internos"
  }
]
```

#### `POST /services` (Admin)
Crear servicio

#### `PATCH /services/:id` (Admin)
Actualizar servicio

#### `DELETE /services/:id` (Admin)
Eliminar servicio

---

### 🔩 Spare Parts

#### `GET /spare-parts`
Listar repuestos

**Response:**
```json
[
  {
    "id": "uuid",
    "partName": "Fuente de poder 500W",
    "brand": "Corsair",
    "unitPrice": 45.00,
    "stock": 10
  }
]
```

#### `POST /spare-parts` (Admin)
Crear repuesto

#### `PATCH /spare-parts/:id` (Admin)
Actualizar repuesto

#### `DELETE /spare-parts/:id` (Admin)
Eliminar repuesto

---

### ⭐ Reviews

#### `POST /repair-order-reviews`
Crear reseña (Usuario, orden DELIVERED)

**Body:**
```json
{
  "repairOrderId": "uuid",
  "rating": 5,
  "comment": "Excelente servicio, muy rápido"
}
```

#### `GET /repair-order-reviews`
Listar reseñas según rol

#### `GET /repair-order-reviews/bests`
Mejores reseñas (rating >= 4, visible)

#### `GET /repair-order-reviews/repair-order/:orderId`
Reseña de una orden específica

#### `PATCH /repair-order-reviews/:id`
Actualizar reseña

#### `DELETE /repair-order-reviews/:id`
Eliminar reseña

---

## 🔗 Integración entre Tecnologías

### 1. Frontend ↔ Backend REST

**Flujo de Autenticación:**
```
[Frontend]              [Backend]
   |                       |
   |-- POST /auth/login -->|
   |                       |
   |<-- JWT Token ---------|
   |                       |
   | (Guarda en localStorage)
   |                       |
   |-- GET /equipments --->|
   | Header: Bearer token  |
   |                       |
   |<-- 200 + Data --------|
```

**Cliente HTTP (frontend/src/api/http.ts):**
```typescript
export const http = {
  async get(url: string, auth: boolean = false) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = localStorage.getItem('access_token');
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${url}`, { headers });
    return response.json();
  },
  // post, patch, delete...
}
```

### 2. Backend REST ↔ Base de Datos

**TypeORM + PostgreSQL:**

```typescript
// Entity
@Entity('repair_order')
export class RepairOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => Equipment)
  equipment: Equipment;
  
  @OneToMany(() => RepairOrderDetail, detail => detail.repairOrder)
  repairOrderDetails: RepairOrderDetail[];
  
  @Column({ type: 'numeric' })
  finalCost: number;
}

// Service
async create(dto: CreateRepairOrderDto) {
  const order = this.repository.create(dto);
  return await this.repository.save(order);
}
```

**Configuración (app.module.ts):**
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Solo en desarrollo
})
```

### 3. Backend REST ↔ WebSocket Go

**Notificación desde NestJS:**

```typescript
// websocket-notification.service.ts
async notifyDashboardUpdate(eventType: string, resourceId?: string) {
  const payload = {
    event: 'DASHBOARD_UPDATE',
    type: eventType,
    resourceId,
    timestamp: new Date().toISOString(),
  };
  
  await axios.post(`${WEBSOCKET_URL}/notify`, payload);
}

// Uso en repair-orders.service.ts
await this.wsNotificationService.notifyDashboardUpdate(
  'REPAIR_ORDER_CREATED',
  savedOrder.id
);
```

**Recepción en Go:**

```go
func handleNotify(w http.ResponseWriter, r *http.Request) {
  var notification map[string]interface{}
  json.NewDecoder(r.Body).Decode(&notification)
  
  eventType := notification["type"].(string)
  
  // Fetch datos actualizados del REST API
  go fetchAndBroadcastSelective(eventType)
}
```

### 4. WebSocket Go ↔ Frontend

**Conexión en Frontend:**

```typescript
// hooks/useWebSocket.ts
const ws = new WebSocket("ws://localhost:8081/ws");

ws.onmessage = (event) => {
  const message: DashboardUpdateMessage = JSON.parse(event.data);
  
  if (onDashboardUpdate) {
    onDashboardUpdate(message);
  }
};
```

**Actualización de Estado:**

```typescript
// AdminDashboard.tsx
useWebSocket({
  onDashboardUpdate: (message) => {
    if (message.event === "REPAIR_ORDER_CREATED") {
      setNotification("Nueva orden de reparación");
    }
    
    setDashboardData(prev => ({
      ...prev,
      ...message.data
    }));
  }
});
```

### 5. Flujo Completo de Notificación

```
[Usuario]                    [Backend REST]              [WebSocket Go]              [Admin Frontend]
   |                              |                            |                           |
   |-- POST /repair-orders ------>|                            |                           |
   |                              |                            |                           |
   |                              |-- Guardar en DB            |                           |
   |                              |                            |                           |
   |                              |-- POST /notify ----------->|                           |
   |                              |   {type: "ORDER_CREATED"}  |                           |
   |                              |                            |                           |
   |<-- 201 Created --------------|                            |-- Fetch endpoints ------->|
   |                              |                            |   (orders/stats/*)        |
   |                              |                            |                           |
   |                              |                            |<-- Stats data ------------|
   |                              |                            |                           |
   |                              |                            |-- WebSocket Broadcast --->|
   |                              |                            |   {event, data}           |
   |                              |                            |                           |
   |                              |                            |                      [Actualiza UI]
   |                              |                            |                      [Muestra Toast]
```

---

## 🔄 Flujos de Trabajo

### Flujo 1: Usuario Crea Orden de Reparación

1. **Usuario** inicia sesión
2. **Usuario** registra un equipo (si no existe)
3. **Usuario** crea orden de reparación con descripción del problema
4. **Backend** asigna automáticamente un técnico evaluador
5. **Backend** notifica al WebSocket
6. **Admin** recibe notificación en tiempo real
7. **Técnico Evaluador** revisa la orden
8. **Técnico Evaluador** realiza diagnóstico y asigna servicios/técnicos
9. **Orden** cambia a estado IN_REPAIR
10. **Equipo** automáticamente cambia a estado IN_REPAIR

### Flujo 2: Técnico Completa Trabajo

1. **Técnico** ve su lista de tareas asignadas
2. **Técnico** hace click en "Iniciar Trabajo" (PENDING → IN_PROGRESS)
3. **Técnico** edita el detalle (precio, descuento, notas)
4. **Técnico** completa el trabajo (IN_PROGRESS → COMPLETED)
5. **Sistema** verifica si todos los detalles están completados
6. **Sistema** actualiza orden a READY automáticamente
7. **Sistema** recalcula el costo final
8. **Técnico Evaluador** marca orden como DELIVERED
9. **Sistema** genera garantía de 3 meses automáticamente
10. **Equipo** vuelve a estado AVAILABLE
11. **Usuario** puede dejar una reseña

### Flujo 3: Admin Monitorea Dashboard

1. **Admin** accede al dashboard
2. **Frontend** carga datos iniciales desde REST API
3. **Frontend** establece conexión WebSocket
4. **WebSocket** envía actualizaciones cuando:
   - Se crea una nueva orden
   - Se registra un usuario
   - Se registra un técnico
5. **Dashboard** actualiza métricas en tiempo real
6. **Admin** ve notificación toast
7. **Admin** puede hacer click para ver detalles

---

## 🎯 Características Destacadas

### Seguridad
- ✅ Autenticación JWT
- ✅ Passwords encriptados con bcrypt
- ✅ Guards basados en roles
- ✅ Validación de ownership de recursos
- ✅ CORS configurado

### Automatizaciones
- ✅ Asignación automática de técnico evaluador
- ✅ Actualización de estado de equipo según orden
- ✅ Generación automática de garantía (3 meses)
- ✅ Cálculo automático de costos
- ✅ Cambio automático de orden a READY cuando todos los detalles están completos

### Notificaciones en Tiempo Real
- ✅ WebSocket con Go para alta performance
- ✅ Actualización selectiva de métricas
- ✅ Reconexión automática
- ✅ Broadcast a múltiples clientes
- ✅ Toast notifications en UI

### UX/UI
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Dark theme
- ✅ Responsive design
- ✅ Animaciones suaves
- ✅ Feedback visual inmediato

---

## 🐛 Solución de Problemas

### Backend no conecta a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Verificar credenciales en .env
cat backend/rest-service-typescript/.env
```

### WebSocket no conecta
```bash
# Verificar que el servidor Go esté corriendo
curl http://localhost:8081/health

# Verificar WEBSOCKET_URL en backend .env
```

### Frontend no carga
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar que VITE_API_URL esté correcto
cat frontend/.env
```

---

## 📝 Licencia

Este proyecto es privado y no tiene licencia pública.

---

## 👥 Equipo de Desarrollo

- **Backend**: NestJS + TypeScript
- **Frontend**: React + TypeScript
- **WebSocket**: Go
- **Database**: PostgreSQL

---

## 📞 Contacto

Para más información o soporte, contactar al equipo de desarrollo.

---

**Nota**: El componente `graphql-gateway-python` está planificado para futuras versiones y actualmente no está implementado.