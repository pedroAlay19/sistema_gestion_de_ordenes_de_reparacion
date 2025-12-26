import type { RepairOrder } from "./repair-order.types";
import type { Service } from "./service.types";
import type { Technician } from "./technician.types";

// Estados de servicios individuales dentro de una orden
export enum TicketServiceStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

export interface CreateRepairOrderDetailDto {
  serviceId: string;
  technicianId: string;
  notes?: string;
}

export interface UpdateDetailStatusDto {
  status: TicketServiceStatus;
  notes?: string;
}

// Detalle de servicio asignado a un técnico dentro de una orden
export interface RepairOrderDetail {
  id: string;
  service: Service;
  technician: Technician;
  repairPrice: number;
  repairOrder: RepairOrder
  status: TicketServiceStatus;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}