import { http } from "./http";
import type { User, CreateUserDto } from "../types/user.types";
import type { LoginResponse, SignInDto } from "../types/auth.types";

export const auth = {
  login: (email: string, password: string) =>
    http.post<LoginResponse>("/auth/login", { email, password } as SignInDto),

  register: (data: CreateUserDto) => http.post<User>("/auth/register", data),

  getProfile: async (token: string): Promise<User> => {
    const { API_BASE_URL } = await import("./http");
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Token inválido");
    return response.json();
  },
};
