import { http } from './http';

export interface SparePart {
  id: string;
  name: string;
  description: string;
  stock: number;
  unitPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export const spareParts = {
  getAll: () => http.get<SparePart[]>('/spare-parts', true),
  getById: (id: string) => http.get<SparePart>(`/spare-parts/${id}`, true),
};
