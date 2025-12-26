import type { RepairOrder } from "./repair-order.types";
import type { User } from "./user.types";

export enum EquipmentType {
  PC = "PC",
  LAPTOP = "LAPTOP",
  ALL_IN_ONE = "ALL_IN_ONE",
  SERVER = "SERVER",
  CELLPHONE = "CELLPHONE",
  PRINTER = "PRINTER",
  SMARTWATCH = "SMARTWATCH",
  TABLET = "TABLET",
  ROUTER = "ROUTER",
  SWITCH = "SWITCH",
  WEBCAM = "WEBCAM",
  MONITOR = "MONITOR",
  KEYBOARD = "KEYBOARD",
  MOUSE = "MOUSE",
  SCAMNER = "SCANNER"
}
export enum EquipmentStatus {
  AVAILABLE = "AVAILABLE",
  IN_REPAIR = "IN_REPAIR",
  RETIRED = "RETIRED",
}

export interface CreateEquipmentDto {
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber?: string;
}

export interface UpdateEquipmentDto {
  name?: string;
  type?: EquipmentType;
  brand?: string;
  model?: string;
  serialNumber?: string;
  currentStatus?: EquipmentStatus;
}

export interface Equipment {
  id: string;
  user: User;
  name: string;
  type: EquipmentType;
  repairOrders: RepairOrder[];
  brand: string;
  model: string;
  serialNumber?: string;
  createdAt: string;
  currentStatus: EquipmentStatus;
}
