import { createContext } from 'react';
import type { User } from '../interfaces/auth.types';

// Tipo del contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
