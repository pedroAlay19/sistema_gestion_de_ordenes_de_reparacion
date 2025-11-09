import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RepairOrderNotification } from '../entities/repair-order-notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepairStatus } from '../entities/enum/order-repair.enum';
import { RepairOrder } from '../entities/repair-order.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(RepairOrderNotification)
    private readonly notificationRepository: Repository<RepairOrderNotification>,
  ) {}

  async create(repairOrder: RepairOrder, status: OrderRepairStatus): Promise<RepairOrderNotification> {
  let title: string;
  let message: string;

  switch (status) {
    case OrderRepairStatus.IN_REVIEW:
      title = 'Repair Order In Review';
      message = 'The repair order is currently under review.';
      break;

    case OrderRepairStatus.WAITING_APPROVAL:
      title = 'Repair Order Waiting Approval';
      message = 'The repair order is waiting for approval.';
      break;

    case OrderRepairStatus.IN_REPAIR:
      title = 'Repair Order In Repair';
      message = 'The repair order is currently being repaired.';
      break;

    case OrderRepairStatus.REJECTED:
      title = 'Repair Order Rejected';
      message = 'The repair order has been rejected.';
      break;

    default:
      title = 'Repair Order Update';
      message = 'There has been an update to the repair order status.';
      break;
  }
    const notification = this.notificationRepository.create({
      repairOrder,
      title,
      message,
    });

    return await this.notificationRepository.save(notification);
  }
}
