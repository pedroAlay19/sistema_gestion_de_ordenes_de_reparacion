import { http } from "./http";
import type {
  Service,
  CreateMaintenanceServiceDto,
  UpdateMaintenanceServiceDto,
} from "../types/service.types";

export const services = {
  getAll: () => http.get<Service[]>("/services"),

  getById: (id: string) => http.get<Service>(`/services/${id}`, true),

  getApplicableServices: (equipmentId: string) =>
    http.get<Service[]>(`/services/applicable/${equipmentId}`, true),

  create: (service: CreateMaintenanceServiceDto) =>
    http.post<Service>("/services", service, true),

  update: (id: string, service: UpdateMaintenanceServiceDto) =>
    http.patch<Service>(`/services/${id}`, service, true),
  
  delete: (id: string) => http.delete(`/services/${id}`, true),
};
