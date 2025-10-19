import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
    @ApiOperation({ summary: 'Create a new equipment' })
    @ApiResponse({ status: 201, description: 'Equipment created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    create(@Body() createEquipmentDto: CreateEquipmentDto) {
      return this.equipmentsService.create(createEquipmentDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all equipment' })
    @ApiResponse({ status: 200, description: 'List of equipment retrieved successfully.' })
    findAll() {
      return this.equipmentsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get equipment by ID' })
    @ApiParam({ name: 'id', description: 'ID of the equipment', type: String })
    @ApiResponse({ status: 200, description: 'Equipment found.' })
    @ApiResponse({ status: 404, description: 'Equipment not found.' })
    findOne(@Param('id') id: string) {
      return this.equipmentsService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update equipment by ID' })
    @ApiParam({ name: 'id', description: 'ID of the equipment', type: String })
    @ApiResponse({ status: 200, description: 'Equipment updated successfully.' })
    @ApiResponse({ status: 404, description: 'Equipment not found.' })
    update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) {
      return this.equipmentsService.update(id, updateEquipmentDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un equipo por ID' })
    @ApiParam({ name: 'id', description: 'ID of the equipment', type: String })
    @ApiResponse({ status: 200, description: 'Equipment deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Equipment not found.' })
    remove(@Param('id') id: string) {
      return this.equipmentsService.remove(id);
    }
}