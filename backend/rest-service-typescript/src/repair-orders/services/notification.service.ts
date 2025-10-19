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
    const statusMessages = {
      [OrderRepairStatus.OPEN]: {
        title: 'Ticket abierto',
        message: 'Se ha creado un nuevo ticket de reparación.',
      },
      [OrderRepairStatus.IN_PROGRESS]: {
        title: 'En progreso',
        message: 'La reparación ha comenzado.',
      },
      [OrderRepairStatus.RESOLVED]: {
        title: 'Ticket resuelto',
        message: 'La reparación ha sido completada.',
      },
      [OrderRepairStatus.CLOSED]: {
        title: 'Ticket cerrado',
        message: 'El ticket ha sido cerrado.',
      },
    };

    const { title, message } = statusMessages[status];

    const notification = this.notificationRepository.create({
      repairOrder,
      title,
      message,
    });

    return await this.notificationRepository.save(notification);
  }
}
