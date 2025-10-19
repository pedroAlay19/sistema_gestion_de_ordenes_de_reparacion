import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { EquipmentType } from '../entities/enums/equipment.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty({
    description: 'The ID of the user who owns the equipment',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The name of the equipment',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The type of the equipment',
    enum: EquipmentType,
  })
  @IsEnum(EquipmentType)
  type: EquipmentType;

  @ApiProperty({
    description: 'The brand of the equipment',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'The model of the equipment',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'The serial number of the equipment',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({
    description: 'The observations or notes about the equipment',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  observations?: string;
}