import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceServicesModule } from './maintenance-services/maintenance-services.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';
import { RepairOrdersModule } from './repair-orders/repair-orders.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { RepairOrderReviewsModule } from './repair-order-reviews/repair-order-reviews.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace las variables disponibles en toda la app
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    EquipmentsModule,
    MaintenanceServicesModule,
    SparePartsModule,
    RepairOrdersModule,
    EquipmentsModule,
    RepairOrderReviewsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
