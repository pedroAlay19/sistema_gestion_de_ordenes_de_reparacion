import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateRepairOrderDetailDto } from './details/create-repair-order-detail.dto';
import { CreateRepairOrderPartDto } from './parts/create-repair-order-part.dto';

export class EvaluateRepairOrderDto {
  @IsString()
  diagnosis: string;

  @IsNumber()
  @Min(0)
  estimatedCost: number;
}

export class AssignRepairWorkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairOrderDetailDto)
  details: CreateRepairOrderDetailDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairOrderPartDto)
  parts?: CreateRepairOrderPartDto[];
}
