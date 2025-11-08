import { useState, useEffect, type ReactNode } from 'react';
import { login, register, getProfile } from '../api/api';
import { AuthContext } from './authContextInstance';
import type { User } from '../interfaces/auth.types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar, revisar si hay token guardado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await getProfile(token);
          setUser(userData);
        }
      } catch {
        localStorage.removeItem('access_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    localStorage.setItem('access_token', response.access_token);
    
    const userData = await getProfile(response.access_token);
    setUser(userData);
  };

  // Registro
  const signUp = async (name: string, email: string, password: string) => {
    await register(name, email, password);
    await signIn(email, password);
  };

  // Logout
  const signOut = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
