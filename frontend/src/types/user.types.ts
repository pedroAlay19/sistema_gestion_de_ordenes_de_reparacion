export interface User {
  id: string;
  name: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role: UserRole | string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export enum UserRole {
  USER = "User",
  TECHNICIAN = "Technician",
  ADMIN = "Admin"
}

export interface UsersOverview {
  totalClients: number;
  totalTechnicians: number;
  totalActiveTechnicians: number;
}