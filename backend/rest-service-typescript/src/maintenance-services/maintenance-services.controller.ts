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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Maintenance services(Aproved)')
@Controller('services')
export class MaintenanceServicesController {
  constructor(
    private readonly maintenanceSService: MaintenanceServicesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new maintenance service' })
  @ApiResponse({ status: 201, description: 'Service created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createServiceDto: CreateMaintenanceServiceDto) {
    return this.maintenanceSService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all maintenance services' })
  @ApiResponse({ status: 200, description: 'List of all services returned successfully.' })
  findAll() {
    return this.maintenanceSService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({ name: 'id', description: 'Unique service identifier', example: 'a1b2c3d4' })
  @ApiResponse({ status: 200, description: 'Service found successfully.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  findOne(@Param('id') id: string) {
    return this.maintenanceSService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a maintenance service by ID' })
  @ApiParam({ name: 'id', description: 'Unique service identifier', example: 'a1b2c3d4' })
  @ApiResponse({ status: 200, description: 'Service updated successfully.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateMaintenanceServiceDto) {
    return this.maintenanceSService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a maintenance service by ID' })
  @ApiParam({ name: 'id', description: 'Unique service identifier', example: 'a1b2c3d4' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  remove(@Param('id') id: string) {
    return this.maintenanceSService.remove(id);
  }
}