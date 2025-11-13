import { http } from './http';

export interface Technician {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  role: string;
  specialty: string;
  experienceYears: number;
  isEvaluator: boolean;
  active: boolean;
}

export const technicians = {
  getAll: () => http.get<Technician[]>('/users/technician', true),
};
