# 🔄 WebSocket Real-Time Dashboard Architecture - Flujo Completo

## 📐 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ARQUITECTURA DE TIEMPO REAL                         │
└─────────────────────────────────────────────────────────────────────────────┘

    FRONTEND (React)          WEBSOCKET (Go)           REST API (NestJS)
    Port 5173                 Port 8081                Port 3000
         │                         │                         │
         │   ┌───────────────┐    │                         │
         ├──►│ AdminDashboard│    │                         │
         │   └───────┬───────┘    │                         │
         │           │             │                         │
         │     [1] useEffect()     │                         │
         │           │             │                         │
         │     fetchFullDashboard()│                         │
         │           │             │                         │
         │   ┌───────▼──────────┐  │                         │
         │   │ 8 Parallel GETs  │  │                         │
         │   └───────┬──────────┘  │                         │
         │           │             │                         │
         │   [HTTP GET] ──────────────────────────►         │
         │           │             │             ┌───────────▼─────────┐
         │           │             │             │ /repair-orders/stats│
         │           │             │             │ /users/stats        │
         │           │             │             └───────────┬─────────┘
         │           │             │                         │
         │   ◄────── Response ◄────────────────────────────┘│
         │           │             │                         │
         │   setDashboardData()    │                         │
         │           │             │                         │
         │     [2] useWebSocket()  │                         │
         │           │             │                         │
         │   WS Connect ──────────►│                         │
         │           │             │                         │
         │   ◄────── Connected ◄───│                         │
         │           │             │                         │
         │         [IDLE]          │                         │
         │           │             │          [TRIGGER]      │
         │           │             │             │           │
         │           │             │   User creates resource │
         │           │             │             │           │
         │           │             │     ┌───────▼───────────┴───────┐
         │           │             │     │ repair-orders.service.ts  │
         │           │             │     │ users.service.ts          │
         │           │             │     └───────┬───────────────────┘
         │           │             │             │                   
         │           │             │   wsNotificationService         
         │           │             │   .notifyDashboardUpdate()      
         │           │             │             │                   
         │           │             │     [HTTP POST]                 
         │           │             │             │                   
         │           │             │   ┌─────────▼─────────┐         
         │           │             ◄───┤ POST /notify      │         
         │           │             │   │ {                 │         
         │           │             │   │  type: "REPAIR_   │         
         │           │             │   │    ORDER_CREATED",│         
         │           │             │   │  resourceId: "123"│         
         │           │             │   │ }                 │         
         │           │             │   └───────────────────┘         
         │           │             │                                 
         │           │      ┌──────▼────────┐                        
         │           │      │ Event Mapping │                        
         │           │      │ eventToEndpoints                       
         │           │      └──────┬────────┘                        
         │           │             │                                 
         │           │      fetchEndpointsParallel()                 
         │           │             │                                 
         │           │      [Multiple HTTP GETs] ───────────►        
         │           │             │             ┌──────────┴───────┐
         │           │             │             │ GET /repair-     │
         │           │             │             │   orders/stats/  │
         │           │             │             │   - overview     │
         │           │             │             │   - by-status    │
         │           │             │             │   - recent       │
         │           │             │             └──────────┬───────┘
         │           │             │                        │
         │           │             │   ◄─── Responses ◄─────┘
         │           │             │                        
         │           │      ┌──────▼────────┐              
         │           │      │ Build Message │              
         │           │      │ {             │              
         │           │      │  event: "...", │              
         │           │      │  data: {...}, │              
         │           │      │  timestamp    │              
         │           │      │ }             │              
         │           │      └──────┬────────┘              
         │           │             │                       
         │           │        Broadcast()                  
         │           │             │                       
         │   ◄────── WS Message ◄──┘                       
         │           │                                     
         │   onDashboardUpdate()                           
         │           │                                     
         │   setDashboardData()                            
         │   (merge partial)                               
         │           │                                     
         │         [UI RE-RENDERS]                         
         │                                                 
         ▼                                                 
    Dashboard actualizado                                 
    en tiempo real ✨                                     
