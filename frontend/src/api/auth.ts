import { http } from './http';
import type { User } from '../types';

interface LoginResponse {
  access_token: string;
}

export const auth = {
  login: (email: string, password: string) =>
    http.post<LoginResponse>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    http.post<User>('/auth/register', { name, email, password }),

  getProfile: async (token: string): Promise<User> => {
    const { API_BASE_URL } = await import('./http');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Token inválido');
    return response.json();
  },
};
