import { http } from "./http";
import type {
  SparePart,
  CreateSparePartDto,
  UpdateSparePartDto,
} from "../types/spare-part.types";

export const spareParts = {
  getAll: () => http.get<SparePart[]>("/spare-parts", true),
  getById: (id: string) => http.get<SparePart>(`/spare-parts/${id}`, true),
  create: (sparePart: CreateSparePartDto) =>
    http.post<SparePart>("/spare-parts", sparePart, true),
  update: (id: string, sparePart: UpdateSparePartDto) =>
    http.patch<SparePart>(`/spare-parts/${id}`, sparePart, true),
  delete: (id: string) => http.delete(`/spare-parts/${id}`, true),
};
