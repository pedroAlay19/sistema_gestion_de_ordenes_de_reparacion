import { Module } from '@nestjs/common';
import { MaintenanceServicesService } from './maintenance-services.service';
import { MaintenanceServicesController } from './maintenance-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './entities/maintenance-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceService])],
  controllers: [MaintenanceServicesController],
  providers: [MaintenanceServicesService],
  exports: [MaintenanceServicesService]
})
export class MaintenanceServicesModule {}