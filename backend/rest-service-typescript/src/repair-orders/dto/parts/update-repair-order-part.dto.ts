import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairOrderPartDto } from './create-repair-order-part.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateRepairOrderPartDto extends PartialType(CreateRepairOrderPartDto) {
  @IsOptional()
  @IsUUID()
  id?: string;
}