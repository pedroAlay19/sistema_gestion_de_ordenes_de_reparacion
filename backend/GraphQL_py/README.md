#  GraphQL (Strawberry - Python)

Desarrollo de GraphQL, forma parte del **backend** pero por el momento los datos son simulados de usuarios, técnicos, equipos, servicios, órdenes de reparación, repuestos y más.  
La idea es tener una API con **consultas (Query)** que nos permitan visualizar información desde diferentes módulos.  
Por ahora solo se trabaja con **consultas**, pero más adelante se implementarán las **mutations** y la **conexión con la API REST**.

No se usa base de datos real todavía, solo datos estáticos para hacer pruebas y entender cómo se estructura un servicio con **GraphQL en Python (Strawberry)**.

---

##  Estructura del proyecto

```
GraphQL-py/
│
├── app/
│   ├── users/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── technicians/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── equipments/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── maintenance_services/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── spare_parts/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── repair_order/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── repair_order_detail/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── repair_order_part/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   ├── repair_order_notification/
│   │   ├── resolvers.py
│   │   └── schema.py
│   │
│   └── repair_order_review/
│       ├── resolvers.py
│       └── schema.py
│
├── schema.py              # Archivo principal donde se combinan todos los módulos
├── requirements.txt       # Dependencias del proyecto
└── README.md
```

---

##  Cómo ejecutar el proyecto

### 1️. Clonar o abrir el proyecto  
Asegúrate de tener **Python 3.10 o superior** instalado en el equipo.

---

### 2️. Crear y activar el entorno virtual

```bash
python -m venv venv
venv\Scripts\activate   # En Windows
```

Para desactivar el entorno:
```bash
deactivate
```

---

### 3. Instalar dependencias necesarias

```bash
pip install -r requirements.txt
```

---

### 4.  Iniciar el servidor de Strawberry

```bash
strawberry dev schema
```

---

### 5️. Abrir el panel de GraphQL en el navegador

Cuando el servidor esté corriendo, abre:

```
http://localhost:8000/graphql
```

> ⚠️ Si en consola aparece `0.0.0.0:8000/graphql`, solo reemplaza por `localhost:8000/graphql`.

---

##  Contexto general

Este proyecto se hizo para **simular el funcionamiento de un módulo GraphQL** dentro de un sistema de reparación de equipos tecnológicos.  
Aquí se puede consultar información sobre **usuarios, técnicos, equipos, servicios, repuestos y órdenes de reparación**.

Todo está hecho de forma entendible, usando **Python + Strawberry**, sin conexión a base de datos real, solo con datos simulados.  
De esta forma se puede entender cómo se manejan las consultas y cómo se conectan los distintos módulos del sistema.

La meta principal fue **aprender la estructura y práctica de GraphQL**, sin entrar todavía en cosas avanzadas o configuraciones complicadas.

---

 *Desarrollado por Jordy Franco*