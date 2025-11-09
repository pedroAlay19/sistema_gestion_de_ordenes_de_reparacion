# Frontend - Sistema de Gestión de Reparaciones

Sistema web moderno construido con React + TypeScript + Vite para la gestión de equipos y órdenes de reparación.

## 🚀 Tecnologías

- **React 19.1.1** - Framework UI
- **TypeScript 5.7.2** - Tipado estático
- **Vite 7.1.7** - Build tool y dev server
- **Tailwind CSS 4** - Framework CSS utility-first
- **React Router 7** - Enrutamiento
- **ESLint** - Linting

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

Ver [STRUCTURE.md](./STRUCTURE.md) para documentación detallada de la estructura.

```
src/
├── api/          # Servicios API organizados por dominio
├── components/   # Componentes reutilizables
├── context/      # Contextos de React
├── hooks/        # Custom hooks
├── layouts/      # Layouts de página
├── pages/        # Páginas de la aplicación
├── types/        # Tipos TypeScript centralizados
├── App.tsx       # Componente raíz
└── main.tsx      # Punto de entrada
```

## 🎨 Características Principales

### Para Usuarios
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de equipos (CRUD completo)
- ✅ Solicitud de reparaciones
- ✅ Seguimiento de órdenes con timeline visual
- ✅ Sistema de notificaciones
- ✅ Historial y reseñas con calificaciones
- ✅ Perfil de usuario editable

### Técnicas
- ✨ **Arquitectura modular** - APIs y tipos organizados por dominio
- 🔐 **Autenticación JWT** - Con manejo de tokens y protección de rutas
- 🎯 **TypeScript estricto** - Tipado fuerte en toda la aplicación
- 📱 **Diseño responsive** - Optimizado para móvil, tablet y desktop
- ⚡ **Performance optimizada** - Lazy loading y code splitting
- 🔄 **Estado persistente** - LocalStorage para autenticación
- 🎨 **UI/UX consistente** - Sistema de diseño unificado

## 🔧 Configuración de API

El frontend se conecta al backend REST en `http://localhost:3000` por defecto.

Para cambiar la URL base:

```bash
# Crear archivo .env
VITE_API_URL=http://tu-api.com
```

O editar directamente en `src/api/config.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:3000';
```

## 📐 Convenciones de Código

### Importaciones
```typescript
// ✅ Recomendado
import { Equipment, User } from '@/types';
import { equipmentApi } from '@/api';

// ✅ Alternativa
import type { Equipment } from '@/types/equipment.types';
import { equipmentApi } from '@/api/equipment.api';
```

### Componentes
```typescript
// Componentes funcionales con TypeScript
export default function MyComponent() {
  const [state, setState] = useState<Type>(initialValue);
  
  return <div>...</div>;
}
```

### API Calls
```typescript
// Usando API modular
import { equipmentApi } from '@/api';

const equipments = await equipmentApi.getAll();
const newEquipment = await equipmentApi.create(data);
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev                 # Servidor desarrollo (http://localhost:5173)

# Build
npm run build               # Compilar para producción
npm run preview             # Preview del build

# Linting
npm run lint                # Ejecutar ESLint
```

## 📱 Rutas de la Aplicación

### Públicas
- `/` - Landing page
- `/auth/signin` - Inicio de sesión
- `/auth/signup` - Registro

### Protegidas (requieren autenticación)
- `/user/dashboard` - Dashboard principal
- `/user/equipments` - Lista de equipos
- `/user/equipments/new` - Nuevo equipo
- `/user/repair-orders` - Lista de órdenes
- `/user/repair-orders/new` - Nueva orden
- `/user/repair-orders/:id` - Detalle de orden
- `/user/notifications` - Notificaciones
- `/user/reviews` - Historial de reseñas
- `/user/profile` - Perfil de usuario

## 🔐 Autenticación

El sistema usa JWT con las siguientes características:

- Token almacenado en `localStorage`
- Validación automática al cargar la aplicación
- Protección de rutas con `ProtectedRoute`
- Redirección automática según estado de auth
- Cierre de sesión limpia

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Negro (#000000)
- **Secundario**: Blanco (#FFFFFF)
- **Grises**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Semántica
- **Amarillo**: OPEN (solicitado)
- **Azul**: IN_PROGRESS (en proceso)
- **Morado**: RESOLVED (resuelto)
- **Verde**: CLOSED (cerrado)

### Componentes
- Cards: `rounded-2xl` con bordes sutiles
- Botones: Negro primario con hover effects
- Inputs: Borde doble con focus states
- Icons: SVG + Emojis para visual aids

## 📚 Recursos

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [STRUCTURE.md](./STRUCTURE.md) - Guía de estructura del proyecto

## 🐛 Troubleshooting

### Error de compilación
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto en uso
```bash
# Cambiar puerto en vite.config.ts
server: {
  port: 3001
}
```

### Errores de tipo
```bash
# Verificar tipos
npm run lint
```

## 📄 Licencia

Este proyecto es parte del trabajo autónomo académico.
