import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MaintenanceServicesService } from './maintenance-services.service';
import { CreateMaintenanceServiceDto } from './dto/create-maintenance-service.dto';
import { UpdateMaintenanceServiceDto } from './dto/update-maintenance-service.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from 'src/users/entities/enums/user-role.enum';

@Controller('services')
export class MaintenanceServicesController {
  constructor(
    private readonly maintenanceSService: MaintenanceServicesService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  create(@Body() createServiceDto: CreateMaintenanceServiceDto) {
    return this.maintenanceSService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.maintenanceSService.findAll();
  }

  @Get('applicable/:equipmentId')
  findApplicableServices(@Param('equipmentId') equipmentId: string) {
    return this.maintenanceSService.findApplicableServices(equipmentId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.maintenanceSService.findOne(id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateMaintenanceServiceDto) {
    return this.maintenanceSService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.maintenanceSService.remove(id);
  }
}