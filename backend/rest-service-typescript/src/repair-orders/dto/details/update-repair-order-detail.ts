import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairOrderDetailDto } from './create-repair-order-detail.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRepairOrderDetailDto extends PartialType(CreateRepairOrderDetailDto) {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsUUID()
  id?: string;
}
