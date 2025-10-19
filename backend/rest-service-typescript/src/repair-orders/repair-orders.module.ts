import { Module } from '@nestjs/common';
import { RepairOrdersService } from './repair-orders.service';
import { RepairOrdersController } from './repair-orders.controller';
import { RepairOrderPartsService } from './services/repair-order-parts.service';
import { EquipmentsModule } from 'src/equipments/equipments.module';
import { MaintenanceServicesModule } from 'src/maintenance-services/maintenance-services.module';
import { UsersModule } from 'src/users/users.module';
import { RepairOrderDetailsService } from './services/repair-order-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairOrderDetail } from './entities/repair-order-detail.entity';
import { RepairOrderPart } from './entities/repair-order-part.entity';
import { RepairOrder } from './entities/repair-order.entity';
import { NotificationService } from './services/notification.service';
import { SparePartsModule } from 'src/spare-parts/spare-parts.module';
import { RepairOrderNotification } from './entities/repair-order-notification.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([RepairOrderDetail, RepairOrderPart, RepairOrder, RepairOrderNotification]),
    EquipmentsModule, MaintenanceServicesModule, UsersModule, SparePartsModule],
  controllers: [RepairOrdersController],
  providers: [RepairOrdersService, RepairOrderDetailsService, RepairOrderPartsService, NotificationService],
  exports: [RepairOrdersService]
})
export class RepairOrdersModule {}
