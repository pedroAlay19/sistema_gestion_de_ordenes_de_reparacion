import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from './entities/enums/user-role.enum';
import type{ JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncTechnicianDto } from './dto/sync-technician.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get('profile/me')
  @Auth(UserRole.USER, UserRole.ADMIN, UserRole.TECHNICIAN)
  getMyProfile(@ActiveUser() user: JwtPayload) {
    // user.sub = userId del auth-service
    return this.usersService.getUserByAuthUserId(user.sub);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  @Auth(UserRole.USER)
  updateUserProfile(
    @ActiveUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfileByAuthUserId(user.sub, updateProfileDto);
  }

  @Patch('technician/profile')
  @Auth(UserRole.TECHNICIAN)
  updateTechnicianProfile(
    @ActiveUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfileByAuthUserId(user.sub, updateProfileDto);
  }

  @Get('stats/overview')
  @Auth(UserRole.ADMIN)
  usersOverview() {
    return this.usersService.usersOverview();
  }

  @Post('sync/user')
  syncUser(@Body() syncUserDto: SyncUserDto) {
    return this.usersService.syncUser(syncUserDto);
  }

  @Post('sync/technician')
  syncTechnician(@Body() syncTechnicianDto: SyncTechnicianDto) {
    return this.usersService.syncTechnician(syncTechnicianDto);
  }
}
