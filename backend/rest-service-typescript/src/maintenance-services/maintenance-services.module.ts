import { Module } from '@nestjs/common';
import { MaintenanceServicesService } from './maintenance-services.service';
import { MaintenanceServicesController } from './maintenance-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './entities/maintenance-service.entity';
import { HttpModule } from '@nestjs/axios';
import { EquipmentsModule } from 'src/equipments/equipments.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceService]), HttpModule, EquipmentsModule, AuthModule],
  controllers: [MaintenanceServicesController],
  providers: [MaintenanceServicesService],
  exports: [MaintenanceServicesService]
})
export class MaintenanceServicesModule {}