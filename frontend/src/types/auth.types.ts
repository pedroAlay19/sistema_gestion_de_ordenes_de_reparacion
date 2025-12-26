import type { User } from "./user.types";

export type { User } from "./user.types";

export interface LoginResponse {
  access_token: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}
