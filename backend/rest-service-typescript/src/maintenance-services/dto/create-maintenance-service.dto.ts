import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EquipmentType } from '../../equipments/entities/enums/equipment.enum';

export class CreateMaintenanceServiceDto {
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNotEmpty({ each: true })
  @IsEnum(EquipmentType, { each: true })
  applicableEquipmentTypes: EquipmentType[];

  @IsOptional()
  @IsString()
  notes?: string;
}