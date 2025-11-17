import { http } from './http';
import type { User } from '../types';

export interface UpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const users = {
  updateProfile: (data: UpdateUserDto) =>
    http.patch<User>('/users/profile', data, true),
};
