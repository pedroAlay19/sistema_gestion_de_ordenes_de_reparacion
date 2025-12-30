import { authHttp } from "./http";
import type {
  LoginResponse,
  RegisterResponse,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  RefreshTokenResponse,
  ValidateTokenResponse,
  ProfileResponse,
  LogoutResponse,
} from "../types/auth.types";

export const auth = {
  // POST /auth/register - Registrar usuario normal
  register: (data: RegisterDto) =>
    authHttp.post<RegisterResponse>("/auth/register", data),

  // POST /auth/register/technician - Registrar técnico
  registerTechnician: (data: RegisterDto) =>
    authHttp.post<RegisterResponse>("/auth/register/technician", data),

  // POST /auth/login - Iniciar sesión
  login: (data: LoginDto) =>
    authHttp.post<LoginResponse>("/auth/login", data),

  desactivateUser: (id: string) =>
    authHttp.patch<string>(`/auth/deactivate-user/${id}`, {}),

  // POST /auth/refresh - Renovar access token
  refresh: (data: RefreshTokenDto) =>
    authHttp.post<RefreshTokenResponse>("/auth/refresh", data),

  // POST /auth/logout - Cerrar sesión (requiere autenticación)
  logout: () => authHttp.post<LogoutResponse>("/auth/logout", {}, true),

  // GET /auth/me - Obtener perfil del usuario autenticado
  getProfile: () => authHttp.get<ProfileResponse>("/auth/me", true),

  // GET /auth/validate - Validar token
  validateToken: () => authHttp.get<ValidateTokenResponse>("/auth/validate", true),
};

// Helper functions para manejo de tokens
export const authHelpers = {
  saveTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("access_token");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refresh_token");
  },

  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token");
  },
};
