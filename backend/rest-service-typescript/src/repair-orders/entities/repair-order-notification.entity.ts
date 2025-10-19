import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { RepairOrder } from './repair-order.entity';
import { NotificationStatus } from './enum/order-repair.enum';

@Entity('repair_order_notification')
export class RepairOrderNotification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RepairOrder, rp => rp.notifications, {onDelete: 'CASCADE'})
  repairOrder!: RepairOrder;

  @Column()
  title!: string;

  @Column({ type: 'text'})
  message!: string;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt!: Date;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.SENT})
  status?: NotificationStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
