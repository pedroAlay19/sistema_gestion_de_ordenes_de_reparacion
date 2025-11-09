import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
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

  @IsOptional() // Imágenes del problema reportado
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional() // Opcional en un principio porque se agrega tras diagnóstico
  @IsString()
  diagnosis?: string;

  @IsOptional() // Opcional en un principio porque se agrega tras diagnóstico
  @IsNumber()
  estimatedCost?: number;

  @IsOptional() // Se agregan los detalles cuando el usuario acepta la reparación
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairOrderDetailDto)
  details?: CreateRepairOrderDetailDto[];

  @IsOptional() // Se agregan las piezas en caso de ser necesarias cuando el usuario acepta la reparación
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairOrderPartDto)
  parts?: CreateRepairOrderPartDto[];
}
