import type { UserRole } from "./auth.types";
import type { Equipment } from "./equipment.types";

export interface UserProfile {
  id: string; // ID del perfil en rest-service
  userId: string; // Referencia al ID del usuario en auth-service
  role: UserRole;
  email?: string; // Email del auth-service (opcional, para compatibilidad)
  name?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  equipments?: Equipment[];
}

export interface UpdateProfileDto {
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface UsersOverview {
  totalClients: number;
  totalTechnicians: number;
  totalActiveTechnicians: number;
}