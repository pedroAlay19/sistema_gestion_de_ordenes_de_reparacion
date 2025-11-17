package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// Configuración del WebSocket
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Lista de clientes conectados
var clients = make(map[*websocket.Conn]bool)
var mutex = sync.Mutex{}

// URL del backend REST
const REST_API_URL = "http://localhost:3000"

// --- Event to Endpoints Mapping ---
// Mapea cada evento a los endpoints que deben actualizarse
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
	// Evento genérico: actualiza todo (fallback)
	"DASHBOARD_FULL_UPDATE": {
		"/repair-orders/stats/overview",
		"/repair-orders/stats/revenue",
		"/repair-orders/stats/by-status",
		"/repair-orders/stats/recent",
		"/repair-orders/stats/top-services",
		"/users/stats/overview",
		"/users/stats/top-clients",
		"/users/stats/top-technicians",
	},
}

// --- Estructuras para los datos del dashboard ---
type DashboardMessage struct {
	Event     string                 `json:"event"`
	Data      map[string]interface{} `json:"data"`
	Timestamp string                 `json:"timestamp"`
}

// Fetch endpoint individual
func fetchEndpoint(url string) (interface{}, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("error fetching %s: %w", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned status %d for %s", resp.StatusCode, url)
	}

	var data interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("error decoding %s: %w", url, err)
	}

	return data, nil
}

// Fetch múltiples endpoints en paralelo
func fetchEndpointsParallel(endpoints []string) map[string]interface{} {
	results := make(map[string]interface{})
	var wg sync.WaitGroup
	var resultsMutex sync.Mutex

	for _, endpoint := range endpoints {
		wg.Add(1)
		go func(ep string) {
			defer wg.Done()

			data, err := fetchEndpoint(REST_API_URL + ep)
			if err != nil {
				fmt.Printf("Error fetching %s: %v\n", ep, err)
				return
			}

			resultsMutex.Lock()
			key := getEndpointKey(ep)
			results[key] = data
			resultsMutex.Unlock()
		}(endpoint)
	}

	wg.Wait()
	return results
}

// Convierte endpoint path a key legible
func getEndpointKey(endpoint string) string {
	switch endpoint {
	case "/repair-orders/stats/overview":
		return "orders_overview"
	case "/repair-orders/stats/revenue":
		return "orders_revenue"
	case "/repair-orders/stats/by-status":
		return "orders_by_status"
	case "/repair-orders/stats/recent":
		return "orders_recent"
	case "/repair-orders/stats/top-services":
		return "orders_top_services"
	case "/repair-orders/stats/count/total":
		return "orders_count_total"
	case "/repair-orders/stats/count/active":
		return "orders_count_active"
	case "/repair-orders/stats/revenue/total":
		return "orders_revenue_total"
	case "/users/stats/overview":
		return "users_overview"
	case "/users/stats/top-clients":
		return "users_top_clients"
	case "/users/stats/top-technicians":
		return "users_top_technicians"
	case "/users/stats/count/clients":
		return "users_count_clients"
	case "/users/stats/count/technicians":
		return "users_count_technicians"
	case "/users/stats/count/active-technicians":
		return "users_count_active_technicians"
	default:
		return endpoint
	}
}

// Fetch y broadcast selectivo basado en evento
func fetchAndBroadcastSelective(eventType string) {
	endpoints, exists := eventToEndpoints[eventType]
	if !exists {
		fmt.Printf("Unknown event type: %s, fetching full dashboard\n", eventType)
		endpoints = eventToEndpoints["DASHBOARD_FULL_UPDATE"]
	}

	fmt.Printf("Event: %s -> Fetching %d endpoints\n", eventType, len(endpoints))

	// Fetch en paralelo solo los endpoints necesarios
	data := fetchEndpointsParallel(endpoints)

	if len(data) == 0 {
		fmt.Println("No data fetched, skipping broadcast")
		return
	}

	message := DashboardMessage{
		Event:     eventType,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	jsonData, err := json.Marshal(message)
	if err != nil {
		fmt.Println("Error marshaling data:", err)
		return
	}

	Broadcast(string(jsonData))
	fmt.Printf("Broadcasted %d metrics to all clients\n", len(data))
}

// Maneja las conexiones WS desde el frontend
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

	// El cliente cargará datos iniciales desde REST API directamente
	// NO enviar dashboard completo al conectar

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

// --- Envía un mensaje a todos los clientes conectados ---
func Broadcast(message string) {
	mutex.Lock()
	defer mutex.Unlock()

	for conn := range clients {
		err := conn.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			fmt.Println("Error al enviar mensaje:", err)
			conn.Close()
			delete(clients, conn)
		}
	}
}

// Endpoint que recibe notificaciones desde NestJS por HTTP
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

	fmt.Printf("Notification received: %s (ID: %s)\n", eventType, resourceID)

	// Actualización selectiva basada en el evento
	go fetchAndBroadcastSelective(eventType)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Notificación recibida: %s", eventType)))
}

// Health check endpoint
func handleHealth(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"status":    "ok",
		"timestamp": time.Now().Format(time.RFC3339),
		"clients":   len(clients),
		"events":    len(eventToEndpoints),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Iniciar las rutas y el servidor
func main() {
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/notify", handleNotify)
	http.HandleFunc("/health", handleHealth)

	fmt.Println("Servidor escuchando en: http://localhost:8081")
	fmt.Println("")
	fmt.Println("Rutas disponibles:")
	fmt.Println("/ws       - WebSocket connection (frontend)")
	fmt.Println("/notify   - HTTP POST notifications (NestJS)")
	fmt.Println("/health   - Health check status")
	fmt.Println("Event types configured:", len(eventToEndpoints))
	fmt.Println("Waiting for connections...")

	if err := http.ListenAndServe(":8081", nil); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}
