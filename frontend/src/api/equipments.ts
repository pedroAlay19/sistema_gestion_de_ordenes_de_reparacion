import { http } from './http';
import type { Equipment } from '../types';

export interface CreateEquipmentDto {
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber?: string;
}

export type UpdateEquipmentDto = Partial<CreateEquipmentDto>;

export const equipments = {
  getAll: () => http.get<Equipment[]>('/equipments', true),
  
  create: (data: CreateEquipmentDto) =>
    http.post<Equipment>('/equipments', data, true),
  
  update: (id: string, data: UpdateEquipmentDto) =>
    http.patch<Equipment>(`/equipments/${id}`, data, true),
  
  delete: (id: string) =>
    http.delete<void>(`/equipments/${id}`, true),
};
