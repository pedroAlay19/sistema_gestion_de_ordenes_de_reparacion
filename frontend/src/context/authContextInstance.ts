import { createContext } from 'react';
import type { AuthContextType } from '../types/auth.types';

// Crear el contexto de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
