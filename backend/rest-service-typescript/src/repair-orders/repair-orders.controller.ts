import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairOrdersService } from './repair-orders.service';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';
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

  // ===== GRANULAR ANALYTICS ENDPOINTS =====

  /**
   * Get orders overview (totals only)
   * GET /repair-orders/stats/overview
   */
  @Get('stats/overview')
  getOrdersOverview() {
    return this.repairOrdersService.getOrdersOverview();
  }

  /**
   * Get revenue statistics
   * GET /repair-orders/stats/revenue
   */
  @Get('stats/revenue')
  getRevenueStats() {
    return this.repairOrdersService.getRevenueStats();
  }

  /**
   * Get orders by status
   * GET /repair-orders/stats/by-status
   */
  @Get('stats/by-status')
  getOrdersByStatus() {
    return this.repairOrdersService.getOrdersByStatus();
  }

  /**
   * Get recent orders
   * GET /repair-orders/stats/recent?limit=10
   */
  @Get('stats/recent')
  getRecentOrders() {
    return this.repairOrdersService.getRecentOrders(10);
  }

  /**
   * Get top services
   * GET /repair-orders/stats/top-services?limit=5
   */
  @Get('stats/top-services')
  getTopServices() {
    return this.repairOrdersService.getTopServices(5);
  }

  /**
   * Get total orders count (single number)
   * GET /repair-orders/stats/count/total
   */
  @Get('stats/count/total')
  getTotalOrdersCount() {
    return this.repairOrdersService.getTotalOrdersCount();
  }

  /**
   * Get active orders count (single number)
   * GET /repair-orders/stats/count/active
   */
  @Get('stats/count/active')
  getActiveOrdersCount() {
    return this.repairOrdersService.getActiveOrdersCount();
  }

  /**
   * Get total revenue (single number)
   * GET /repair-orders/stats/revenue/total
   */
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
