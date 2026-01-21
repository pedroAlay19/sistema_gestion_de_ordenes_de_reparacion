# Sistema de Gestión de Reparaciones y Mantenimiento

Sistema completo de gestión de órdenes de reparación, mantenimiento de equipos y automatización de flujos de trabajo, desarrollado con una arquitectura de microservicios moderna.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Servicios y Puertos](#servicios-y-puertos)
- [Características Principales](#características-principales)
- [Desarrollo](#desarrollo)
- [Scripts Disponibles](#scripts-disponibles)

## 🎯 Descripción General

Sistema integral para la gestión de reparaciones y mantenimiento que incluye:

- **Gestión de Órdenes de Reparación**: Creación, seguimiento y actualización de órdenes
- **Administración de Equipos**: Catálogo completo de equipos y repuestos
- **Sistema de Usuarios**: Roles diferenciados (Admin, Técnico, Usuario)
- **Automatización de Workflows**: Notificaciones automáticas y reportes programados
- **Chat en Tiempo Real**: Comunicación instantánea entre usuarios y técnicos
- **Reportes y Análisis**: Generación de reportes en PDF con métricas del sistema
- **Integración con IA**: Asistente inteligente para soporte técnico

## 🏗️ Arquitectura

El sistema está construido con una arquitectura de microservicios:

```
┌─────────────────┐
│   Frontend      │ ← React + Vite + TypeScript
│   (Port 5173)   │
└────────┬────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
┌────────▼────────┐  ┌──────────────────┐  ┌──────▼──────┐
│  Auth Service   │  │  GraphQL Gateway │  │ REST Service│
│  NestJS (3001)  │  │  Python (8000)   │  │NestJS (3000)│
└────────┬────────┘  └─────────┬────────┘  └──────┬──────┘
         │                     │                   │
         ├─────────────────────┴───────────────────┤
         │                                         │
┌────────▼────────┐  ┌──────────────────┐  ┌──────▼──────┐
│  WebSocket Go   │  │   Redis Cache    │  │     N8N     │
│   (Port 8080)   │  │   (Port 6379)    │  │ (Port 5678) │
└─────────────────┘  └──────────────────┘  └─────────────┘
         │                                         │
         └────────────────┬────────────────────────┘
                          │
                  ┌───────▼────────┐
                  │    Supabase    │
                  │   PostgreSQL   │
                  └────────────────┘
```

### Componentes:

1. **Frontend (React + TypeScript)**
   - Interfaz de usuario moderna y responsiva
   - Autenticación y autorización
   - Dashboards diferenciados por rol

2. **Auth Service (NestJS)**
   - Autenticación JWT
   - Gestión de sesiones con Redis
   - Roles y permisos

3. **REST Service (NestJS)**
   - API principal del sistema
   - Gestión de órdenes, equipos, repuestos
   - Integración con IA (Google Gemini)
   - Integración con N8N para workflows

4. **GraphQL Gateway (Python + Strawberry)**
   - Consultas administrativas complejas
   - Generación de reportes en PDF
   - Agregación de datos

5. **WebSocket Service (Go)**
   - Chat en tiempo real
   - Notificaciones instantáneas
   - Alta concurrencia

6. **MCP Server (TypeScript)**
   - Model Context Protocol
   - Integración con herramientas de IA
   - Gestión de contexto

7. **N8N (Workflow Orchestrator)**
   - Automatización de notificaciones
   - Reportes programados
   - Integraciones con servicios externos

8. **Redis**
   - Cache de sesiones
   - Cache de datos frecuentes
   - Cola de mensajes

9. **Supabase**
   - Base de datos PostgreSQL
   - Autenticación
   - Storage de archivos

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS 4** - Framework de CSS
- **React Router** - Enrutamiento
- **Recharts** - Gráficos y visualizaciones
- **Supabase Client** - Cliente de base de datos

### Backend

#### Auth Service & REST Service
- **NestJS 11** - Framework de Node.js
- **TypeScript** - Lenguaje
- **JWT** - Autenticación
- **Redis** - Cache y sesiones
- **Supabase** - Base de datos
- **Google Gemini AI** - Integración de IA

#### GraphQL Gateway
- **Python 3.11+** - Lenguaje
- **Strawberry GraphQL** - Framework GraphQL
- **Uvicorn** - Servidor ASGI
- **ReportLab** - Generación de PDFs

#### WebSocket Service
- **Go 1.21+** - Lenguaje
- **Gorilla WebSocket** - WebSockets en Go

#### MCP Server
- **TypeScript** - Lenguaje
- **Node.js** - Runtime
- **Model Context Protocol** - Protocolo de contexto

### DevOps & Infraestructura
- **Docker & Docker Compose** - Contenedores
- **N8N** - Automatización de workflows
- **Redis** - Cache en memoria
- **Git** - Control de versiones

## 📁 Estructura del Proyecto

```
TrabajoAutonomop/
├── frontend/                          # Aplicación React
│   ├── src/
│   │   ├── api/                      # Clientes de API
│   │   ├── components/               # Componentes reutilizables
│   │   ├── context/                  # Contextos de React
│   │   ├── hooks/                    # Custom hooks
│   │   ├── layouts/                  # Layouts por rol
│   │   ├── pages/                    # Páginas de la aplicación
│   │   ├── types/                    # Tipos TypeScript
│   │   └── utils/                    # Utilidades
│   └── package.json
│
├── backend/
│   ├── auth-service/                 # Servicio de autenticación
│   │   ├── src/
│   │   │   ├── auth/                # Módulo de autenticación
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   ├── rest-service-typescript/      # API REST principal
│   │   ├── src/
│   │   │   ├── equipments/          # Gestión de equipos
│   │   │   ├── repair-orders/       # Órdenes de reparación
│   │   │   ├── spare-parts/         # Repuestos
│   │   │   ├── users/               # Usuarios
│   │   │   ├── maintenance-services/# Servicios de mantenimiento
│   │   │   ├── repair-order-reviews/# Reviews de órdenes
│   │   │   ├── llm-adapter/         # Adaptador de IA
│   │   │   ├── n8n-integration/     # Integración N8N
│   │   │   └── websocket/           # Cliente WebSocket
│   │   └── package.json
│   │
│   ├── graphql-gateway-python/       # Gateway GraphQL
│   │   ├── src/
│   │   │   ├── admin_queries/       # Queries administrativas
│   │   │   ├── reports/             # Generación de reportes
│   │   │   ├── schema.py            # Schema GraphQL
│   │   │   └── main.py
│   │   └── requirements.txt
│   │
│   ├── websocket-go/                 # Servicio WebSocket
│   │   ├── main.go
│   │   └── go.mod
│   │
│   └── mcp-server/                   # Model Context Protocol Server
│       ├── src/
│       │   ├── server.ts
│       │   ├── services/
│       │   ├── tools/
│       │   └── types/
│       └── package.json
│
├── n8n-workflows/                     # Workflows de automatización
│   └── workflows/
│       ├── 01 - Repair Order Created.json
│       ├── 02-repair-order-status-changed.json
│       ├── 03-technician-task-assigned.json
│       ├── 04-daily-summary-report.json
│       └── 05-system-health-check.json
│
├── docker-compose.yml                 # Configuración de Docker
└── README.md                          # Este archivo
```

## 📋 Requisitos Previos

### Software Requerido

- **Node.js**: >= 18.x
- **npm** o **yarn**: Gestor de paquetes
- **Python**: >= 3.11
- **Go**: >= 1.21
- **Docker & Docker Compose**: >= 24.x
- **Git**: Control de versiones

### Cuentas y Servicios Externos

- **Supabase**: Cuenta y proyecto creado
  - URL del proyecto
  - Anon Key
  - Service Role Key
  
- **Google Gemini AI**: API Key para integración de IA

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd TrabajoAutonomop
```

### 2. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

### 3. Instalar Dependencias de Auth Service

```bash
cd ../backend/auth-service
npm install
```

### 4. Instalar Dependencias de REST Service

```bash
cd ../rest-service-typescript
npm install
```

### 5. Instalar Dependencias de MCP Server

```bash
cd ../mcp-server
npm install
```

### 6. Instalar Dependencias de GraphQL Gateway

```bash
cd ../graphql-gateway-python
pip install -r requirements.txt
```

### 7. Instalar Dependencias de WebSocket Service

```bash
cd ../websocket-go
go mod download
```

## ⚙️ Configuración

### Variables de Entorno

#### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
VITE_AUTH_URL=http://localhost:3001
VITE_WEBSOCKET_URL=ws://localhost:8080
VITE_GRAPHQL_URL=http://localhost:8000/graphql
```

#### Auth Service (`backend/auth-service/.env`)

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### REST Service (`backend/rest-service-typescript/.env`)

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
GEMINI_API_KEY=your_gemini_api_key
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

#### GraphQL Gateway (`backend/graphql-gateway-python/.env`)

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=8000
```

#### WebSocket Service (`backend/websocket-go/.env`)

```env
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Configuración de Docker

El archivo `docker-compose.yml` ya está configurado con:
- **Redis** (puerto 6379)
- **Redis Commander** (puerto 8081)
- **N8N** (puerto 5678)

Credenciales por defecto de N8N:
- Usuario: `admin`
- Contraseña: `admin123`

## 🚀 Ejecución

### Opción 1: Ejecutar con Docker (Recomendado)

#### 1. Iniciar servicios de infraestructura

```bash
docker-compose up -d
```

Esto iniciará:
- Redis
- Redis Commander
- N8N

#### 2. Verificar que los contenedores estén corriendo

```bash
docker-compose ps
```

### Opción 2: Ejecutar Manualmente (Desarrollo)

#### 1. Iniciar Redis (con Docker)

```bash
docker-compose up -d redis redis-commander
```

#### 2. Iniciar N8N (opcional)

```bash
docker-compose up -d n8n
```

#### 3. Iniciar Backend Services

**Auth Service:**
```bash
cd backend/auth-service
npm run start:dev
```

**REST Service:**
```bash
cd backend/rest-service-typescript
npm run start:dev
```

**GraphQL Gateway:**
```bash
cd backend/graphql-gateway-python
uvicorn src.main:app --reload --port 8000
```

**WebSocket Service:**
```bash
cd backend/websocket-go
go run main.go
```

**MCP Server:**
```bash
cd backend/mcp-server
npm run start
```

#### 4. Iniciar Frontend

```bash
cd frontend
npm run dev
```

## 🌐 Servicios y Puertos

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| Frontend | 5173 | http://localhost:5173 | Aplicación web principal |
| Auth Service | 3001 | http://localhost:3001 | Servicio de autenticación |
| REST Service | 3000 | http://localhost:3000 | API REST principal |
| GraphQL Gateway | 8000 | http://localhost:8000/graphql | API GraphQL y reportes |
| WebSocket Service | 8080 | ws://localhost:8080 | Chat en tiempo real |
| Redis | 6379 | localhost:6379 | Cache y sesiones |
| Redis Commander | 8081 | http://localhost:8081 | UI para Redis |
| N8N | 5678 | http://localhost:5678 | Automatización de workflows |

## ✨ Características Principales

### 1. Sistema de Autenticación
- Login y registro de usuarios
- Roles: Admin, Técnico, Usuario
- JWT con refresh tokens
- Sesiones almacenadas en Redis

### 2. Gestión de Órdenes de Reparación
- Creación y seguimiento de órdenes
- Estados: Pendiente, En Progreso, Completada, Cancelada
- Asignación automática de técnicos
- Historial completo de cambios

### 3. Gestión de Equipos y Repuestos
- Catálogo completo de equipos
- Inventario de repuestos
- Asociación de repuestos a órdenes

### 4. Chat en Tiempo Real
- Comunicación instantánea
- Notificaciones en tiempo real
- Historial de mensajes

### 5. Automatización con N8N
- Notificación automática al crear órdenes
- Alertas de cambio de estado
- Asignación de tareas a técnicos
- Reportes diarios automáticos
- Monitoreo de salud del sistema

### 6. Reportes y Análisis
- Generación de PDFs
- Métricas de rendimiento
- Estadísticas por técnico
- Dashboard administrativo

### 7. Asistente de IA
- Soporte técnico automatizado
- Sugerencias inteligentes
- Análisis de problemas

### 8. Evaluaciones y Reviews
- Sistema de calificación de servicio
- Comentarios de usuarios
- Métricas de satisfacción

## 👨‍💻 Desarrollo

### Estructura de Commits

Seguimos Conventional Commits:

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato
refactor: refactorización de código
test: añadir o modificar tests
chore: tareas de mantenimiento
```

### Flujo de Trabajo

1. Crear rama desde `main`: `git checkout -b feature/nueva-caracteristica`
2. Realizar cambios y commits
3. Push a la rama: `git push origin feature/nueva-caracteristica`
4. Crear Pull Request
5. Code review
6. Merge a `main`

### Testing

#### Frontend
```bash
cd frontend
npm run test
```

#### Backend Services
```bash
cd backend/auth-service
npm run test

cd backend/rest-service-typescript
npm run test
```

### Linting

#### Frontend
```bash
cd frontend
npm run lint
```

#### Backend
```bash
cd backend/auth-service
npm run lint

cd backend/rest-service-typescript
npm run lint
```

## 📝 Scripts Disponibles

### Frontend
- `npm run dev` - Modo desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecutar ESLint

### Backend (Auth & REST Service)
- `npm run start:dev` - Modo desarrollo con hot-reload
- `npm run start:prod` - Modo producción
- `npm run build` - Compilar TypeScript
- `npm run lint` - Ejecutar ESLint
- `npm run test` - Ejecutar tests

### GraphQL Gateway
- `uvicorn src.main:app --reload` - Modo desarrollo
- `uvicorn src.main:app` - Modo producción

### WebSocket Service
- `go run main.go` - Modo desarrollo
- `go build -o websocket-server` - Build ejecutable

### Docker
- `docker-compose up -d` - Iniciar todos los servicios
- `docker-compose down` - Detener todos los servicios
- `docker-compose logs -f [servicio]` - Ver logs
- `docker-compose ps` - Ver estado de contenedores
- `docker-compose restart [servicio]` - Reiniciar servicio

## 🔍 Monitoreo y Debugging

### Redis Commander
Accede a http://localhost:8081 para visualizar:
- Sesiones activas
- Cache de datos
- Estadísticas de uso

### N8N Dashboard
Accede a http://localhost:5678 para:
- Gestionar workflows
- Ver ejecuciones
- Depurar automatizaciones

### Logs
```bash
# Ver logs de Docker services
docker-compose logs -f redis
docker-compose logs -f n8n

# Ver logs de servicios Node.js
# Los logs se muestran en la consola donde se ejecutó el servicio
```

## 🐛 Troubleshooting

### Error: Puerto ya en uso
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000

# Detener el proceso o cambiar el puerto en .env
```

### Error: Redis connection failed
```bash
# Verificar que Redis esté corriendo
docker-compose ps redis

# Reiniciar Redis
docker-compose restart redis
```

### Error: Supabase connection failed
- Verificar credenciales en archivos `.env`
- Verificar que el proyecto de Supabase esté activo
- Revisar reglas de seguridad (RLS) en Supabase

### Error: Cannot find module
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado por el equipo de desarrollo de sistemas de mantenimiento.

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.

---

**Última actualización:** Enero 2026