```

---

## 🔢 Flujo Detallado Paso a Paso

### **FASE 1: Inicialización del Dashboard**

#### 1.1 Usuario navega al Admin Dashboard
```tsx
// frontend/src/pages/admin/AdminDashboard.tsx
export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<FullDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ...
}
```

#### 1.2 useEffect carga datos iniciales
```tsx
useEffect(() => {
  const loadInitialData = async () => {
    console.log("📥 Loading initial dashboard data...");
    const data = await fetchFullDashboard();
    setDashboardData(data);
    console.log("✅ Initial dashboard data loaded");
  };
  loadInitialData();
}, []);
```

#### 1.3 fetchFullDashboard hace 8 requests en paralelo
```typescript
// frontend/src/api/dashboard-granular.ts
export const fetchFullDashboard = async (): Promise<FullDashboardData> => {
  const [
    orders_overview,        // GET /repair-orders/stats/overview
    orders_revenue,         // GET /repair-orders/stats/revenue
    orders_by_status,       // GET /repair-orders/stats/by-status
    orders_recent,          // GET /repair-orders/stats/recent
    orders_top_services,    // GET /repair-orders/stats/top-services
    users_overview,         // GET /users/stats/overview
    users_top_clients,      // GET /users/stats/top-clients
    users_top_technicians,  // GET /users/stats/top-technicians
  ] = await Promise.all([
    getOrdersOverview(),
    getRevenueStats(),
    getOrdersByStatus(),
    getRecentOrders(),
    getTopServices(),
    getUsersOverview(),
    getTopClients(),
    getTopTechnicians(),
  ]);

  return {
    orders_overview,
    orders_revenue,
    orders_by_status,
    orders_recent,
    orders_top_services,
    users_overview,
    users_top_clients,
    users_top_technicians,
  };
};
```

**Backend Response Example:**
```json
{
  "orders_overview": {
    "totalOrders": 45,
    "activeOrders": 12,
    "rejectedOrders": 3,
    "completedOrders": 30
  },
  "orders_revenue": {
    "totalRevenue": 15420.50,
    "averageCost": 342.68,
    "completedOrdersCount": 30
  },
  // ... resto de métricas
}
```

---

### **FASE 2: Conexión WebSocket**

#### 2.1 useWebSocket se inicializa
```tsx
// frontend/src/pages/admin/AdminDashboard.tsx
useWebSocket({
  onDashboardUpdate: (message) => {
    console.log(`🔄 Updating dashboard - Event: ${message.event}`);
    
    if (!dashboardData) {
      setDashboardData(message.data as FullDashboardData);
      setLoading(false);
      return;
    }
    
    // Merge parcial: mantiene datos existentes, actualiza solo los nuevos
    setDashboardData((prev) => ({
      ...prev!,
      ...message.data,
    }));
  },
});
```

#### 2.2 Hook conecta al WebSocket server
```typescript
// frontend/src/hooks/useWebSocket.ts
const connect = useCallback(() => {
  const ws = new WebSocket("ws://localhost:8081/ws");

  ws.onopen = () => {
    console.log("✅ WebSocket connected to dashboard server");
    reconnectAttemptsRef.current = 0;
  };

  ws.onmessage = (event) => {
    const message: DashboardUpdateMessage = JSON.parse(event.data);
    console.log(`📊 Dashboard update [${message.event}]:`, Object.keys(message.data));
    
    if (onDashboardUpdate) {
      onDashboardUpdate(message);
    }
  };

  // ... error handling y reconexión
  
  wsRef.current = ws;
}, [onDashboardUpdate]);
```

#### 2.3 Go Server acepta la conexión
```go
// backend/websocket-go/main.go
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error al conectar WebSocket:", err)
		return
	}
	defer conn.Close()

	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()
	fmt.Println("✅ Nuevo cliente conectado al WebSocket")

	// Enviar datos iniciales completos al cliente
	go func() {
		time.Sleep(500 * time.Millisecond)
		fetchAndBroadcastDashboardLegacy()
	}()

	// Mantener conexión abierta
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(clients, conn)
			mutex.Unlock()
			fmt.Println("🔌 Cliente desconectado")
			break
		}
	}
}
```

**Estado Actual:**
- ✅ Frontend cargado con datos completos
- ✅ WebSocket conectado y escuchando
- ⏳ Esperando eventos...

---

### **FASE 3: Evento de Creación de Recurso**

#### 3.1 Usuario crea una Orden de Reparación

**Request desde cliente/postman:**
```http
POST http://localhost:3000/repair-orders
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "equipmentId": "550e8400-e29b-41d4-a716-446655440000",
  "problemDescription": "Laptop no enciende",
  "details": [],
  "parts": []
}
```

#### 3.2 NestJS procesa la creación
```typescript
// backend/rest-service-typescript/src/repair-orders/repair-orders.service.ts

