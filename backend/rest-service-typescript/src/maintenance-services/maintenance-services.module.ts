import { Module } from '@nestjs/common';
import { MaintenanceServicesService } from './maintenance-services.service';
import { MaintenanceServicesController } from './maintenance-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './entities/maintenance-service.entity';
import { HttpModule } from '@nestjs/axios';
import { WebSocketNotificationService } from '../websocket/websocket-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceService]),HttpModule],
  controllers: [MaintenanceServicesController],
  providers: [MaintenanceServicesService, WebSocketNotificationService],
  exports: [MaintenanceServicesService]
})
export class MaintenanceServicesModule {}