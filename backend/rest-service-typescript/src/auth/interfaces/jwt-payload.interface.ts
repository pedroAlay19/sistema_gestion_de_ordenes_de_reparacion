import { UserRole } from "../../users/entities/enums/user-role.enum";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  jti: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}