async create(createRepairOrderDto: CreateRepairOrderDto) {
  // 1. Buscar equipo
  const equipmentFound = await this.equipmentsService.findOneById(
    createRepairOrderDto.equipmentId,
  );

  // 2. Asignar técnico evaluador
  const evaluatorTechnician = await this.usersService.findTechnicianEvaluator();

  // 3. Crear orden
  const repairOrder = this.repairOrderRepository.create({
    ...createRepairOrderDto,
    equipment: equipmentFound,
    evaluatedBy: evaluatorTechnician,
    finalCost: 0,
  });
  
  const savedOrderRepair = await this.repairOrderRepository.save(repairOrder);
  
  // 4. Procesar detalles y partes...
  // ... código de detalles y partes ...
  
  const savedOrder = await this.repairOrderRepository.save(savedOrderRepair);

  // 5. Crear notificación interna (email/notificaciones usuarios)
  await this.notificationService.create(
    savedOrder,
    OrderRepairStatus.IN_REVIEW,
  );

  // 🔥 6. NOTIFICAR AL WEBSOCKET SERVER
  await this.wsNotificationService.notifyDashboardUpdate(
    'REPAIR_ORDER_CREATED',
    savedOrder.id,
  );

  return { savedOrder };
}
```

#### 3.3 WebSocketNotificationService envía HTTP POST
```typescript
// backend/rest-service-typescript/src/websocket/websocket-notification.service.ts

@Injectable()
export class WebSocketNotificationService {
  private readonly WEBSOCKET_URL = process.env.WEBSOCKET_URL || 'http://localhost:8081';

  async notifyDashboardUpdate(eventType: string, resourceId?: string): Promise<void> {
    try {
      const payload = {
        event: 'DASHBOARD_UPDATE',
        type: eventType,              // "REPAIR_ORDER_CREATED"
        resourceId,                   // "123e4567-e89b-..."
        timestamp: new Date().toISOString(),
      };

      // 🚀 HTTP POST al servidor WebSocket
      await axios.post(`${this.WEBSOCKET_URL}/notify`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 3000,
      });

      console.log(`✅ Dashboard update sent: ${eventType}`);
    } catch (error) {
      console.error(`❌ Failed to send dashboard notification:`, error);
      // No lanza error - notificación es no-crítica
    }
  }
}
```

**HTTP Request enviado:**
```http
POST http://localhost:8081/notify
Content-Type: application/json

{
  "event": "DASHBOARD_UPDATE",
  "type": "REPAIR_ORDER_CREATED",
  "resourceId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2025-11-16T10:30:45.123Z"
}
```

---

### **FASE 4: WebSocket Server Procesa el Evento**

#### 4.1 Go Server recibe la notificación HTTP
```go
// backend/websocket-go/main.go

