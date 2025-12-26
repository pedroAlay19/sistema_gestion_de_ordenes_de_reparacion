import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RepairOrderNotification } from '../entities/repair-order-notification.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(RepairOrderNotification)
    private readonly notificationRepository: Repository<RepairOrderNotification>,
  ) {}
  
}
