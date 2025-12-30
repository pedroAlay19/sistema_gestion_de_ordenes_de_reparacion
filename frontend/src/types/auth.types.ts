import type { UserProfile } from "./user.types";

export enum UserRole {
  USER = "User",
  TECHNICIAN = "Technician",
  ADMIN = "Admin",
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  payload?: JwtPayload;
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
  jti?: string;
  iat?: number;
  exp?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileResponse {
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
