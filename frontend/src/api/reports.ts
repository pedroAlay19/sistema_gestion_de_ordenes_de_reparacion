const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/';

/**
 * Obtener token de autenticación desde localStorage
 */
function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No authentication token found in localStorage');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
}

/**
 * Ejecutar consulta GraphQL
 */
async function executeGraphQLQuery(query: string): Promise<any> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Asegurar que el token tenga el formato correcto
  if (token.startsWith('Bearer ')) {
    headers['Authorization'] = token;
  } else {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message || 'Error al generar el reporte');
  }

  return result.data;
}

/**
 * Generar informe PDF para un equipo específico
 * @param equipmentId - El ID del equipo
 * @returns Cadena PDF codificada en Base64
 */
export async function generateEquipmentReport(equipmentId: string): Promise<string> {
  const query = `
    query {
      equipmentReport(id: "${equipmentId}")
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.equipmentReport;
}

/**
 * Generar informe PDF para una orden de reparación específica
 * @param orderId - El ID de la orden de reparación
 * @returns Cadena PDF codificada en Base64
 */
export async function generateRepairOrderReport(orderId: string): Promise<string> {
  const query = `
    query {
      repairOrderReport(id: "${orderId}")
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.repairOrderReport;
}

/**
 * Generar informe PDF para todos los usuarios
 * @returns Cadena PDF codificada en Base64
 */
export async function generateUsersReport(): Promise<string> {
  const query = `
    query {
      usersReport
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.usersReport;
}

/**
 * Generar informe PDF para todas las piezas de repuesto
 * @returns Cadena PDF codificada en Base64
 */
export async function generateSparePartsReport(): Promise<string> {
  const query = `
    query {
      sparePartsReport
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.sparePartsReport;
}

/**
 * Generar informe PDF para el rendimiento de los técnicos
 * @returns Cadena PDF codificada en Base64
 */
export async function generateTechniciansPerformanceReport(): Promise<string> {
  const query = `
    query {
      techniciansPerformanceReport
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.techniciansPerformanceReport;
}

/**
 * Generar informe PDF para piezas de repuesto con bajo stock
 * @param threshold - Umbral de stock (por defecto: 5)
 * @returns Cadena PDF codificada en Base64
 */
export async function generateLowStockReport(threshold: number = 5): Promise<string> {
  const query = `
    query {
      sparePartsLowStockReport(threshold: ${threshold})
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.sparePartsLowStockReport;
}

/**
 * Generar informe PDF para órdenes de reparación por estado
 * @param status - Estado de la orden
 * @returns Cadena PDF codificada en Base64
 */
export async function generateRepairOrdersByStatusReport(status: string): Promise<string> {
  const query = `
    query {
      repairOrdersByStatusReport(status: "${status}")
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.repairOrdersByStatusReport;
}

/**
 * Generar informe PDF para un técnico específico
 * @param technicianId - El ID del técnico
 * @returns Cadena PDF codificada en Base64
 */
export async function generateTechnicianReport(technicianId: string): Promise<string> {
  const query = `
    query {
      technicianReport(id: "${technicianId}")
    }
  `;

  const data = await executeGraphQLQuery(query);
  return data.technicianReport;
}
