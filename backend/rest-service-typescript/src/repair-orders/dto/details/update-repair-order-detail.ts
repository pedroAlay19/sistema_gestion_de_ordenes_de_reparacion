import { PartialType } from '@nestjs/swagger';
import { CreateRepairOrderDetailDto } from './create-repair-order-detail.dto';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateRepairOrderDetailDto extends PartialType(CreateRepairOrderDetailDto){
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsUUID()
  id: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  subtotal: number;
}
