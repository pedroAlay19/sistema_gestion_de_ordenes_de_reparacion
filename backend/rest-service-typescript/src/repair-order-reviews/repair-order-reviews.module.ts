import { Module } from '@nestjs/common';
import { RepairOrderReviewsService } from './repair-order-reviews.service';
import { RepairOrderReviewsController } from './repair-order-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairOrderReview } from './entities/repair-order-review.entity';
import { RepairOrdersModule } from 'src/repair-orders/repair-orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([RepairOrderReview]),
            RepairOrdersModule],
  controllers: [RepairOrderReviewsController],
  providers: [RepairOrderReviewsService],
})
export class RepairOrderReviewsModule {}