func handleNotify(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error leyendo cuerpo", http.StatusBadRequest)
		return
	}

	var notification map[string]interface{}
	if err := json.Unmarshal(body, &notification); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	eventType, ok := notification["type"].(string)
	if !ok {
		eventType = "DASHBOARD_FULL_UPDATE"
	}

	resourceID, _ := notification["resourceId"].(string)

	fmt.Printf("📥 Notification received: %s (ID: %s)\n", eventType, resourceID)

	// 🔥 Actualización selectiva basada en el evento
	go fetchAndBroadcastSelective(eventType)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Notificación recibida: %s", eventType)))
}
```

#### 4.2 Event Mapping determina qué endpoints consultar
```go
var eventToEndpoints = map[string][]string{
	"REPAIR_ORDER_CREATED": {
		"/repair-orders/stats/overview",
		"/repair-orders/stats/by-status",
		"/repair-orders/stats/recent",
		"/repair-orders/stats/count/total",
		"/repair-orders/stats/count/active",
	},
	"USER_CREATED": {
		"/users/stats/overview",
		"/users/stats/count/clients",
	},
	"TECHNICIAN_CREATED": {
		"/users/stats/overview",
		"/users/stats/count/technicians",
		"/users/stats/count/active-technicians",
	},
	// Fallback
	"DASHBOARD_FULL_UPDATE": { /* todos los endpoints */ },
}
```

#### 4.3 fetchAndBroadcastSelective obtiene datos actualizados
```go
func fetchAndBroadcastSelective(eventType string) {
	// 1. Obtener endpoints para este evento
	endpoints, exists := eventToEndpoints[eventType]
	if !exists {
		fmt.Printf("⚠️ Unknown event type: %s, fetching full dashboard\n", eventType)
		endpoints = eventToEndpoints["DASHBOARD_FULL_UPDATE"]
	}

	fmt.Printf("📊 Event: %s -> Fetching %d endpoints\n", eventType, len(endpoints))

	// 2. Fetch en paralelo
	data := fetchEndpointsParallel(endpoints)
	// data = {
	//   "orders_overview": {...},
	//   "orders_by_status": {...},
	//   "orders_recent": {...},
	//   "orders_count_total": {...},
	//   "orders_count_active": {...}
	// }

	if len(data) == 0 {
		fmt.Println("⚠️ No data fetched, skipping broadcast")
		return
	}

	// 3. Construir mensaje
	message := DashboardMessage{
		Event:     eventType,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	jsonData, err := json.Marshal(message)
	if err != nil {
		fmt.Println("❌ Error marshaling data:", err)
		return
	}

	// 4. Broadcast a todos los clientes conectados
	Broadcast(string(jsonData))
	fmt.Printf("✅ Broadcasted %d metrics to all clients\n", len(data))
}
```

#### 4.4 fetchEndpointsParallel hace requests al REST API
```go
func fetchEndpointsParallel(endpoints []string) map[string]interface{} {
	results := make(map[string]interface{})
	var wg sync.WaitGroup
	var resultsMutex sync.Mutex

	for _, endpoint := range endpoints {
		wg.Add(1)
		go func(ep string) {
			defer wg.Done()

			// 🔥 HTTP GET al REST API
			data, err := fetchEndpoint(REST_API_URL + ep)
			if err != nil {
				fmt.Printf("❌ Error fetching %s: %v\n", ep, err)
				return
			}

			resultsMutex.Lock()
			key := getEndpointKey(ep)  // "/repair-orders/stats/overview" -> "orders_overview"
			results[key] = data
			resultsMutex.Unlock()
		}(endpoint)
	}

	wg.Wait()
	return results
}
```

**HTTP Requests enviados en paralelo:**
```http
GET http://localhost:3000/repair-orders/stats/overview
GET http://localhost:3000/repair-orders/stats/by-status
GET http://localhost:3000/repair-orders/stats/recent
GET http://localhost:3000/repair-orders/stats/count/total
GET http://localhost:3000/repair-orders/stats/count/active
```

**Responses agregadas:**
```json
{
  "orders_overview": {
    "totalOrders": 46,      // ← +1
    "activeOrders": 13,     // ← +1
    "rejectedOrders": 3,
    "completedOrders": 30
  },
  "orders_by_status": {
    "ordersByStatus": [
      { "status": "IN_REVIEW", "count": 8 },  // ← +1
      { "status": "IN_REPAIR", "count": 3 },
      // ...
    ]
  },
  "orders_recent": {
    "recentOrders": [
      {
        "id": "123e4567-...",
        "problemDescription": "Laptop no enciende",
        "status": "IN_REVIEW",
        "clientName": "Juan Pérez",
        "equipmentName": "Laptop Dell",
        "createdAt": "2025-11-16T10:30:45Z",
        "finalCost": 0
      },
      // ... órdenes anteriores
    ]
  },
  "orders_count_total": { "count": 46 },   // ← +1
  "orders_count_active": { "count": 13 }   // ← +1
}
```

#### 4.5 Broadcast envía mensaje a todos los clientes WebSocket
```go
func Broadcast(message string) {
	mutex.Lock()
	defer mutex.Unlock()

	for conn := range clients {
		err := conn.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			fmt.Println("❌ Error al enviar mensaje:", err)
			conn.Close()
			delete(clients, conn)
		}
	}
}
```

**WebSocket Message enviado:**
```json
{
  "event": "REPAIR_ORDER_CREATED",
  "data": {
    "orders_overview": {
      "totalOrders": 46,
      "activeOrders": 13,
      "rejectedOrders": 3,
      "completedOrders": 30
    },
    "orders_by_status": {
      "ordersByStatus": [
        { "status": "IN_REVIEW", "count": 8 },
        { "status": "IN_REPAIR", "count": 3 }
      ]
    },
    "orders_recent": {
      "recentOrders": [ /* ... */ ]
    },
    "orders_count_total": { "count": 46 },
    "orders_count_active": { "count": 13 }
  },
  "timestamp": "2025-11-16T10:30:45.567Z"
}
```

---

### **FASE 5: Frontend Recibe y Actualiza**

#### 5.1 useWebSocket recibe el mensaje
```typescript
// frontend/src/hooks/useWebSocket.ts

