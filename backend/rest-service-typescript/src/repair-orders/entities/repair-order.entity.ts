import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Equipment } from '../../equipments/entities/equipment.entity';
import { OrderRepairStatus } from '../entities/enum/order-repair.enum';
import { RepairOrderDetail } from './repair-order-detail.entity';
import { RepairOrderPart } from './repair-order-part.entity';
import { RepairOrderNotification } from './repair-order-notification.entity';
import { RepairOrderReview } from '../../repair-order-reviews/entities/repair-order-review.entity';

@Entity('repair_order')
export class RepairOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.repairOrders)
  equipment!: Equipment;

  @Column({ type: 'text' })
  problemDescription!: string;

  @Column({ type: 'text', array: true, nullable: true })
  imageUrls?: string[];

  @Column({ type: 'text', nullable: true })
  diagnosis?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  finalCost?: number;

  @Column({ type: 'date', nullable: true })
  warrantyStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  warrantyEndDate?: Date;

  @Column({ type: 'enum', enum: OrderRepairStatus, default: OrderRepairStatus.IN_REVIEW })
  status!: OrderRepairStatus;

  @OneToMany(() => RepairOrderDetail, (ts) => ts.repairOrder)
  repairOrderDetails!: RepairOrderDetail[];

  @OneToMany(() => RepairOrderPart, (rp) => rp.repairOrder)
  repairOrderParts?: RepairOrderPart[];

  @OneToMany(
    () => RepairOrderNotification,
    (notification) => notification.repairOrder,
  )
  notifications!: RepairOrderNotification[];

  @OneToMany(() => RepairOrderReview, review => review.repairOrder)
  reviews?: RepairOrderReview[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
