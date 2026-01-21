/**
 * DTOs para eventos de notificación enviados a n8n
 */

export interface RepairOrderCreatedEvent {
  orderId: string;
  equipmentId: string;
  equipmentType: string;
  equipmentBrand?: string;
  equipmentModel?: string;
  problemDescription: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  technicianName: string;
  technicianPhone?: string;
  technicianEmail: string;
  estimatedCost?: number;
  createdAt: string;
}

export interface RepairOrderStatusChangedEvent {
  orderId: string;
  equipmentType: string;
  previousStatus: string;
  newStatus: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  technicianName?: string;
  technicianPhone?: string;
  diagnosis?: string;
  estimatedCost?: number;
  finalCost?: number;
  changedAt: string;
}

export interface TechnicianTaskAssignedEvent {
  detailId: string;
  orderId: string;
  serviceName: string;
  serviceDescription?: string;
  repairPrice: number;
  technicianName: string;
  technicianPhone?: string;
  technicianEmail: string;
  equipmentType: string;
  clientName: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  assignedAt: string;
}

export interface DailySummaryEvent {
  date: string;
  totalOrders: number;
  activeOrders: number;
  completedToday: number;
  revenue: number;
  pendingTasks: number;
  adminEmail: string;
  adminPhone?: string;
}