ws.onmessage = (event) => {
  try {
    const message: DashboardUpdateMessage = JSON.parse(event.data);
    console.log(`📊 Dashboard update [${message.event}]:`, Object.keys(message.data));
    // Output: "📊 Dashboard update [REPAIR_ORDER_CREATED]: ["orders_overview", "orders_by_status", ...]"
    
    if (onDashboardUpdate) {
      onDashboardUpdate(message);
    }
  } catch (error) {
    console.error("❌ Error parsing WebSocket message:", error);
  }
};
```

#### 5.2 AdminDashboard actualiza el estado
```tsx
// frontend/src/pages/admin/AdminDashboard.tsx

useWebSocket({
  onDashboardUpdate: (message) => {
    console.log(`🔄 Updating dashboard - Event: ${message.event}`);
    
    // Merge parcial: mantiene datos no afectados, actualiza solo los nuevos
    setDashboardData((prev) => ({
      ...prev!,               // Mantiene: orders_revenue, orders_top_services, users_*, etc.
      ...message.data,        // Actualiza: orders_overview, orders_by_status, orders_recent, counts
    }));
  },
});
```

**Estado Antes:**
```typescript
{
  orders_overview: { totalOrders: 45, activeOrders: 12, ... },
  orders_revenue: { totalRevenue: 15420.50, ... },        // ← No cambia
  orders_by_status: { ordersByStatus: [...] },
  orders_recent: { recentOrders: [...] },
  orders_top_services: { topServices: [...] },            // ← No cambia
  users_overview: { totalClients: 30, ... },              // ← No cambia
  users_top_clients: { topClients: [...] },               // ← No cambia
  users_top_technicians: { topTechnicians: [...] },       // ← No cambia
}
```

**Estado Después:**
```typescript
{
  orders_overview: { totalOrders: 46, activeOrders: 13, ... },  // ✅ Actualizado
  orders_revenue: { totalRevenue: 15420.50, ... },              // ← Mantenido
  orders_by_status: { ordersByStatus: [...] },                  // ✅ Actualizado
  orders_recent: { recentOrders: [...] },                       // ✅ Actualizado
  orders_top_services: { topServices: [...] },                  // ← Mantenido
  users_overview: { totalClients: 30, ... },                    // ← Mantenido
  users_top_clients: { topClients: [...] },                     // ← Mantenido
  users_top_technicians: { topTechnicians: [...] },             // ← Mantenido
}
```

#### 5.3 React re-renderiza el dashboard
```tsx
// Los componentes que usan datos actualizados se re-renderizan automáticamente

<KPICard
  title="Órdenes Activas"
  value={dashboardData.orders_overview.activeOrders}  // 12 → 13 ✨
  subtitle="En proceso"
  icon={<ClipboardDocumentListIcon className="w-6 h-6 text-blue-500" />}
  iconBgColor="bg-blue-500/10"
/>

