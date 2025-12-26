import type { JSX } from "react";
import type { Equipment } from "./equipment.types";
import type { Technician } from "./technician.types";
import type { CreateRepairOrderDetailDto, RepairOrderDetail } from "./repair-order-detail.types";
import type { CreateRepairOrderPartDto, RepairOrderPart } from "./repair-order-part.types";
import type { Review } from "./review.types";

export enum OrderRepairStatus {
  IN_REVIEW = "IN_REVIEW",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  REJECTED = "REJECTED",
  IN_REPAIR = "IN_REPAIR",
  READY = "READY",
  DELIVERED = "DELIVERED"
}

export interface CreateRepairOrderDto {
  equipmentId: string;
  problemDescription: string;
  imageUrls?: string[];
}

export interface EvaluateRepairOrderDto {
  diagnosis: string;
  estimatedCost: number;
}

export interface AssignRepairWorkDto {
  details: CreateRepairOrderDetailDto[];
  parts?: CreateRepairOrderPartDto[];
}

// Orden de reparación completa
export interface RepairOrder {
  id: string;
  equipment: Equipment
  evaluatedBy: Technician;
  problemDescription: string;
  imageUrls?: string[];
  diagnosis?: string;
  estimatedCost?: number;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  status: OrderRepairStatus;
  repairOrderDetails?: RepairOrderDetail[];
  repairOrderParts?: RepairOrderPart[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string; 
}


export type StepStatus = "completed" | "current" | "pending";

export interface RepairStep {
  label: string;
  icon: JSX.Element;
  status: StepStatus;
  date?: string;
  description: string;
}

export interface OrdersOverview {
  totalOrders: number;
  activeOrders: number;
  rejectedOrders: number;
  completedOrders: number;
}

export interface RevenueStats {
  totalRevenue: number;
  averageCost: number;
  completedOrdersCount: number;
}

export interface OrdersByStatus {
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface TopServices {
  topServices: Array<{
    serviceName: string;
    count: number;
    revenue: number;
  }>;
}
