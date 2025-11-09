import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateRepairOrderDetailDto } from './details/update-repair-order-detail';
import { OrderRepairStatus } from '../entities/enum/order-repair.enum';
import { UpdateRepairOrderPartDto } from './parts/update-repair-order-part.dto';

export class UpdateRepairOrderDto {
  @IsOptional()
  @IsString()
  problemDescription?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRepairOrderDetailDto)
  details?: UpdateRepairOrderDetailDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRepairOrderPartDto)
  parts?: UpdateRepairOrderPartDto[];

  @IsOptional()
  @IsDateString()
  warrantyStartDate?: Date;

  @IsOptional()
  @IsDateString()
  warrantyEndDate?: Date;

  @IsOptional()
  @IsEnum(OrderRepairStatus)
  status?: OrderRepairStatus;
}