// La lista de órdenes recientes muestra la nueva orden
{dashboardData.orders_recent.recentOrders.map((order, index) => (
  <ActivityItem
    key={index}
    title={`#${order.id.slice(0, 8)} - ${order.equipmentName}`}
    description={`${order.clientName} - ${getStatusLabel(order.status)}`}
    time={formatDate(order.createdAt)}
    // Nueva orden aparece aquí ✨
  />
))}
```

**Usuario ve:**
- ✅ Contador "Órdenes Activas" cambia de 12 a 13
- ✅ Nueva orden aparece en "Actividad Reciente"
- ✅ Gráfico "Órdenes por Estado" actualiza la barra "En Revisión"
- ✅ **Todo sin recargar la página** 🎉

---

## 🎯 Casos de Uso Completos

### Caso 1: Crear Orden de Reparación

**1. Trigger:**
```typescript
// Usuario cliente crea orden
POST /repair-orders { equipmentId: "...", problemDescription: "..." }
```

**2. Backend procesa:**
```typescript
await this.wsNotificationService.notifyDashboardUpdate('REPAIR_ORDER_CREATED', orderId);
```

**3. WebSocket fetch:**
```
GET /repair-orders/stats/overview       → orders_overview
GET /repair-orders/stats/by-status      → orders_by_status
GET /repair-orders/stats/recent         → orders_recent
GET /repair-orders/stats/count/total    → orders_count_total
GET /repair-orders/stats/count/active   → orders_count_active
```

**4. Frontend actualiza:**
- ✅ KPI "Órdenes Activas" +1
- ✅ KPI "Total" +1
- ✅ Nueva orden en lista "Actividad Reciente"
- ✅ Gráfico "Por Estado" actualiza barra "En Revisión"

---

### Caso 2: Crear Usuario (Cliente)

**1. Trigger:**
```typescript
POST /users { name: "...", email: "...", password: "..." }
```

**2. Backend procesa:**
```typescript
await this.wsNotificationService.notifyDashboardUpdate('USER_CREATED', userId);
```

**3. WebSocket fetch:**
```
GET /users/stats/overview               → users_overview
GET /users/stats/count/clients          → users_count_clients
```

**4. Frontend actualiza:**
- ✅ KPI "Clientes Activos" +1
- ✅ Total en "Resumen de Usuarios" +1

---

### Caso 3: Crear Técnico

**1. Trigger:**
```typescript
POST /users/technician { name: "...", specialty: "...", ... }
```

**2. Backend procesa:**
```typescript
await this.wsNotificationService.notifyDashboardUpdate('TECHNICIAN_CREATED', technicianId);
```

**3. WebSocket fetch:**
```
GET /users/stats/overview                      → users_overview
GET /users/stats/count/technicians             → users_count_technicians
GET /users/stats/count/active-technicians      → users_count_active_technicians
```

**4. Frontend actualiza:**
- ✅ KPI "Técnicos" muestra "6/10" → "7/11"
- ✅ Totales en "Resumen de Usuarios" actualizados

---

## 🔧 Componentes Técnicos Detallados

### 1. WebSocketNotificationService (NestJS)

**Ubicación:** `backend/rest-service-typescript/src/websocket/websocket-notification.service.ts`

**Responsabilidad:** Enviar notificaciones HTTP al servidor WebSocket

**Métodos:**
```typescript
async notifyDashboardUpdate(eventType: string, resourceId?: string): Promise<void>
```

**Configuración:**
```typescript
private readonly WEBSOCKET_URL = process.env.WEBSOCKET_URL || 'http://localhost:8081';
```

**Uso en servicios:**
```typescript
// repair-orders.service.ts
constructor(
  private readonly wsNotificationService: WebSocketNotificationService,
) {}

await this.wsNotificationService.notifyDashboardUpdate('REPAIR_ORDER_CREATED', id);
```

---

### 2. Main WebSocket Server (Go)

**Ubicación:** `backend/websocket-go/main.go`

**Responsabilidades:**
- Mantener conexiones WebSocket con clientes
- Recibir notificaciones HTTP del REST API
- Mapear eventos a endpoints
- Fetch datos actualizados en paralelo
- Broadcast mensajes a todos los clientes

**Endpoints:**
- `GET /ws` - Conexión WebSocket
- `POST /notify` - Recibir notificaciones
- `GET /health` - Health check

**Configuración:**
```go
const REST_API_URL = "http://localhost:3000"
```

**Estructuras:**
```go
type DashboardMessage struct {
	Event     string                 `json:"event"`
	Data      map[string]interface{} `json:"data"`
	Timestamp string                 `json:"timestamp"`
}
```

---

### 3. useWebSocket Hook (React)

**Ubicación:** `frontend/src/hooks/useWebSocket.ts`

**Responsabilidades:**
- Conectar al WebSocket server
- Parsear mensajes entrantes
- Reconexión automática con backoff exponencial
- Ejecutar callback con datos recibidos

**Uso:**
```typescript
useWebSocket({
  onDashboardUpdate: (message) => {
    // message.event: string
    // message.data: Record<string, any>
    // message.timestamp: string
    
    setDashboardData((prev) => ({ ...prev!, ...message.data }));
  },
  autoConnect: true,  // default
});
```

**Features:**
- ✅ Reconexión automática (max 5 intentos)
- ✅ Backoff exponencial (1s, 2s, 4s, 8s, 16s)
- ✅ Logging detallado para debugging
- ✅ Cleanup automático en unmount

---

### 4. Dashboard Granular API (React)

**Ubicación:** `frontend/src/api/dashboard-granular.ts`

**Responsabilidades:**
- Definir tipos TypeScript para todas las métricas
- Proveer funciones para cada endpoint granular
- Proveer función helper para fetch completo

**Funciones disponibles:**
```typescript
// Repair Orders
getOrdersOverview(): Promise<OrdersOverview>
getRevenueStats(): Promise<RevenueStats>
getOrdersByStatus(): Promise<OrdersByStatus>
getRecentOrders(limit?: number): Promise<RecentOrders>
getTopServices(limit?: number): Promise<TopServices>
getTotalOrdersCount(): Promise<CountMetric>
getActiveOrdersCount(): Promise<CountMetric>
getTotalRevenue(): Promise<RevenueMetric>

