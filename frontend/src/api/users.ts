import { http } from "./http";
import type { Technician } from "../types/technician.types";
import type { UserProfile, UpdateProfileDto, UsersOverview } from "../types/user.types";

export const users = {
  // GET /users - Obtener todos los usuarios (solo ADMIN)
  findUsers: () => http.get<UserProfile[]>("/users", true),

  // GET /users/technician - Obtener todos los técnicos (ADMIN y TECHNICIAN)
  findTechnicians: () => http.get<Technician[]>("/users/technician", true),

  // GET /users/profile/me - Obtener mi perfil (USER, ADMIN, TECHNICIAN)
  getMyProfile: () => http.get<UserProfile>("/users/profile/me", true),

  // GET /users/:id - Obtener un usuario específico (solo ADMIN)
  findOne: (id: string) => http.get<UserProfile>(`/users/${id}`, true),

  // PATCH /users/profile - Actualizar perfil de usuario (solo USER)
  updateUserProfile: (data: UpdateProfileDto) =>
    http.patch<UserProfile>("/users/profile", data, true),

  // PATCH /users/technician/profile - Actualizar perfil de técnico (solo TECHNICIAN)
  updateTechnicianProfile: (data: UpdateProfileDto) =>
    http.patch<Technician>("/users/technician/profile", data, true),

  // GET /users/stats/overview - Obtener resumen de usuarios (solo ADMIN)
  getUsersOverview: () => http.get<UsersOverview>("/users/stats/overview", true),
};
