import { http } from './http';
import type { RepairOrder } from '../types';
import { OrderRepairStatus, TicketServiceStatus } from '../types';

export interface CreateRepairOrderDto {
  equipmentId: string;
  problemDescription: string;
  imageUrls?: string[];
  diagnosis?: string;
  estimatedCost?: number;
}

export interface UpdateRepairOrderDto {
  problemDescription?: string;
  diagnosis?: string;
  estimatedCost?: number;
  finalCost?: number;
  status?: OrderRepairStatus;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  details?: UpdateRepairOrderDetailDto[];
  parts?: UpdateRepairOrderPartDto[];
}

export interface UpdateRepairOrderDetailStatusDto {
  status: TicketServiceStatus;
}

// DTOs para detalles de reparación
export interface CreateRepairOrderDetailDto {
  serviceId: string;
  technicianId: string;
  unitPrice?: number;
  discount?: number;
  notes?: string;
}

export interface UpdateRepairOrderDetailDto {
  id?: string;
  serviceId?: string;
  technicianId?: string;
  unitPrice?: number;
  discount?: number;
  notes?: string;
  status?: TicketServiceStatus;
}

// DTOs para piezas de reparación
export interface CreateRepairOrderPartDto {
  partId: string;
  quantity: number;
  imgUrl?: string;
}

export interface UpdateRepairOrderPartDto {
  id?: string;
  partId?: string;
  quantity?: number;
  imgUrl?: string;
}

export const repairOrders = {
  // Obtener todas las órdenes (filtradas por usuario en backend)
  getAll: () => http.get<RepairOrder[]>('/repair-orders', true),

  // Todas las ordenes asignadas a un tecnico evaluador
  getByEvaluator: () => http.get<RepairOrder[]>(`/repair-orders/evaluator`, true),
  
  // Obtener una orden por ID
  getById: (id: string) =>
    http.get<RepairOrder>(`/repair-orders/${id}`, true),
  
  // Crear una nueva orden
  create: (data: CreateRepairOrderDto) =>
    http.post<RepairOrder>('/repair-orders', data, true),
  
  // Actualizar una orden (diagnóstico, costo, estado, etc.)
  update: (id: string, data: UpdateRepairOrderDto) =>
    http.patch<RepairOrder>(`/repair-orders/${id}`, data, true),
  
  // Eliminar orden (solo admin)
  delete: (id: string) =>
    http.delete<void>(`/repair-orders/${id}`, true),
};
