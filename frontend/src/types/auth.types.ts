export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
}

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole | string;
  createdAt: string;
  updatedAt: string;
}

export interface Technician extends User {
  specialty: string;
  experienceYears: number;
  isEvaluator: boolean;
  active: boolean;
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
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface CreateTechnicianDto extends CreateUserDto {
  specialty: string;
  experienceYears?: number;
  isEvaluator?: boolean;
  active?: boolean;
}

export interface UpdateTechnicianDto extends UpdateUserDto {
  specialty?: string;
  experienceYears?: number;
  active?: boolean;
  isEvaluator?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}
