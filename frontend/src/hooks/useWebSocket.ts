import { useEffect, useRef, useCallback } from "react";

// WebSocket message structure from Go server
interface DashboardUpdateMessage {
  event: string;
  data: Record<string, any>;
  timestamp: string;
}

interface UseWebSocketOptions {
  onDashboardUpdate?: (message: DashboardUpdateMessage) => void;
  autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { onDashboardUpdate, autoConnect = true } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    // Si ya hay una conexión abierta, conectando, o en proceso, no crear otra
    if (isConnectingRef.current) {
      console.log("Connection already in progress, skipping...");
      return;
    }
    
    if (wsRef.current?.readyState === WebSocket.OPEN || 
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    try {
      isConnectingRef.current = true;
      const ws = new WebSocket("ws://localhost:8081/ws");

      ws.onopen = () => {
        console.log("WebSocket connected to dashboard server");
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
      };

      ws.onmessage = (event) => {
        try {
          const message: DashboardUpdateMessage = JSON.parse(event.data);
          console.log(`Dashboard update [${message.event}]:`, Object.keys(message.data));

          if (onDashboardUpdate) {
            onDashboardUpdate(message);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket connection error. Make sure Go server is running on port 8081", error);
        isConnectingRef.current = false;
      };

      ws.onclose = (event) => {
        console.log("🔌 WebSocket disconnected", event.code, event.reason);
        wsRef.current = null;
        isConnectingRef.current = false;

        // Solo reintentar si no fue cierre limpio y no hemos excedido intentos
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            10000  // Max 10 segundos
          );
          console.log(
            `Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.log("WebSocket reconnection failed. Dashboard will work without real-time updates.");
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      console.log("Dashboard will work without real-time updates");
      isConnectingRef.current = false;
    }
  }, [onDashboardUpdate]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      // Pequeño delay para evitar múltiples conexiones simultáneas
      const timer = setTimeout(() => {
        connect();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        disconnect();
      };
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    connect,
    disconnect,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
};
