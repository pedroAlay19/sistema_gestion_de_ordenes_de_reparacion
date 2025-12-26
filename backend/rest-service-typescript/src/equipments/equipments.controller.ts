import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../users/entities/enums/user-role.enum';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type{ JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  @Auth(UserRole.USER)
  create(@Body() createEquipmentDto: CreateEquipmentDto, @ActiveUser() user: JwtPayload) {
    return this.equipmentsService.create(createEquipmentDto, user);
  }

  @Get()
  @Auth(UserRole.USER, UserRole.ADMIN)
  findAll(@ActiveUser() user: JwtPayload) {
    return this.equipmentsService.findAll(user);
  }

  @Get(':id')
  @Auth(UserRole.USER, UserRole.ADMIN, UserRole.TECHNICIAN)
  findOne(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.equipmentsService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(UserRole.USER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
    @ActiveUser() user: JwtPayload,
  ) {
    return this.equipmentsService.update(id, updateEquipmentDto, user);
  }

  @Delete(':id')
  @Auth(UserRole.USER, UserRole.ADMIN)
  remove(@Param('id') id: string, @ActiveUser() user: JwtPayload) {
    return this.equipmentsService.remove(id, user);
  }
}
