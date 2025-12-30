import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../entities/enums/user-role.enum';

export class SyncUserDto {
  @IsUUID()
  @IsNotEmpty()
  authUserId: string; // ID del usuario en auth-service

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
