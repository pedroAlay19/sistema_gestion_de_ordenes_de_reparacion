import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SparePartsService } from './spare-parts.service';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { UpdateSparePartDto } from './dto/update-spare-part.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Spare Parts(Aproved)')
@Controller('spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new spare part' })
  @ApiResponse({
    status: 201,
    description: 'Spare part created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid spare part data.',
  })
  create(@Body() createSparePartDto: CreateSparePartDto) {
    return this.sparePartsService.create(createSparePartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all spare parts' })
  @ApiResponse({
    status: 200,
    description: 'List of all spare parts retrieved successfully.',
  })
  findAll() {
    return this.sparePartsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a spare part by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the spare part (UUID)',
    example: 'b8c1a2d3-4f5e-6789-0123-456789abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Spare part retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Spare part not found.',
  })
  findOne(@Param('id') id: string) {
    return this.sparePartsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a spare part by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the spare part (UUID)',
    example: 'b8c1a2d3-4f5e-6789-0123-456789abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Spare part updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Spare part not found.',
  })
  update(@Param('id') id: string, @Body() updateSparePartDto: UpdateSparePartDto) {
    return this.sparePartsService.update(id, updateSparePartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a spare part by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the spare part (UUID)',
    example: 'b8c1a2d3-4f5e-6789-0123-456789abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Spare part deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Spare part not found.',
  })
  remove(@Param('id') id: string) {
    return this.sparePartsService.remove(id);
  }
}
