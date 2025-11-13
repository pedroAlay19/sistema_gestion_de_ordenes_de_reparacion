import type { JSX } from "react";

// Estados principales de la orden de reparación
export enum OrderRepairStatus {
  IN_REVIEW = "IN_REVIEW",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  REJECTED = "REJECTED",
  IN_REPAIR = "IN_REPAIR",
  WAITING_PARTS = "WAITING_PARTS",
  READY = "READY",
  DELIVERED = "DELIVERED"
}

// Estados de servicios individuales dentro de una orden
export enum TicketServiceStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

// Estados de notificaciones
export enum NotificationStatus {
  SENT = "SENT",
  READ = "READ"
}

// Usuario básico (para relaciones)
export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
}

// Técnico (hereda de User)
export interface Technician extends User {
  specialty: string;
  experienceYears: number;
  active: boolean;
}

// Servicio de mantenimiento
export interface MaintenanceService {
  id: string;
  serviceName: string;
  description: string;
  basePrice: number;
  estimatedTimeMinutes?: number;
  requiresParts?: boolean;
  type: string;
  imageUrls?: string[];
  active?: boolean;
  notes?: string;
}

// Detalle de servicio asignado a un técnico dentro de una orden
export interface RepairOrderDetail {
  id: string;
  service: MaintenanceService;
  technician: Technician;
  unitPrice: number;
  discount?: number;
  subTotal: number;
  status: TicketServiceStatus;
  imageUrl?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Pieza de repuesto utilizada en la orden
export interface SparePart {
  id: string;
  name: string;
  description: string;
  stock: number;
  unitPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

// Relación de pieza usada en una orden
export interface RepairOrderPart {
  id: string;
  part: SparePart;
  quantity: number;
  subTotal: number;
  imgUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Reseña de una orden de reparación
export interface RepairOrderReview {
  id: string;
  rating: number;
  comment: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Orden de reparación completa
export interface RepairOrder {
  id: string;
  diagnosis?: string;
  problemDescription: string;
  status: OrderRepairStatus;
  estimatedCost?: number;
  finalCost?: number;
  imageUrls?: string[];
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  createdAt: string;
  updatedAt: string;
  review?: RepairOrderReview;
  repairOrderDetails?: RepairOrderDetail[];
  repairOrderParts?: RepairOrderPart[];
  equipment: {
    id: string;
    name: string;
    type: string;
    brand: string;
    model: string;
    serialNumber?: string;
    user?: User;
  };
  
}


export type StepStatus = "completed" | "current" | "pending";

export interface RepairStep {
  label: string;
  icon: JSX.Element;
  status: StepStatus;
  date?: string;
  description: string;
}
