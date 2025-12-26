import type { RepairOrder } from "./repair-order.types";
import type { SparePart } from "./spare-part.types";

export interface CreateRepairOrderPartDto {
  partId: string;
  quantity: number;
}

export interface UpdateRepairOrderPartDto {
  partId?: string;
  quantity?: number;
}

// Relación de pieza usada en una orden
export interface RepairOrderPart {
  id: string;
  part: SparePart;
  quantity: number;
  repairOrder: RepairOrder;
  unitPrice: number;
  subTotal: number;
  createdAt: string;
  updatedAt: string;
}