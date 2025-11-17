import type { User } from "./repair-order.types";

export enum EquipmentType {
  PC = "PC",
  LAPTOP = "LAPTOP",
  CELLPHONE = "CELLPHONE",
  PRINTER = "PRINTER",
  TABLET = "TABLET",
}

export enum EquipmentStatus {
  AVAILABLE = "AVAILABLE",
  IN_REPAIR = "IN_REPAIR",
  RETIRED = "RETIRED",
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber?: string;
  observations?: string;
  createdAt: string;
  currentStatus: EquipmentStatus;
  user: User;
}

export interface EquipmentFormData {
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber?: string;
}
