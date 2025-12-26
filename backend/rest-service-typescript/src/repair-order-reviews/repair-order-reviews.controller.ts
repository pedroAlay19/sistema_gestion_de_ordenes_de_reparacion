import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairOrderReviewsService } from './repair-order-reviews.service';
import { CreateRepairOrderReviewDto } from './dto/create-repair-order-review.dto';
import { UpdateRepairOrderReviewDto } from './dto/update-repair-order-review.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type{ JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../users/entities/enums/user-role.enum';

@Controller('repair-order-reviews')
export class RepairOrderReviewsController {
  constructor(private readonly repairOrderReviewsService: RepairOrderReviewsService) {}

  @Post()
  @Auth(UserRole.USER)
  create(@Body() createRepairOrderReviewDto: CreateRepairOrderReviewDto, @ActiveUser() user: JwtPayload) {
    return this.repairOrderReviewsService.create(createRepairOrderReviewDto, user);
  }

  @Get()
  @Auth(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN)
  findAll(@ActiveUser() user: JwtPayload) {
    return this.repairOrderReviewsService.findAll(user);
  }

  @Get('best-reviews')
  getBestReviews() {
    return this.repairOrderReviewsService.findBestsReviews();
  }

  @Get('repair-order/:repairOrderId')
  @Auth(UserRole.USER, UserRole.TECHNICIAN)
  findByRepairOrderId(@Param('repairOrderId') repairOrderId: string) {
    return this.repairOrderReviewsService.findByRepairOrderId(repairOrderId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrderReviewsService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.USER )
  update(@Param('id') id: string, @Body() updateRepairOrderReviewDto: UpdateRepairOrderReviewDto, @ActiveUser() user: JwtPayload) {
    return this.repairOrderReviewsService.update(id, updateRepairOrderReviewDto, user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN, UserRole.USER )
  remove(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrderReviewsService.remove(id, user);
  }
}
