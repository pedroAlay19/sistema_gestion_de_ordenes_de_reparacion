# 🔧 Sistema de Gestión de Órdenes de Reparación

Sistema integral de gestión de órdenes de reparación de equipos con automatización avanzada, integración de IA conversacional y flujos de trabajo automatizados mediante N8N. Diseñado para facilitar la gestión completa del ciclo de vida de reparaciones, desde la creación de la orden hasta su finalización y evaluación.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Workflows de N8N](#-workflows-de-n8n)
- [Roles y Permisos](#-roles-y-permisos)
- [API Documentation](#-api-documentation)
- [Características Avanzadas](#-características-avanzadas)

## ✨ Características Principales

### 👥 Gestión Multi-Rol
- **Clientes**: Registro de equipos, creación de órdenes de reparación, seguimiento en tiempo real
- **Técnicos**: Asignación de tareas, actualización de estado, registro de actividades
- **Administradores**: Dashboard completo, gestión de usuarios, inventario y reportes

### 🔧 Gestión de Órdenes de Reparación
- Creación y seguimiento de órdenes de reparación
- Sistema de estados con flujo completo (Pendiente → En Proceso → Completado)
- Asignación automática y manual de técnicos
- Registro detallado de actividades y diagnósticos
- Sistema de cotización y aprobación

### 🤖 Integración de IA Conversacional
- Chat inteligente con múltiples proveedores LLM (Google Gemini, OpenAI)
- Sistema de herramientas (Tools) mediante MCP (Model Context Protocol)
- Consultas sobre órdenes de reparación, equipos y servicios
- Asistencia automatizada para técnicos y clientes

### 📊 Gestión de Equipos e Inventario
- Registro completo de equipos con historial
- Catálogo de servicios de mantenimiento
- Inventario de repuestos con control de stock
- Historial de mantenimientos por equipo

### 🔔 Automatización con N8N
- Notificaciones automáticas por cambios de estado
- Asignación automática de técnicos
- Reportes diarios programados
- Monitoreo de salud del sistema
- Webhooks para integraciones externas

### ⭐ Sistema de Reviews
- Calificación de servicios completados
- Feedback de clientes
- Estadísticas de satisfacción

### 🔐 Autenticación y Seguridad
- Sistema de autenticación JWT robusto
- Servicio dedicado de autenticación
- Control de acceso basado en roles (RBAC)
- Rate limiting y validación de datos
- Caché distribuido con Redis

## 🏗 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│              React + TypeScript + Vite                       │
│                   (Puerto 5173)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌────────▼────────┐
│  Auth Service  │       │  REST Service    │
│   (NestJS)     │       │    (NestJS)      │
│  Puerto 3001   │       │   Puerto 3000    │
└───────┬────────┘       └────────┬─────────┘
        │                         │
        │      ┌──────────────────┴───────┐
        │      │                          │
        │   ┌──▼──┐                  ┌────▼────┐
        │   │Redis│                  │MCP Server│
        │   └─────┘                  │(Express) │
        │                            │Porto 8080│
        │                            └────┬─────┘
        │                                 │
┌───────▼─────────────────────────────────▼─────┐
│          PostgreSQL (Supabase)                 │
└────────────────────────────────────────────────┘
                     │
            ┌────────▼────────┐
            │   N8N Workflows │
            │   (Puerto 5678) │
            └─────────────────┘
```

### Componentes

#### Frontend
- **Framework**: React 19 con TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4 + Heroicons
- **Router**: React Router DOM 7
- **Charts**: Recharts
- **Storage**: Supabase Client

#### Backend Services

##### Auth Service (Puerto 3001)
- Autenticación y autorización
- Gestión de tokens JWT
- Registro y login de usuarios
- Validación de roles
- Base de datos SQLite local para sesiones

##### REST Service (Puerto 3000)
- API principal del sistema
- Gestión de órdenes de reparación
- CRUD de equipos, servicios y repuestos
- Integración con LLM (Gemini, OpenAI)
- WebSocket para actualizaciones en tiempo real
- Swagger/OpenAPI documentation
- Integración con N8N

##### MCP Server (Puerto 8080)
- Servidor de herramientas (Tools) para LLM
- Protocolo JSON-RPC
- Integración con REST Service
- Logging de operaciones

#### Infraestructura

##### Redis (Puerto 6379)
- Caché distribuido
- Gestión de sesiones
- Rate limiting
- Redis Commander UI (Puerto 8081)

##### PostgreSQL (Supabase)
- Base de datos principal
- Almacenamiento de usuarios
- Órdenes de reparación
- Equipos e inventario
- SSL/TLS habilitado

##### N8N (Puerto 5678)
- Orquestador de workflows
- Automatizaciones
- Integraciones
- Webhooks
- Autenticación: admin/admin123

## 🛠 Stack Tecnológico

### Frontend
```json
{
  "react": "19.1.1",
  "react-router-dom": "7.9.5",
  "typescript": "5.9.3",
  "vite": "7.1.7",
  "tailwindcss": "4.1.17",
  "@supabase/supabase-js": "2.80.0",
  "recharts": "3.4.1"
}
```

### Backend
```json
{
  "@nestjs/core": "11.0.1",
  "@nestjs/typeorm": "11.0.0",
  "typeorm": "0.3.27",
  "openai": "6.15.0",
  "@google/generative-ai": "0.24.1",
  "ioredis": "5.8.2",
  "cache-manager": "7.2.7",
  "@nestjs/jwt": "11.0.2",
  "@nestjs/swagger": "11.2.0"
}
```

### Infraestructura
- **Docker & Docker Compose**: Contenedorización
- **Redis 7**: Caché y sesiones
- **N8N**: Automatización de workflows
- **PostgreSQL**: Base de datos (via Supabase)

## 📁 Estructura del Proyecto

```
TrabajoAutonomop/
├── frontend/                        # Aplicación React
│   ├── src/
│   │   ├── api/                    # Clientes HTTP
│   │   ├── components/             # Componentes reutilizables
│   │   │   ├── admin/             # Componentes de administrador
│   │   │   ├── chat/              # Chat con IA
│   │   │   ├── equipments/        # Gestión de equipos
│   │   │   ├── repairOrders/      # Órdenes de reparación
│   │   │   └── ui/                # Componentes UI base
│   │   ├── context/               # Contextos de React
│   │   ├── hooks/                 # Hooks personalizados
│   │   ├── layouts/               # Layouts por rol
│   │   ├── pages/                 # Páginas de la aplicación
│   │   │   ├── admin/            # Páginas de administrador
│   │   │   ├── auth/             # Login/Registro
│   │   │   ├── technician/       # Páginas de técnico
│   │   │   └── user/             # Páginas de cliente
│   │   ├── types/                # Definiciones TypeScript
│   │   └── utils/                # Utilidades
│   └── package.json
│
├── backend/
│   ├── auth-service/              # Servicio de autenticación
│   │   ├── src/
│   │   │   ├── auth/             # Módulo de auth
│   │   │   └── main.ts
│   │   ├── data/                 # Base de datos SQLite
│   │   └── package.json
│   │
│   ├── rest-service-typescript/   # Servicio principal
│   │   ├── src/
│   │   │   ├── auth/             # Auth middleware
│   │   │   ├── equipments/       # Gestión de equipos
│   │   │   ├── llm-adapter/      # Integración LLM
│   │   │   ├── maintenance-services/  # Servicios
│   │   │   ├── n8n-integration/  # Integración N8N
│   │   │   ├── repair-orders/    # Órdenes de reparación
│   │   │   ├── repair-order-reviews/  # Reviews
│   │   │   ├── spare-parts/      # Repuestos
│   │   │   ├── users/            # Gestión usuarios
│   │   │   ├── websocket/        # WebSocket Gateway
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   └── mcp-server/                # Servidor MCP
│       ├── src/
│       │   ├── services/         # Servicios
│       │   ├── tools/            # Herramientas para LLM
│       │   ├── types/            # Tipos JSON-RPC
│       │   └── server.ts
│       └── package.json
│
├── n8n-workflows/                 # Workflows de automatización
│   ├── workflows/
│   │   ├── 01 - Repair Order Created.json
│   │   ├── 02-repair-order-status-changed.json
│   │   ├── 03-technician-task-assigned.json
│   │   ├── 04-daily-summary-report.json
│   │   └── 05-system-health-check.json
│   └── docker-compose.n8n.yml
│
├── docker-compose.yml             # Configuración Docker
└── README.md
```

## 📦 Requisitos Previos

- **Node.js**: >= 18.x
- **npm**: >= 9.x o **yarn**: >= 1.22.x
- **Docker**: >= 20.x
- **Docker Compose**: >= 2.x
- **Git**: >= 2.x

### Cuentas de Servicios Externos
- Cuenta de Supabase (PostgreSQL)
- API Key de Google Gemini (opcional)
- API Key de OpenAI (opcional)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd TrabajoAutonomop
```

### 2. Instalar Dependencias

#### Frontend
```bash
cd frontend
npm install
```

#### Auth Service
```bash
cd backend/auth-service
npm install
```

#### REST Service
```bash
cd backend/rest-service-typescript
npm install
```

#### MCP Server
```bash
cd backend/mcp-server
npm install
```

### 3. Levantar Infraestructura con Docker

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto levantará:
- Redis (Puerto 6379)
- Redis Commander (Puerto 8081)
- N8N (Puerto 5678)

## ⚙ Configuración

### Variables de Entorno

#### Backend - Auth Service
Crear archivo `.env` en `backend/auth-service/`:

```env
# Server
PORT=3001

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRATION=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Backend - REST Service
Crear archivo `.env` en `backend/rest-service-typescript/`:

```env
# Server
PORT=3000

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT Configuration (debe coincidir con auth-service)
JWT_ACCESS_SECRET=your-super-secret-jwt-key-here-change-in-production

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# LLM APIs
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# MCP Server
MCP_SERVER_URL=http://localhost:8080

# N8N Webhooks
N8N_WEBHOOK_URL=http://localhost:5678
```

#### Backend - MCP Server
Crear archivo `.env` en `backend/mcp-server/`:

```env
# Server
PORT=8080

# REST Service
REST_SERVICE_URL=http://localhost:3000
REST_SERVICE_AUTH_TOKEN=your-auth-token-here
```

#### Frontend
Crear archivo `.env` en `frontend/`:

```env
# API URLs
VITE_API_URL=http://localhost:3000
VITE_AUTH_API_URL=http://localhost:3001

# Supabase (opcional si se usa en frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# WebSocket
VITE_WS_URL=ws://localhost:3000
```

### Configuración de Base de Datos

El sistema utiliza PostgreSQL a través de Supabase. TypeORM está configurado con `synchronize: true` para desarrollo, lo que creará automáticamente las tablas necesarias.

**⚠️ IMPORTANTE**: En producción, cambiar `synchronize: false` y usar migraciones.

## 🎮 Ejecución

### Modo Desarrollo

#### 1. Levantar Infraestructura
```bash
docker-compose up -d
```

#### 2. Iniciar Backend Services

**Terminal 1 - Auth Service:**
```bash
cd backend/auth-service
npm run start:dev
```

**Terminal 2 - REST Service:**
```bash
cd backend/rest-service-typescript
npm run start:dev
```

**Terminal 3 - MCP Server:**
```bash
cd backend/mcp-server
npm run dev
```

#### 3. Iniciar Frontend
**Terminal 4:**
```bash
cd frontend
npm run dev
```

### Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **REST API**: http://localhost:3000
- **Auth API**: http://localhost:3001
- **MCP Server**: http://localhost:8080
- **N8N**: http://localhost:5678 (admin/admin123)
- **Redis Commander**: http://localhost:8081
- **Swagger API Docs**: http://localhost:3000/api

### Modo Producción

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Build Backend Services
```bash
cd backend/auth-service
npm run build
npm run start:prod

cd backend/rest-service-typescript
npm run build
npm run start:prod

cd backend/mcp-server
npm run build
npm start
```

## 🔄 Workflows de N8N

El sistema incluye 5 workflows automatizados pre-configurados:

### 1. Repair Order Created
**Trigger**: Creación de nueva orden de reparación  
**Acciones**:
- Notificación al cliente
- Notificación al administrador
- Registro en sistema de logs

### 2. Repair Order Status Changed
**Trigger**: Cambio de estado de orden  
**Acciones**:
- Notificación al cliente
- Actualización de dashboard
- Alertas según estado crítico

### 3. Technician Task Assigned
**Trigger**: Asignación de técnico a orden  
**Acciones**:
- Notificación al técnico
- Email con detalles de la orden
- Actualización de calendario

### 4. Daily Summary Report
**Trigger**: Programado (diario a las 9:00 AM)  
**Acciones**:
- Reporte de órdenes completadas
- Estadísticas del día anterior
- Alertas de órdenes pendientes
- Email a administradores

### 5. System Health Check
**Trigger**: Programado (cada 5 minutos)  
**Acciones**:
- Verificación de servicios
- Monitoreo de base de datos
- Alertas de disponibilidad
- Logs de sistema

### Configurar Workflows

1. Acceder a N8N: http://localhost:5678
2. Login: admin / admin123
3. Los workflows están en `/n8n-workflows/workflows/`
4. Importar workflows desde la UI de N8N
5. Configurar credenciales y webhooks

## 👥 Roles y Permisos

### Cliente (USER)
- ✅ Registrar y gestionar equipos propios
- ✅ Crear órdenes de reparación
- ✅ Ver estado de sus órdenes
- ✅ Comunicarse por chat
- ✅ Dejar reviews de servicios
- ✅ Ver historial de equipos
- ❌ No puede acceder a órdenes de otros clientes

### Técnico (TECHNICIAN)
- ✅ Ver órdenes asignadas
- ✅ Actualizar estado de órdenes
- ✅ Registrar diagnósticos
- ✅ Agregar repuestos utilizados
- ✅ Registrar tiempo de trabajo
- ✅ Comunicarse con clientes
- ✅ Ver historial de equipos
- ❌ No puede crear nuevas órdenes
- ❌ No puede acceder a panel de administración

### Administrador (ADMIN)
- ✅ Acceso completo al dashboard
- ✅ Gestión de todos los usuarios
- ✅ Gestión de técnicos y asignaciones
- ✅ Gestión de inventario completo
- ✅ Configuración de servicios
- ✅ Ver todas las órdenes
- ✅ Reportes y estadísticas
- ✅ Gestión de reviews
- ✅ Configuración del sistema

## 📚 API Documentation

### Swagger/OpenAPI
La documentación interactiva de la API está disponible en:

```
http://localhost:3000/api
```

### Endpoints Principales

#### Autenticación
```http
POST   /auth/register          # Registro de usuario
POST   /auth/login             # Login
POST   /auth/refresh           # Refresh token
GET    /auth/profile           # Obtener perfil
```

#### Usuarios
```http
GET    /users                  # Listar usuarios (Admin)
GET    /users/:id              # Obtener usuario
PATCH  /users/:id              # Actualizar usuario
DELETE /users/:id              # Eliminar usuario (Admin)
```

#### Equipos
```http
GET    /equipments             # Listar equipos
POST   /equipments             # Crear equipo
GET    /equipments/:id         # Obtener equipo
PATCH  /equipments/:id         # Actualizar equipo
DELETE /equipments/:id         # Eliminar equipo
GET    /equipments/:id/history # Historial de mantenimiento
```

#### Órdenes de Reparación
```http
GET    /repair-orders          # Listar órdenes
POST   /repair-orders          # Crear orden
GET    /repair-orders/:id      # Obtener orden
PATCH  /repair-orders/:id      # Actualizar orden
DELETE /repair-orders/:id      # Eliminar orden
POST   /repair-orders/:id/assign-technician    # Asignar técnico
PATCH  /repair-orders/:id/status               # Cambiar estado
POST   /repair-orders/:id/parts                # Agregar repuesto
```

#### Servicios de Mantenimiento
```http
GET    /maintenance-services   # Listar servicios
POST   /maintenance-services   # Crear servicio
GET    /maintenance-services/:id    # Obtener servicio
PATCH  /maintenance-services/:id    # Actualizar servicio
DELETE /maintenance-services/:id    # Eliminar servicio
```

#### Repuestos
```http
GET    /spare-parts            # Listar repuestos
POST   /spare-parts            # Crear repuesto
GET    /spare-parts/:id        # Obtener repuesto
PATCH  /spare-parts/:id        # Actualizar repuesto
DELETE /spare-parts/:id        # Eliminar repuesto
```

#### Reviews
```http
GET    /repair-order-reviews   # Listar reviews
POST   /repair-order-reviews   # Crear review
GET    /repair-order-reviews/:id      # Obtener review
DELETE /repair-order-reviews/:id      # Eliminar review
```

#### Chat con IA
```http
POST   /llm-adapter/chat       # Enviar mensaje al chat
GET    /llm-adapter/tools      # Listar herramientas disponibles
```

### Autenticación de Requests

Todas las rutas protegidas requieren JWT token en el header:

```http
Authorization: Bearer <token>
```

## 🎯 Características Avanzadas

### Chat con IA (LLM Integration)

El sistema incluye un chat inteligente que puede:
- Consultar información de órdenes de reparación
- Buscar equipos y su historial
- Obtener información de servicios y repuestos
- Proporcionar asistencia contextual

**Proveedores soportados:**
- Google Gemini (por defecto)
- OpenAI GPT (configurable)

**Model Context Protocol (MCP):**
El sistema implementa MCP con herramientas especializadas:
- `get_repair_orders`: Consultar órdenes
- `get_equipment_info`: Información de equipos
- `get_services`: Listar servicios
- `get_spare_parts`: Consultar repuestos

### WebSocket en Tiempo Real

El sistema usa WebSocket para actualizaciones en tiempo real:
- Cambios de estado de órdenes
- Nuevas asignaciones de técnicos
- Notificaciones instantáneas
- Actualizaciones de chat

### Caché con Redis

Implementación de caché distribuido para:
- Resultados de consultas frecuentes
- Sesiones de usuario
- Rate limiting
- Datos de dashboard

### Sistema de Notificaciones

Notificaciones automáticas via N8N:
- Email para eventos críticos
- Webhooks para integraciones
- Logs estructurados
- Reportes programados

## 🧪 Testing

### Backend
```bash
cd backend/auth-service
npm test
npm run test:e2e
npm run test:cov

cd backend/rest-service-typescript
npm test
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Logs

### Logs de Aplicación
Los servicios de NestJS generan logs en consola con diferentes niveles:
- `log`: Información general
- `error`: Errores
- `warn`: Advertencias
- `debug`: Depuración

### Logs de MCP Server
El MCP Server mantiene logs en formato JSONL:
```
backend/mcp-server/mcp-logs.jsonl
```

### Logs de N8N
N8N mantiene logs de ejecución de workflows en su panel:
http://localhost:5678/workflow/executions

## 🔒 Seguridad

### Implementaciones de Seguridad

- ✅ Autenticación JWT con tokens de acceso y refresh
- ✅ Hashing de contraseñas con bcrypt
- ✅ Validación de datos con class-validator
- ✅ CORS configurado
- ✅ Rate limiting con Redis
- ✅ SQL injection protection con TypeORM
- ✅ XSS protection
- ✅ Helmet (recomendado para producción)

### Recomendaciones para Producción

1. **Cambiar todos los secrets y passwords**
2. **Configurar HTTPS/SSL**
3. **Implementar firewall y restricciones de IP**
4. **Activar modo producción en TypeORM** (`synchronize: false`)
5. **Implementar migraciones de base de datos**
6. **Configurar backup automático de PostgreSQL**
7. **Implementar monitoring (Prometheus, Grafana)**
8. **Configurar logging centralizado**
9. **Implementar CI/CD**
10. **Realizar auditorías de seguridad**

## 🐛 Troubleshooting

### Error: Puerto ya en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: No se puede conectar a Redis
```bash
# Verificar que Redis está corriendo
docker ps | grep redis

# Reiniciar Redis
docker-compose restart redis
```

### Error: Base de datos no sincroniza
```bash
# Reiniciar el servicio backend
# Verificar DATABASE_URL en .env
# Revisar logs de TypeORM en consola
```

### Error: N8N no ejecuta workflows
```bash
# Verificar que el webhook URL es accesible
# Revisar logs en N8N UI
# Verificar que REST_SERVICE_URL es correcto
docker-compose logs -f n8n
```

## 📈 Roadmap

### Próximas Características
- [ ] Notificaciones push en navegador
- [ ] App móvil (React Native)
- [ ] Sistema de reportes avanzados con gráficos
- [ ] Integración con servicios de pago
- [ ] Sistema de facturaciónelectrónica
- [ ] Multi-tenant support
- [ ] API pública con rate limiting
- [ ] Sincronización offline
- [ ] Exportación de datos (PDF, Excel)
- [ ] Dashboard de métricas en tiempo real

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código

- TypeScript strict mode
- ESLint configurado
- Prettier para formateo
- Commits descriptivos
- Tests para nuevas features

## 📄 Licencia

Este proyecto es privado y no tiene licencia de código abierto.

## 👨‍💻 Autor

**Sistema de Gestión de Órdenes de Reparación**  
Desarrollado con ❤️ usando NestJS, React y TypeScript

## 📞 Soporte

Para soporte y preguntas:
- Crear un issue en el repositorio
- Revisar la documentación de API en `/api`
- Consultar logs de sistema

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Estado**: En Desarrollo Activo 🚀
