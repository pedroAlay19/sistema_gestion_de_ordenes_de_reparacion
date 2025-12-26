export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// Utilidad para obtener headers con token
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Manejo de errores
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorDetail;
    try {
      errorDetail = await response.json();
      console.error("Error del servidor:", errorDetail);
    } catch {
      errorDetail = { message: (await response.text()) || "Error desconocido" };
      console.error("Error (texto):", errorDetail.message);
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

// Cliente HTTP
export const http = {
  async get<T>(endpoint: string, authenticated = false): Promise<T> {
    const headers = authenticated
      ? getAuthHeaders()
      : { "Content-Type": "application/json" };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    return handleResponse<T>(response);
  },

  async post<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    const headers = authenticated
      ? getAuthHeaders()
      : { "Content-Type": "application/json" };
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`🌐 POST ${url}`);
    console.log("Headers:", headers);
    console.log("Body:", data);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    console.log(
      `📥 Response status: ${response.status} ${response.statusText}`
    );

    return handleResponse<T>(response);
  },

  async patch<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    const headers = authenticated
      ? getAuthHeaders()
      : { "Content-Type": "application/json" };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async put<T>(
    endpoint: string,
    data: unknown,
    authenticated = false
  ): Promise<T> {
    const headers = authenticated
      ? getAuthHeaders()
      : { "Content-Type": "application/json" };
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, authenticated = false): Promise<T> {
    const headers = authenticated
      ? getAuthHeaders()
      : { "Content-Type": "application/json" };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse<T>(response);
  },
};
