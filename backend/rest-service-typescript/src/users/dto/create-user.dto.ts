import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

import { Transform } from "class-transformer";


export class CreateUserDto {
  @ApiProperty({
    example: 'Pedro',
    description: 'First name of the user.',
  })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'pedrocrackc@gmail.com',
    description: 'Unique email address of the user.',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  // Pueden ser opcionales
  @ApiProperty({
    example: 'Alay',
    description: 'Last name of the user.',
  })
  @IsString()
  @IsOptional()
  lastName!: string;

  @ApiProperty({
    example: '+593987654321',
    description: 'Valid Ecuadorian phone number.',
  })
  @IsOptional()
  @IsPhoneNumber('EC', { message: 'Phone must be a valid Ecuadorian number' })
  phone!: string;

  @ApiProperty({
    example: 'Quito, Ecuador',
    description: 'Residential address of the user.',
  })
  @IsString()
  @IsOptional()
  address!: string;

  
}
