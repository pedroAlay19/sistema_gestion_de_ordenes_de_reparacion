import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EquipmentType } from '../entities/enums/equipment.enum';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EquipmentType)
  type: EquipmentType;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;
}
