import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from './entities/enums/user-role.enum';
import type{ JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('technician')
  @Auth(UserRole.ADMIN)
  createTechnician(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.usersService.createTechnician(createTechnicianDto);
  }

  @Get()
  @Auth(UserRole.ADMIN) 
  findUsers() {
    return this.usersService.findUsers();
  }

  @Get('technician')
  @Auth(UserRole.ADMIN, UserRole.TECHNICIAN)
  findTechnicians() {
    return this.usersService.findTechnicians();
  }

  @Get('stats/overview')
  getUsersOverview() {
    return this.usersService.getUsersOverview();
  }

  @Get('stats/top-clients')
  getTopClients() {
    return this.usersService.getTopClients(5);
  }

  @Get('stats/top-technicians')
  getTopTechnicians() {
    return this.usersService.getTopTechnicians(5);
  }

  @Get('stats/count/clients')
  getTotalClientsCount() {
    return this.usersService.getTotalClientsCount();
  }

  @Get('stats/count/technicians')
  getTotalTechniciansCount() {
    return this.usersService.getTotalTechniciansCount();
  }

  @Get('stats/count/active-technicians')
  getActiveTechniciansCount() {
    return this.usersService.getActiveTechniciansCount();
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  @Auth(UserRole.USER, UserRole.ADMIN, UserRole.TECHNICIAN)
  updateUserProfile(
    @ActiveUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(user.sub, updateUserDto);
  }

  @Patch('technician/profile')
  @Auth(UserRole.USER, UserRole.ADMIN, UserRole.TECHNICIAN)
  updateTechnicianProfile(
    @ActiveUser() user: JwtPayload,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.usersService.updateTechnician(user.sub, updateTechnicianDto);
  }


  @Patch(':id')
  @Auth(UserRole.ADMIN)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch('technician/:id')
  @Auth(UserRole.ADMIN)
  updateTechnician(
    @Param('id') id: string,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.usersService.updateTechnician(id, updateTechnicianDto);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
