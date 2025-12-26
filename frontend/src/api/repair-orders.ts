import { http } from './http';
import type { AssignRepairWorkDto, CreateRepairOrderDto, EvaluateRepairOrderDto, OrdersByStatus, OrdersOverview, RepairOrder, RevenueStats, TopServices } from '../types/repair-order.types';
import type { CreateRepairOrderDetailDto, RepairOrderDetail, UpdateDetailStatusDto } from '../types/repair-order-detail.types';
import type { CreateRepairOrderPartDto } from '../types/repair-order-part.types';

export const repairOrders = {
  // Obtener todas las órdenes (filtradas por usuario en backend)
  getAll: () => http.get<RepairOrder[]>('/repair-orders', true),

  getByEquipment: (equipmentId: string) =>
    http.get<RepairOrder[]>(`/repair-orders/equipment/${equipmentId}`, true),

  getByFinalCost: (id: string) =>
    http.get<number>(`/repair-orders/${id}/final-cost`, true),

  // Obtener una orden por ID
  getById: (id: string) =>
    http.get<RepairOrder>(`/repair-orders/${id}`, true),
  
  // Crear una nueva orden
  create: (data: CreateRepairOrderDto) =>
    http.post<RepairOrder>('/repair-orders', data, true),
  
  // Actualizar una orden
  update: (id: string, data: Partial<RepairOrder>) =>
    http.patch<RepairOrder>(`/repair-orders/${id}`, data, true),
  
  // Eliminar orden (solo admin)
  delete: (id: string) =>
    http.delete<void>(`/repair-orders/${id}`, true),

  // Flujo de estados
  // Evaluar orden (técnico evaluador)
  evaluate: (id: string, data: EvaluateRepairOrderDto) =>
    http.patch<RepairOrder>(`/repair-orders/${id}/evaluate`, data, true),

  // Aprobar evaluación (usuario)
  approve: (id: string) =>
    http.patch<RepairOrder>(`/repair-orders/${id}/approve`, {}, true),

  // Rechazar evaluación (usuario)
  reject: (id: string) =>
    http.patch<RepairOrder>(`/repair-orders/${id}/reject`, {}, true),

  // Asignar trabajo (técnico evaluador)
  assignWork: (id: string, data: AssignRepairWorkDto) =>
    http.post<RepairOrder>(`/repair-orders/${id}/assign-work`, data, true),

  // Reasignar trabajo (técnico evaluador)
  reassignWork: (id: string, data: AssignRepairWorkDto) =>
    http.put<RepairOrder>(`/repair-orders/${id}/reassign-work`, data, true),

  // Entregar orden (técnico)
  deliver: (id: string) =>
    http.patch<RepairOrder>(`/repair-orders/${id}/deliver`, {}, true),

  // Manipulación individual
  // Agregar detalle
  addDetail: (id: string, data: CreateRepairOrderDetailDto) =>
    http.post<RepairOrder>(`/repair-orders/${id}/detail`, data, true),

  // Eliminar detalle
  removeDetail: (id: string, detailId: string) =>
    http.delete<RepairOrder>(`/repair-orders/${id}/detail/${detailId}`, true),

  // Agregar pieza
  addPart: (id: string, data: CreateRepairOrderPartDto) =>
    http.post<RepairOrder>(`/repair-orders/${id}/part`, data, true),

  // Eliminar pieza
  removePart: (id: string, partId: string) =>
    http.delete<RepairOrder>(`/repair-orders/${id}/part/${partId}`, true),

  // ========== Consultas específicas ==========
  // Obtener órdenes por evaluador
  getByEvaluator: (technicianId: string) =>
    http.get<RepairOrder[]>(`/repair-orders/evaluator/${technicianId}`, true),

  // Obtener detalles de un técnico
  getMyDetails: (technicianId: string) =>
    http.get<RepairOrderDetail[]>(`/repair-orders/technician/${technicianId}/details`, true),

  // Actualizar estado de detalle
  updateDetailStatus: (detailId: string, data: UpdateDetailStatusDto) =>
    http.patch<RepairOrderDetail>(`/repair-orders/detail/${detailId}/status`, data, true),

  // Estadísticas
  getOrdersOverview: () =>
    http.get<OrdersOverview>('/repair-orders/stats/overview'),

  getRevenueStats: () =>
    http.get<RevenueStats>('/repair-orders/stats/revenue'),

  getOrdersByStatus: () =>
    http.get<OrdersByStatus>('/repair-orders/stats/by-status'),

  getTopServices: (limit: number = 5) =>
    http.get<TopServices>(`/repair-orders/stats/top-services?limit=${limit}`),
};