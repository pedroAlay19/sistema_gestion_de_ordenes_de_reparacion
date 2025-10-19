import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ServiceType } from '../entities/enums/service.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceServiceDto {
  @ApiProperty({
    example: 'Screen changes',
    description: 'Name of the maintenance service.',
  })
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @ApiProperty({
    example: 'screen changes for all types of devices',
    description: 'Detailed description of the service.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 45.5,
    description: 'Base price of the service in USD.',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({
    example: 60,
    description: 'Estimated duration in minutes.',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedTimeMinutes?: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if the service requires parts.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresParts?: boolean;

  @ApiProperty({
    enum: ServiceType,
    example: ServiceType.REPAIR,
    description: 'Type of the service (repair, maintenance, installation, etc).',
  })
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Optional list of image URLs for the service.',
    required: false,
  })
  @IsOptional()
  imageUrls?: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Optional internal notes about the service.',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}