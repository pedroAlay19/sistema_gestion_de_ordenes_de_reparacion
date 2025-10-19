import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairOrderReviewsService } from './repair-order-reviews.service';
import { CreateRepairOrderReviewDto } from './dto/create-repair-order-review.dto';
import { UpdateRepairOrderReviewDto } from './dto/update-repair-order-review.dto';

@Controller('repair-order-reviews')
export class RepairOrderReviewsController {
  constructor(private readonly repairOrderReviewsService: RepairOrderReviewsService) {}

  @Post()
  create(@Body() createRepairOrderReviewDto: CreateRepairOrderReviewDto) {
    return this.repairOrderReviewsService.create(createRepairOrderReviewDto);
  }

  @Get()
  findAll() {
    return this.repairOrderReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairOrderReviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairOrderReviewDto: UpdateRepairOrderReviewDto) {
    return this.repairOrderReviewsService.update(id, updateRepairOrderReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairOrderReviewsService.remove(id);
  }
}
