import axios, { AxiosInstance } from 'axios';

export class BackendClient {
  private restApi: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.restApi = axios.create({
      baseURL: process.env.REST_API_URL || 'http://localhost:3000',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Interceptor para agregar token automáticamente
    this.restApi.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  /**
   * Establecer el token de autenticación para todas las peticiones
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Limpiar el token de autenticación
   */
  clearAccessToken() {
    this.accessToken = null;
  }

  async searchEquipment(query: string) {
    try {
      const response = await this.restApi.get(`/equipments/search?q=${encodeURIComponent(query)}`);
      
      // NestJS retorna directamente el array de equipos
      return response.data || [];
    } catch (error: any) {
      // Si es 404 o 401/403, retornar array vacío
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 403) {
        console.warn(`Search equipment failed: ${error.response?.status} - ${error.response?.data?.message || 'No autorizado'}`);
        return [];
      }
      console.error('Error searching equipment:', error.message);
      throw new Error(`No se pudo buscar equipos: ${error.message}`);
    }
  }

  async getEquipmentById(id: string) {
    try {
      const response = await this.restApi.get(`/equipments/${id}`);
      return response.data; // NestJS retorna directamente el objeto
    } catch (error: any) {
      // Si es 404 o no autorizado, retornar null
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 403) {
        console.warn(`Get equipment failed: ${error.response?.status}`);
        return null;
      }
      console.error('Error getting equipment:', error.message);
      throw new Error(`No se pudo obtener el equipo: ${error.message}`);
    }
  }

  async updateEquipmentStatus(id: string, status: string) {
    try {
      const response = await this.restApi.patch(`/equipments/${id}`, {
        currentStatus: status, // El DTO espera 'currentStatus'
      });
      return response.data; // NestJS retorna directamente el objeto actualizado
    } catch (error: any) {
      console.error('Error updating equipment status:', error.message);
      throw new Error(`No se pudo actualizar el estado: ${error.message}`);
    }
  }

  async createRepairOrder(data: {
    equipmentId: string;
    problemDescription: string;
    imageUrls?: string[];
  }) {
    try {
      const response = await this.restApi.post('/repair-orders', {
        equipmentId: data.equipmentId,
        problemDescription: data.problemDescription,
        imageUrls: data?.imageUrls || [],
      });
      return response.data; // NestJS retorna directamente el objeto creado
    } catch (error: any) {
      console.error('Error creating repair order:', error.message);
      throw new Error(`No se pudo crear la orden: ${error.message}`);
    }
  }

  async getRepairOrdersByEquipment(equipmentId: string) {
    try {
      const response = await this.restApi.get(`/repair-orders/equipment/${equipmentId}`);
      return response.data || []; // NestJS retorna directamente el array

    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Get repair orders failed: No autorizado');
      } else {
        console.error('Error getting repair orders:', error.message);
      }
      return [];
    }
  }
}