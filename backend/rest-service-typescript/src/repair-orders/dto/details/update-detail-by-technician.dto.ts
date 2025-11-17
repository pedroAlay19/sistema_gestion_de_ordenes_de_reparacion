import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TicketServiceStatus } from '../../entities/enum/order-repair.enum';

export class UpdateDetailByTechnicianDto {
  @IsEnum(TicketServiceStatus)
  @IsNotEmpty()
  status!: TicketServiceStatus;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
