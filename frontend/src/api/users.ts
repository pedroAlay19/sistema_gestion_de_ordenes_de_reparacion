import { http } from "./http";
import type {
  Technician,
  CreateTechnicianDto,
  UpdateTechnicianDto,
} from "../types/technician.types";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UsersOverview,
} from "../types/user.types";

export const users = {
  createUser: (data: CreateUserDto) => http.post<User>("/users", data, true),

  createTechnician: (data: CreateTechnicianDto) =>
    http.post<Technician>("/users/technician", data, true),

  findUsers: () => http.get<User[]>("/users", true),

  findTechnicians: () => http.get<Technician[]>("/users/technician", true),

  findOne: (id: string) => http.get<User>(`/users/${id}`, true),

  updateUserProfile: (data: UpdateUserDto) =>
    http.patch<User>("/users/profile", data, true),

  updateTechnicianProfile: (data: UpdateTechnicianDto) =>
    http.patch<Technician>("/users/technician/profile", data, true),

  updateUser: (id: string, data: UpdateUserDto) =>
    http.patch<User>(`/users/${id}`, data, true),

  updateTechnician: (id: string, data: UpdateTechnicianDto) =>
    http.patch<Technician>(`/users/technician/${id}`, data, true),

  remove: (id: string) => http.delete<void>(`/users/${id}`, true),

  // Stats methods
  getUsersOverview: () =>
    http.get<UsersOverview>("/users/stats/overview", true),
};
