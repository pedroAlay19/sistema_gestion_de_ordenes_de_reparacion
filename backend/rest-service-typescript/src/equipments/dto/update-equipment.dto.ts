import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentDto } from './create-equipment.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EquipmentStatus } from '../entities/enums/equipment.enum';

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {
  @IsOptional()
  @IsEnum(EquipmentStatus)
  currentStatus?: EquipmentStatus;
}
