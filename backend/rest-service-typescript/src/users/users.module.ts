import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Technician } from './entities/technician.entity';
import { HttpModule } from '@nestjs/axios';
import { WebSocketNotificationService } from '../websocket/websocket-notification.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Technician]), HttpModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, WebSocketNotificationService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
