import { http } from './http';
import type { RepairOrder } from '../types';

export interface CreateRepairOrderDto {
  equipmentId: string;
  problemDescription: string;
  imageUrls?: string[];
}

export const repairOrders = {
  getAll: () => http.get<RepairOrder[]>('/repair-orders', true),
  
  getById: (id: string) =>
    http.get<RepairOrder>(`/repair-orders/${id}`, true),
  
  create: (data: CreateRepairOrderDto) =>
    http.post<RepairOrder>('/repair-orders', data, true),
};
