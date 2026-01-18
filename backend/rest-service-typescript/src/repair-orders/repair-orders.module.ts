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
import { SparePartsModule } from 'src/spare-parts/spare-parts.module';
import { RepairOrderNotification } from './entities/repair-order-notification.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([RepairOrderDetail, RepairOrderPart, RepairOrder, RepairOrderNotification]),
    EquipmentsModule, MaintenanceServicesModule, UsersModule, SparePartsModule, HttpModule, AuthModule, WebhooksModule],
  controllers: [RepairOrdersController],
  providers: [RepairOrdersService, RepairOrderDetailsService, RepairOrderPartsService],
  exports: [RepairOrdersService]
})
export class RepairOrdersModule {}
