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
    return this.repairOrdersService.findAll(user);
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
