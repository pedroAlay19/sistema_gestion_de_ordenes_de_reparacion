import { useState, useEffect, type ReactNode } from 'react';
import { auth, authHelpers } from '../api';
import { AuthContext } from './authContextInstance';
import type { UserProfile } from '../types/user.types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar, revisar si hay token guardado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authHelpers.getAccessToken();
        if (token) {
          const response = await auth.getProfile();
          // Crear un UserProfile a partir del AuthUser
          const userProfile: UserProfile = {
            id: response.user.id,
            userId: response.user.id,
            role: response.user.role,
            email: response.user.email,
          };
          setUser(userProfile);
        }
      } catch {
        authHelpers.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const signIn = async (email: string, password: string): Promise<UserProfile> => {
    console.log("🔐 Iniciando login...");
    const response = await auth.login({ email, password });
    
    // Guardar tokens
    authHelpers.saveTokens(response.accessToken, response.refreshToken);
    console.log("💾 Tokens guardados en localStorage");
    
    // Decodificar y mostrar info del token
    const tokenPayload = JSON.parse(atob(response.accessToken.split('.')[1]));
    const expiresIn = tokenPayload.exp - Date.now() / 1000;
    console.log(`⏰ Access token expira en ${Math.floor(expiresIn / 60)} minutos`);
    
    // Importar users API para obtener el perfil completo (incluye isEvaluator para técnicos)
    const { users } = await import('../api');
    const userProfile = await users.getMyProfile();
    console.log("👤 Perfil completo obtenido:", userProfile);
    
    setUser(userProfile);
    
    return userProfile;
  };

  // Registro (auth-service ahora también maneja name)
  const signUp = async (name: string, email: string, password: string) => {
    console.log("📝 Iniciando registro...");
    const response = await auth.register({ name, email, password });
    console.log("✅ Usuario registrado:", response.user);
    // No hacemos login automático para dar tiempo a la sincronización
  };

  // Logout
  const signOut = async () => {
    console.log("🚪 Cerrando sesión...");
    try {
      // Llamar al endpoint de logout del backend
      await auth.logout();
      console.log("✅ Logout exitoso en el servidor");
    } catch (error) {
      console.error("❌ Error al hacer logout en el servidor:", error);
    } finally {
      // Siempre limpiar tokens y estado local
      authHelpers.clearTokens();
      setUser(null);
      console.log("🧹 Tokens eliminados y estado limpiado");
    }
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
