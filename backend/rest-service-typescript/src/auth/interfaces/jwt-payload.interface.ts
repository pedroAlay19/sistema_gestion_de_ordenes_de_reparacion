import { UserRole } from "src/users/entities/enums/user-role.enum";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
