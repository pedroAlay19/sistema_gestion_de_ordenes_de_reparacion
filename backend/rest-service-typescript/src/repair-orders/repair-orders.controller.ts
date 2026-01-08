import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { RepairOrdersService } from './repair-orders.service';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import {
  AssignRepairWorkDto,
  EvaluateRepairOrderDto,
} from './dto/update-repair-order.dto';
import { UserRole } from '../users/entities/enums/user-role.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateRepairOrderDetailDto } from './dto/details/create-repair-order-detail.dto';
import { CreateRepairOrderPartDto } from './dto/parts/create-repair-order-part.dto';
import { UpdateDetailStatusDto } from './dto/details/update-repair-order-detail';

@Controller('repair-orders')
export class RepairOrdersController {
  constructor(private readonly repairOrdersService: RepairOrdersService) {}

  @Post()
  @Auth(UserRole.USER)
  create(@Body() createRepairOrderDto: CreateRepairOrderDto) {
    return this.repairOrdersService.create(createRepairOrderDto);
  }

  @Get()
  @Auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.USER)
  findAll(@ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.findAllByRole(user);
  }

  @Get('equipment/:equipmentId')
  // @Auth(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN)
  findByEquipment(@Param('equipmentId') equipmentId: string) {
    return this.repairOrdersService.findByEquipment(equipmentId);
  }

  @Get(':id/final-cost')
  @Auth(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN)
  calculateFinalCost(@Param('id') id: string) {
    return this.repairOrdersService.calculateFinalCost(id);
  }

  @Get(':id')
  @Auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.findOne(id, user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.remove(id, user);
  }

  // Flujo de estados
  @Patch(':id/evaluate')
  @Auth(UserRole.TECHNICIAN)
  evaluateRepairOrder(
    @Param('id') id: string,
    @Body() evaluateDto: EvaluateRepairOrderDto,
    @ActiveUser() user: JwtPayload,
  ) {
    return this.repairOrdersService.evaluateRepairOrder(
      id,
      evaluateDto,
      user.sub,
    );
  }

  @Patch(':id/approve')
  @Auth(UserRole.USER)
  approveRepairOrder(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.approveRepairOrder(id, user.sub);
  }

  @Patch(':id/reject')
  @Auth(UserRole.USER)
  rejectRepairOrder(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.repairOrdersService.rejectRepairOrder(id, user.sub);
  }

  @Post(':id/assign-work')
  @Auth(UserRole.TECHNICIAN)
  assignWork(
    @Param('id') id: string,
    @Body() assignWorkDto: AssignRepairWorkDto,
  ) {
    return this.repairOrdersService.assignWork(id, assignWorkDto);
  }

  @Put(':id/reassign-work')
  @Auth(UserRole.TECHNICIAN)
  reassignWork(
    @Param('id') id: string,
    @Body() assignWorkDto: AssignRepairWorkDto,
  ) {
    return this.repairOrdersService.reassignWork(id, assignWorkDto);
  }

  @Patch(':id/deliver')
  @Auth(UserRole.TECHNICIAN)
  deliver(@Param('id') id: string) {
    return this.repairOrdersService.deliver(id);
  }

  // Manipulacion individual
  @Post(':id/detail')
  @Auth(UserRole.TECHNICIAN)
  addDetail(
    @Param('id') id: string,
    @Body() createDetailDto: CreateRepairOrderDetailDto,
  ) {
    return this.repairOrdersService.addDetail(id, createDetailDto);
  }

  @Delete(':id/detail/:detailId')
  @Auth(UserRole.TECHNICIAN)
  removeDetail(@Param('id') id: string, @Param('detailId') detailId: string) {
    return this.repairOrdersService.removeDetail(id, detailId);
  }

  @Post(':id/part')
  @Auth(UserRole.TECHNICIAN)
  addPart(
    @Param('id') id: string,
    @Body() createPartDto: CreateRepairOrderPartDto,
  ) {
    return this.repairOrdersService.addPart(id, createPartDto);
  }

  @Delete(':id/part/:partId')
  @Auth(UserRole.TECHNICIAN)
  removePart(@Param('id') id: string, @Param('partId') partId: string) {
    return this.repairOrdersService.removePart(id, partId);
  }

  @Get('evaluator/:technicianId')
  @Auth(UserRole.TECHNICIAN)
  findByEvaluator(@Param('technicianId') id: string) {
    return this.repairOrdersService.findByEvaluator(id);
  }

  @Get('technician/:technicianId/details')
  @Auth(UserRole.TECHNICIAN)
  findMyDetails(@Param('technicianId') id: string) {
    return this.repairOrdersService.findDetailsByTechnician(id);
  }

  @Patch('detail/:detailId/status')
  @Auth(UserRole.TECHNICIAN)
  updateDetailStatus(
    @Param('detailId') detailId: string,
    @Body() updateStatusDto: UpdateDetailStatusDto,
    @ActiveUser() user: JwtPayload,
  ) {
    return this.repairOrdersService.updateDetailStatus(
      detailId,
      user.sub,
      updateStatusDto.status,
      updateStatusDto.notes,
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

  @Get('stats/top-services')
  getTopServices(@Query('limit') limit?: number) {
    return this.repairOrdersService.getTopServices(limit);
  }
}