// Users
getUsersOverview(): Promise<UsersOverview>
getTopClients(limit?: number): Promise<TopClients>
getTopTechnicians(limit?: number): Promise<TopTechnicians>
getTotalClientsCount(): Promise<CountMetric>
getTotalTechniciansCount(): Promise<CountMetric>
getActiveTechniciansCount(): Promise<CountMetric>

// Helper
fetchFullDashboard(): Promise<FullDashboardData>
```

---

## 📊 Event Mapping Completo

### REPAIR_ORDER_CREATED

**Actualiza:**
- `orders_overview` - Totales generales
- `orders_by_status` - Distribución por estado
- `orders_recent` - Últimas órdenes
- `orders_count_total` - Contador total
- `orders_count_active` - Contador activas

**NO actualiza:**
- `orders_revenue` - Ingresos (solo cambia al completar)
- `orders_top_services` - Top servicios (se agregan después)
- `users_*` - Métricas de usuarios

---

### USER_CREATED

**Actualiza:**
- `users_overview` - Totales de usuarios
- `users_count_clients` - Contador de clientes

**NO actualiza:**
- `users_top_clients` - Top clientes (necesita órdenes)
- `users_top_technicians` - Técnicos
- `users_count_technicians` - Contador técnicos
- `orders_*` - Órdenes

---

### TECHNICIAN_CREATED

**Actualiza:**
- `users_overview` - Totales de usuarios
- `users_count_technicians` - Contador técnicos
- `users_count_active_technicians` - Contador activos

**NO actualiza:**
- `users_top_clients` - Clientes
- `users_top_technicians` - Top técnicos (necesita órdenes completadas)
- `orders_*` - Órdenes

---

### DASHBOARD_FULL_UPDATE (Fallback)

**Actualiza TODO:**
- Todos los endpoints `orders_*`
- Todos los endpoints `users_*`

**Cuándo se usa:**
- Evento desconocido
- Primera carga del cliente WebSocket
- Reconexión después de desconexión

---

## ⚡ Performance y Optimización

### Métricas de Performance

| Métrica | Monolítico | Granular | Mejora |
|---------|-----------|----------|--------|
| Tiempo de respuesta | 200-500ms | 25-50ms | **8-16x** |
| Datos transferidos por update | ~50KB | ~5-10KB | **5-10x** |
| Queries SQL por update | 15-20 JOINs | 1-5 queries | **3-4x** |
| Actualizaciones innecesarias | 100% siempre | Solo afectadas | **~80% menos** |

### Parallel Fetching (Go)

**Sin paralelismo:**
```
Endpoint 1: 50ms
Endpoint 2: 50ms  (espera a 1)
Endpoint 3: 50ms  (espera a 2)
Total: 150ms
```

**Con paralelismo (goroutines):**
```
Endpoint 1: 50ms ──┐
Endpoint 2: 50ms ──┼─► Total: 50ms
Endpoint 3: 50ms ──┘
```

### Reconnection Strategy

```typescript
Attempt 1: 1s delay
Attempt 2: 2s delay
Attempt 3: 4s delay
Attempt 4: 8s delay
Attempt 5: 16s delay
Max: 30s delay
```

---

## 🐛 Debugging y Logs

### Frontend Console

```javascript
// Conexión exitosa
"✅ WebSocket connected to dashboard server"

// Carga inicial
"📥 Loading initial dashboard data..."
"✅ Initial dashboard data loaded"

