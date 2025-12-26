import type { CreateUserDto, UpdateUserDto, User } from "./user.types";

export interface Technician extends User {
  specialty: string;
  isEvaluator: boolean;
  active: boolean;
}

export interface CreateTechnicianDto extends CreateUserDto {
  specialty: string;
  isEvaluator?: boolean;
  active?: boolean;
}

export interface UpdateTechnicianDto extends UpdateUserDto {
  specialty?: string;
  active?: boolean;
  isEvaluator?: boolean;
}