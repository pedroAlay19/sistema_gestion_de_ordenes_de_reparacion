import type { EquipmentType } from "./equipment.types";

export interface Service {
  id: string;
  serviceName: string;
  description: string;
  basePrice: number;
  applicableEquipmentTypes: EquipmentType[]
  active: boolean;
  notes?: string;
  createdAt: Date;
}

export interface CreateMaintenanceServiceDto {
  serviceName: string;
  description: string;
  basePrice: number;
  applicableEquipmentTypes: EquipmentType[]
  notes?: string;
}

export interface UpdateMaintenanceServiceDto {
  serviceName?: string;
  description?: string;
  basePrice?: number;
  applicableEquipmentTypes?: EquipmentType[]
  notes?: string;
  active?: boolean;
}
