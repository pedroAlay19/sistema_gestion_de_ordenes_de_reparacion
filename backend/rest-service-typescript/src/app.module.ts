import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceServicesModule } from './maintenance-services/maintenance-services.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';
import { RepairOrdersModule } from './repair-orders/repair-orders.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { RepairOrderReviewsModule } from './repair-order-reviews/repair-order-reviews.module';
import { AuthModule } from './auth/auth.module';

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
    RepairOrderReviewsModule,
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}