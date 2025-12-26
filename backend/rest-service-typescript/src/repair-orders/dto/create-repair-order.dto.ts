import {
  IsUUID,
  IsOptional,
  IsString,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreateRepairOrderDto {
  @IsNotEmpty()
  @IsUUID()
  equipmentId: string;

  @IsNotEmpty()
  @IsString()
  problemDescription: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}


