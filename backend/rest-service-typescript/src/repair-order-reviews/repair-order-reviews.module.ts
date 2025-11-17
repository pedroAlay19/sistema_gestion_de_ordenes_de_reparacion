import { Module } from '@nestjs/common';
import { RepairOrderReviewsService } from './repair-order-reviews.service';
import { RepairOrderReviewsController } from './repair-order-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairOrderReview } from './entities/repair-order-review.entity';
import { RepairOrdersModule } from 'src/repair-orders/repair-orders.module';
import { HttpModule } from '@nestjs/axios';
import { WebSocketNotificationService } from '../websocket/websocket-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([RepairOrderReview]),
            RepairOrdersModule,HttpModule],
  controllers: [RepairOrderReviewsController],
  providers: [RepairOrderReviewsService, WebSocketNotificationService],
})
export class RepairOrderReviewsModule {}
