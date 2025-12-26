import { http } from "./http";
import type {
  Equipment,
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from "../types/equipment.types";

export const equipments = {
  getAll: () => http.get<Equipment[]>("/equipments", true),

  getById: (id: string) => http.get<Equipment>(`/equipments/${id}`, true),

  create: (data: CreateEquipmentDto) =>
    http.post<Equipment>("/equipments", data, true),

  update: (id: string, data: UpdateEquipmentDto) =>
    http.patch<Equipment>(`/equipments/${id}`, data, true),

  delete: (id: string) => http.delete<void>(`/equipments/${id}`, true),
};
