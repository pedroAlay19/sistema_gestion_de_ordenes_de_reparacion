import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairOrdersService } from './repair-orders.service';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';

@Controller('repair-orders')
export class RepairOrdersController {
  constructor(private readonly repairOrdersService: RepairOrdersService) {}

  @Post()
  create(@Body() createRepairOrderDto: CreateRepairOrderDto) {
    return this.repairOrdersService.create(createRepairOrderDto);
  }

  @Get()
  findAll() {
    return this.repairOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairOrdersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairOrderDto: UpdateRepairOrderDto) {
    return this.repairOrdersService.update(id, updateRepairOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairOrdersService.remove(id);
  }
}
