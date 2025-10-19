import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Equipment } from './equipments/entities/equipment.entity';
import { MaintenanceServicesModule } from './maintenance-services/maintenance-services.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';
import { RepairOrdersModule } from './repair-orders/repair-orders.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { RepairOrderReviewsModule } from './repair-order-reviews/repair-order-reviews.module';
// import { User } from './users/entities/user.entity';
// import { Technician } from './users/entities/technician.entity';
// import { SparePart } from './spare-parts/entities/spare-part.entity';
// import { RepairOrderDetail } from './repair-orders/entities/repair-order-detail.entity';
// import { RepairOrderPart } from './repair-orders/entities/repair-order-part.entity';
// import { RepairOrder } from './repair-orders/entities/repair-order.entity';
// import { RepairOrderReview } from './repair-order-reviews/entities/repair-order-review.entity';
// import { MaintenanceService } from './maintenance-services/entities/maintenance-service.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'testdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EquipmentsModule,
    MaintenanceServicesModule,
    SparePartsModule,
    RepairOrdersModule,
    EquipmentsModule,
    RepairOrderReviewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}