import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairOrdersService } from './repair-orders.service';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';
import { UpdateDetailStatusDto } from './dto/details/update-detail-status.dto';
import { UpdateDetailByTechnicianDto } from './dto/details/update-detail-by-technician.dto';
import { UserRole } from '../users/entities/enums/user-role.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type{ JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('repair-orders')
export class RepairOrdersController {
  constructor(private readonly repairOrdersService: RepairOrdersService) {}

  @Post()
  @Auth(UserRole.TECHNICIAN, UserRole.USER)
  create(@Body() createRepairOrderDto: CreateRepairOrderDto) {
    return this.repairOrdersService.create(createRepairOrderDto);
  }

  @Get()
  @Auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.USER)
  findAll(@ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.findAllByRole(user);
  }

  @Get('evaluator')
  @Auth(UserRole.TECHNICIAN)
  findByEvaluator(@ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.findByEvaluator(user.sub);
  }

  @Get('technician/my-details')
  @Auth(UserRole.TECHNICIAN)
  findMyDetails(@ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.findDetailsByTechnician(user.sub);
  }

  @Patch('technician/detail/:detailId/status')
  @Auth(UserRole.TECHNICIAN)
  updateDetailStatus(
    @Param('detailId') detailId: string,
    @Body() updateStatusDto: UpdateDetailStatusDto,
    @ActiveUser() user: JwtPayload
  ) {
    return this.repairOrdersService.updateDetailStatus(
      detailId,
      user.sub,
      updateStatusDto.status,
      updateStatusDto.notes
    );
  }

  @Patch('technician/detail/:detailId')
  @Auth(UserRole.TECHNICIAN)
  updateDetailByTechnician(
    @Param('detailId') detailId: string,
    @Body() updateDto: UpdateDetailByTechnicianDto,
    @ActiveUser() user: JwtPayload
  ) {
    return this.repairOrdersService.updateDetailByTechnician(
      detailId,
      user.sub,
      updateDto
    );
  }

  @Get('stats/overview')
  getOrdersOverview() {
    return this.repairOrdersService.getOrdersOverview();
  }

  @Get('stats/revenue')
  getRevenueStats() {
    return this.repairOrdersService.getRevenueStats();
  }

  @Get('stats/by-status')
  getOrdersByStatus() {
    return this.repairOrdersService.getOrdersByStatus();
  }

  @Get('stats/recent')
  getRecentOrders() {
    return this.repairOrdersService.getRecentOrders(10);
  }

  @Get('stats/top-services')
  getTopServices() {
    return this.repairOrdersService.getTopServices(5);
  }

  @Get('stats/count/total')
  getTotalOrdersCount() {
    return this.repairOrdersService.getTotalOrdersCount();
  }

  @Get('stats/count/active')
  getActiveOrdersCount() {
    return this.repairOrdersService.getActiveOrdersCount();
  }

  @Get('stats/revenue/total')
  getTotalRevenue() {
    return this.repairOrdersService.getTotalRevenue();
  }

  @Get(':id')
  @Auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.USER)
  update(@Param('id') id: string, @Body() updateRepairOrderDto: UpdateRepairOrderDto, @ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.update(id, updateRepairOrderDto, user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.remove(id, user);
  }
}
