import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceServiceDto } from './create-maintenance-service.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMaintenanceServiceDto extends PartialType(CreateMaintenanceServiceDto,) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
