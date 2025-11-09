# Frontend - Estructura del Proyecto

## 📁 Organización de Carpetas

```
src/
├── api/                    # Capa de servicios API
│   ├── config.ts          # Configuración (URLs, endpoints)
│   ├── client.ts          # Cliente HTTP reutilizable
│   ├── auth.api.ts        # API de autenticación
│   ├── equipment.api.ts   # API de equipos
│   ├── repair-order.api.ts # API de órdenes
│   ├── review.api.ts      # API de reseñas
│   ├── service.api.ts     # API de servicios
│   ├── index.ts           # Punto de entrada unificado
│   └── api.ts             # Re-export para compatibilidad
│
├── components/            # Componentes reutilizables
│   ├── Contact.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Reviews.tsx
│   ├── Services.tsx
│   └── UserSidebar.tsx
│
├── context/               # Contextos de React
│   ├── AuthContext.tsx
│   └── authContextInstance.ts
│
├── hooks/                 # Custom hooks
│   └── useAuth.ts
│
├── layouts/               # Layouts de página
│   └── UserLayout.tsx
│
├── pages/                 # Páginas de la aplicación
│   ├── LandingPage.tsx
│   ├── auth/
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   └── user/
│       ├── MyEquipments.tsx
│       ├── MyRepairOrders.tsx
│       ├── NewEquipment.tsx
│       ├── NewRepairOrder.tsx
│       ├── Notifications.tsx
│       ├── Profile.tsx
│       ├── RepairOrderDetail.tsx
│       ├── Reviews.tsx
│       └── UserDashboard.tsx
│
├── types/                 # Definiciones de tipos TypeScript
│   ├── auth.types.ts
│   ├── equipment.types.ts
│   ├── notification.types.ts
│   ├── repair-order.types.ts
│   ├── review.types.ts
│   ├── service.types.ts
│   └── index.ts           # Re-exports centralizados
│
├── App.tsx               # Componente raíz
├── main.tsx              # Punto de entrada
└── index.css             # Estilos globales
```

## 🎯 Convenciones de Código

### Importaciones

**✅ Forma recomendada (desde index):**
```typescript
import { User, Equipment, RepairOrder } from '@/types';
import { equipmentApi, repairOrderApi } from '@/api';
```

**✅ Forma alternativa (directa):**
```typescript
import type { User } from '@/types/auth.types';
import { equipmentApi } from '@/api/equipment.api';
```

**❌ Evitar:**
```typescript
// No mezclar carpetas interfaces/ y types/
import { User } from '@/interfaces/auth.types';
```

### API Calls

**✅ Usando la API modular:**
```typescript
import { equipmentApi } from '@/api';

// Obtener todos
const equipments = await equipmentApi.getAll();

// Crear uno nuevo
const newEquipment = await equipmentApi.create({
  name: 'Laptop',
  type: 'LAPTOP',
  brand: 'Dell',
  model: 'XPS 13'
});
```

**✅ Usando funciones individuales (compatibilidad):**
```typescript
import { getEquipments, createEquipment } from '@/api/api';

const equipments = await getEquipments();
const newEquipment = await createEquipment({ ... });
```

### Tipos

**✅ Definir tipos en archivos separados por dominio:**
```typescript
// types/equipment.types.ts
export interface Equipment {
  id: string;
  name: string;
  // ...
}

export enum EquipmentType {
  LAPTOP = "LAPTOP",
  DESKTOP = "DESKTOP"
}
```

**✅ Re-exportar desde index:**
```typescript
// types/index.ts
export type { Equipment } from './equipment.types';
export { EquipmentType } from './equipment.types';
```

## 🔧 Buenas Prácticas

### 1. **Separación de Responsabilidades**
- **API Layer**: Solo hace llamadas HTTP, no lógica de negocio
- **Components**: Solo renderizado y UI
- **Pages**: Orquesta componentes y datos
- **Types**: Solo definiciones de tipos

### 2. **Nomenclatura**
- **Archivos**: `kebab-case.ts` o `PascalCase.tsx`
- **Componentes**: `PascalCase`
- **Funciones/Variables**: `camelCase`
- **Tipos/Interfaces**: `PascalCase`
- **Enums**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`

### 3. **Organización de Imports**
```typescript
// 1. React/Librerías externas
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. APIs/Servicios
import { equipmentApi } from '@/api';

// 3. Tipos
import type { Equipment } from '@/types';

// 4. Componentes
import UserSidebar from '@/components/UserSidebar';

// 5. Hooks
import { useAuth } from '@/hooks/useAuth';
```

### 4. **Manejo de Errores**
```typescript
try {
  const data = await equipmentApi.getAll();
  setEquipments(data);
} catch (error) {
  console.error('Error al cargar equipos:', error);
  // Mostrar mensaje al usuario
} finally {
  setLoading(false);
}
```

## 📦 Estructura de Tipos

### Ubicación
- **`types/`**: Todos los tipos de la aplicación
- Un archivo por dominio: `auth.types.ts`, `equipment.types.ts`, etc.
- `index.ts`: Re-exports para importaciones limpias

### Nomenclatura
- **Interfaces**: `User`, `Equipment`, `RepairOrder`
- **Enums**: `EquipmentType`, `OrderRepairStatus`
- **DTOs**: `CreateEquipmentDto`, `UpdateEquipmentDto`

## 🌐 Estructura de API

### Módulos
Cada módulo de API (`*.api.ts`) contiene:
- Funciones para un dominio específico
- DTOs de entrada si son necesarios
- Documentación JSDoc
- Tipado fuerte con TypeScript

### Cliente HTTP
El `client.ts` provee:
- Métodos genéricos: `get`, `post`, `patch`, `delete`
- Manejo de headers de autenticación
- Manejo de errores unificado
- Tipado de respuestas

### Configuración
El `config.ts` centraliza:
- URL base de la API
- Endpoints como constantes
- Variables de entorno

## 🚀 Migrando Código Antiguo

### Si encuentras:
```typescript
import { Something } from '../interfaces/Something';
```

### Cámbialo a:
```typescript
import type { Something } from '../types/something.types';
// o mejor aún:
import type { Something } from '../types';
```

### Para APIs:
```typescript
// Antiguo
import { getEquipments } from '../api/api';

// Nuevo (ambas formas funcionan)
import { getEquipments } from '../api/api'; // ✅ Compatible
import { equipmentApi } from '../api'; // ✅ Recomendado
const equipments = await equipmentApi.getAll();
```

## 📝 Notas

- La carpeta `interfaces/` fue eliminada - usar solo `types/`
- `api.legacy.ts` contiene el código antiguo como referencia
- Todas las importaciones existentes siguen funcionando por compatibilidad
- Se recomienda migrar gradualmente a la nueva estructura modular
