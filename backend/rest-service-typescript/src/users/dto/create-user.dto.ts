import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { Transform } from "class-transformer";


export class CreateUserDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  // Pueden ser opcionales
  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
