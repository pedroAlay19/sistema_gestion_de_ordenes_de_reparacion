export enum ServiceType {
  REPAIR = "REPAIR",
  MAINTENANCE = "MAINTENANCE",
  INSTALLATION = "INSTALLATION",
  DATA = "DATA",
}

export interface Service {
  id: string;
  serviceName: string;
  description: string;
  basePrice: number;
  estimatedTimeMinutes?: number;
  requiresParts?: boolean;
  type: ServiceType;
  imageUrls?: string[];
  active?: boolean;
  notes?: string;
}

export interface CreateMaintenanceServiceDto {
  serviceName: string;
  description: string;
  basePrice: number;
  estimatedTimeMinutes?: number;
  requiresParts?: boolean;
  type: ServiceType;
  imageUrls?: string[];
  active?: boolean;
  notes?: string;
}

export interface UpdateMaintenanceServiceDto {
  serviceName?: string;
  description?: string;
  basePrice?: number;
  estimatedTimeMinutes?: number;
  requiresParts?: boolean;
  type?: ServiceType;
  imageUrls?: string[];
  active?: boolean;
  notes?: string;
}
