import { IsUUID, IsOptional, IsNumber, IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRepairOrderDetailDto } from './details/create-repair-order-detail.dto';
import { CreateRepairOrderPartDto } from './parts/create-repair-order-part.dto';

export class CreateRepairOrderDto {
  @IsNotEmpty()
  @IsUUID()
  equipmentId: string;

  @IsNotEmpty()
  @IsString()
  problemDescription: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;
  
  @IsNotEmpty()
  @IsNumber()
  estimatedCost: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairOrderDetailDto)
  details: CreateRepairOrderDetailDto[];
  
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairOrderPartDto)
  parts: CreateRepairOrderPartDto[];

}