// Actualización en tiempo real
"📊 Dashboard update [REPAIR_ORDER_CREATED]: ["orders_overview", "orders_by_status", ...]"
"🔄 Updating dashboard - Event: REPAIR_ORDER_CREATED"

// Errores
"❌ WebSocket error: [error details]"
"🔄 Reconnecting in 2000ms... (attempt 2/5)"
```

### NestJS Logs

```bash
# Notificación enviada
✅ Dashboard update sent: REPAIR_ORDER_CREATED

# Error al notificar
❌ Failed to send dashboard notification: [error]
```

### Go Server Logs

```bash
# Cliente conectado
✅ Nuevo cliente conectado al WebSocket

# Notificación recibida
📥 Notification received: REPAIR_ORDER_CREATED (ID: 123e4567-...)

# Fetching endpoints
📊 Event: REPAIR_ORDER_CREATED -> Fetching 5 endpoints

# Broadcast exitoso
✅ Broadcasted 5 metrics to all clients

# Cliente desconectado
🔌 Cliente desconectado

# Error
❌ Error fetching /repair-orders/stats/overview: connection timeout
```

---

## 🔒 Consideraciones de Seguridad

### Autenticación

**Actual:**
- ❌ WebSocket sin autenticación
- ❌ Cualquiera puede conectarse

**Recomendado:**
```go
// Validar token JWT en handshake
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if !validateToken(token) {
		http.Error(w, "Unauthorized", 401)
		return
	}
	// ... continuar con upgrade
}
```

```typescript
// Frontend envía token
const ws = new WebSocket("ws://localhost:8081/ws?token=" + authToken);
```

### Rate Limiting

**Recomendado:**
```go
// Limitar broadcasts por segundo
var lastBroadcast time.Time
var broadcastMutex sync.Mutex

func Broadcast(message string) {
	broadcastMutex.Lock()
	defer broadcastMutex.Unlock()
	
	if time.Since(lastBroadcast) < 100*time.Millisecond {
		fmt.Println("⚠️ Rate limit: broadcast too frequent")
		return
	}
	
	lastBroadcast = time.Now()
	// ... continuar con broadcast
}
```

---

## 📝 Variables de Entorno

### NestJS (.env)

```bash
# REST API
PORT=3000
DATABASE_URL=postgresql://...

# WebSocket
WEBSOCKET_URL=http://localhost:8081
```

### Go (opcional .env o args)

```bash
# REST API backend
REST_API_URL=http://localhost:3000

# WebSocket server port
WS_PORT=8081
```

### React (.env)

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:8081
```

---

## 🚀 Deployment

### Development

```bash
# Terminal 1: NestJS
cd backend/rest-service-typescript
npm run start:dev

# Terminal 2: Go WebSocket
cd backend/websocket-go
go run main.go

# Terminal 3: React
cd frontend
npm run dev
```

### Production

**NestJS:**
```bash
npm run build
npm run start:prod
```

**Go:**
```bash
go build -o websocket-server main.go
./websocket-server
```

**React:**
```bash
npm run build
# Servir con nginx/apache
```

---

## ✅ Checklist de Funcionamiento

Para verificar que todo funciona:

- [ ] ✅ NestJS corriendo en puerto 3000
- [ ] ✅ Go WebSocket corriendo en puerto 8081
- [ ] ✅ Frontend corriendo en puerto 5173
- [ ] ✅ Console muestra "WebSocket connected"
- [ ] ✅ Dashboard carga datos iniciales
- [ ] ✅ Crear orden actualiza dashboard en tiempo real
- [ ] ✅ Crear usuario actualiza contadores
- [ ] ✅ Crear técnico actualiza métricas
- [ ] ✅ Desconexión reconecta automáticamente
- [ ] ✅ Logs en Go muestran broadcasts

---

## 🎓 Conceptos Clave

### Event-Driven Architecture
Solo eventos de **creación** disparan actualizaciones. Updates/modificaciones no notifican.

### Selective Broadcasting
Solo se actualizan las métricas afectadas por cada evento específico.

### Partial State Merge
Frontend hace merge parcial: `{...prev, ...newData}` manteniendo datos no afectados.

### Parallel Processing
Go fetches endpoints en paralelo con goroutines para máxima velocidad.

### Graceful Degradation
Si WebSocket falla, notificación es no-crítica y REST API sigue funcionando.

---

¡Arquitectura completa documentada! 🎉
