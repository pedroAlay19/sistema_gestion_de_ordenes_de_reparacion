import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TicketServiceStatus } from '../../entities/enum/order-repair.enum';

export class UpdateDetailStatusDto {
  @IsEnum(TicketServiceStatus)
  @IsNotEmpty()
  status!: TicketServiceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
