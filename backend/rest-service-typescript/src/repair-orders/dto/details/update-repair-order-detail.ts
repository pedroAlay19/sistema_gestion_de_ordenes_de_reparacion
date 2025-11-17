import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairOrderDetailDto } from './create-repair-order-detail.dto';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TicketServiceStatus } from '../../entities/enum/order-repair.enum';

export class UpdateRepairOrderDetailDto extends PartialType(CreateRepairOrderDetailDto) {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsEnum(TicketServiceStatus)
  status?: TicketServiceStatus;
}
