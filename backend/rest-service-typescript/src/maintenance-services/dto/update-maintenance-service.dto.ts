import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceServiceDto } from './create-maintenance-service.dto';

export class UpdateMaintenanceServiceDto extends PartialType(CreateMaintenanceServiceDto) {}