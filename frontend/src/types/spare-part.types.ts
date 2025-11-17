export interface SparePart {
  id: string;
  name: string;
  description: string;
  stock: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSparePartDto {
  name: string;
  description: string;
  stock: number;
  unitPrice: number;
}

export interface UpdateSparePartDto {
  name?: string;
  description?: string;
  stock?: number;
  unitPrice?: number;
}
