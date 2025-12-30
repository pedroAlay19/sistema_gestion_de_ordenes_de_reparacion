export const AUTH_SERVICE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:3001";

export const REST_SERVICE_URL =
  import.meta.env.VITE_REST_SERVICE_URL || "http://localhost:3000";

// Variable para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Función para decodificar JWT y obtener información
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Función para verificar si el token está por expirar
// Backend: Access token dura 15 minutos, refrescamos cuando quedan menos de 2 minutos
const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const now = Date.now() / 1000;
  const timeUntilExpiry = decoded.exp - now;
  const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
  const secondsRemaining = Math.floor(timeUntilExpiry);
  
  console.log(`⏰ Access token expira en ${minutesUntilExpiry}m ${secondsRemaining % 60}s`);
  
  // Refrescar cuando queden menos de 2 minutos (120 segundos)
  // Access token dura 15min, así que refrescamos en el minuto 13
  return timeUntilExpiry < 120;
};

// Función para refrescar el token
const refreshAccessToken = async (): Promise<string> => {
  // Si ya hay un refresh en progreso, retornar la promesa existente
  if (isRefreshing && refreshPromise) {
    console.log("🔄 Refresh ya en progreso, esperando...");
    return refreshPromise;
  }

  isRefreshing = true;
  console.log("🔄 Iniciando refresh de token...");

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (!refreshToken) {
        console.error("❌ No hay refresh token disponible");
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${AUTH_SERVICE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.error("❌ Error al refrescar token:", response.status);
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      // Guardar el nuevo token
      localStorage.setItem("access_token", newAccessToken);
      
      // Log información del nuevo token
      const decoded = decodeToken(newAccessToken);
      if (decoded?.exp) {
        const timeUntilExpiry = decoded.exp - Date.now() / 1000;
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
        console.log(`✅ Token refrescado exitosamente. Nuevo token expira en ${minutesUntilExpiry} minutos (15min desde ahora)`);
      }

      return newAccessToken;
    } catch (error) {
      console.error("❌ Error crítico al refrescar token:", error);
      // Limpiar tokens y redirigir al login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/auth/signin";
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Utilidad para obtener headers con token
const getAuthHeaders = async (): Promise<HeadersInit> => {
  let token = localStorage.getItem("access_token");
  
  // Verificar si el token necesita ser refrescado
  if (token && isTokenExpiringSoon(token)) {
    console.log("🔄 Token expirando pronto (quedan menos de 2 minutos), refrescando...");
    token = await refreshAccessToken();
  }
  
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Manejo de errores
const handleResponse = async <T>(response: Response, authenticated: boolean): Promise<T> => {
  // Si es 401 y estamos autenticados, intentar refresh
  if (response.status === 401 && authenticated) {
    console.warn("⚠️ Token inválido (401), intentando refresh...");
    try {
      await refreshAccessToken();
      console.log("✅ Token refrescado después de 401, reintenta la petición");
      // La petición debe ser reintentada por el llamador
      throw new Error("TOKEN_REFRESHED");
    } catch (error) {
      console.error("❌ No se pudo refrescar el token después de 401");
    }
  }

  if (!response.ok) {
    let errorDetail;
    try {
      errorDetail = await response.json();
      console.error("❌ Error del servidor:", errorDetail);
    } catch {
      errorDetail = { message: (await response.text()) || "Error desconocido" };
      console.error("❌ Error (texto):", errorDetail.message);
    }

    throw new Error(
      errorDetail.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  // Manejar respuestas vacías (common en DELETE)
  const text = await response.text();
  if (!text || text.trim() === "") {
    console.log("✅ Respuesta exitosa (sin contenido)");
    return {} as T;
  }

  const result = JSON.parse(text);
  console.log("✅ Respuesta exitosa:", result);
  return result;
};

// Función genérica para hacer peticiones HTTP
const request = async <T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit,
  authenticated: boolean,
  retryCount = 0
): Promise<T> => {
  const headers = authenticated
    ? await getAuthHeaders()
    : { "Content-Type": "application/json" };

  const url = `${baseUrl}${endpoint}`;
  
  if (options.method && options.method !== "GET") {
    console.log(`🌐 ${options.method} ${url}`);
  }
  
  const response = await fetch(url, { ...options, headers });

  try {
    return await handleResponse<T>(response, authenticated);
  } catch (error) {
    // Si el error es TOKEN_REFRESHED y no hemos reintentado, reintentar una vez
    if (error instanceof Error && error.message === "TOKEN_REFRESHED" && retryCount === 0) {
      console.log("🔄 Reintentando petición con nuevo token...");
      return request<T>(baseUrl, endpoint, options, authenticated, retryCount + 1);
    }
    throw error;
  }
};

// Cliente HTTP para REST service (default)
export const http = {
  async get<T>(endpoint: string, authenticated = false): Promise<T> {
    return request<T>(
      REST_SERVICE_URL,
      endpoint,
      { method: "GET" },
      authenticated
    );
  },

  async post<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    return request<T>(
      REST_SERVICE_URL,
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      authenticated
    );
  },

  async patch<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    return request<T>(
      REST_SERVICE_URL,
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      authenticated
    );
  },

  async put<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    return request<T>(
      REST_SERVICE_URL,
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      authenticated
    );
  },

  async delete<T>(endpoint: string, authenticated = false): Promise<T> {
    return request<T>(
      REST_SERVICE_URL,
      endpoint,
      { method: "DELETE" },
      authenticated
    );
  },
};

// Cliente HTTP específico para el servicio de autenticación
export const authHttp = {
  async get<T>(endpoint: string, authenticated = false): Promise<T> {
    return request<T>(
      AUTH_SERVICE_URL,
      endpoint,
      { method: "GET" },
      authenticated
    );
  },

  async post<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    return request<T>(
      AUTH_SERVICE_URL,
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      authenticated
    );
  },

  async patch<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    return request<T>(
      AUTH_SERVICE_URL,
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      authenticated
    );
  },

  async delete<T>(endpoint: string, authenticated = false): Promise<T> {
    return request<T>(
      AUTH_SERVICE_URL,
      endpoint,
      { method: "DELETE" },
      authenticated
    );
  },
};
