import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  BeforeUpdate,
} from 'typeorm';
import { Equipment } from '../../equipments/entities/equipment.entity';
import { OrderRepairStatus } from './enum/order-repair.enum';
import { RepairOrderDetail } from './repair-order-detail.entity';
import { RepairOrderPart } from './repair-order-part.entity';
import { RepairOrderNotification } from './repair-order-notification.entity';
import { RepairOrderReview } from '../../repair-order-reviews/entities/repair-order-review.entity';
import { Technician } from '../../users/entities/technician.entity';

@Entity('repair_order')
export class RepairOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.repairOrders)
  equipment: Equipment;

  @ManyToOne(() => Technician)
  evaluatedBy: Technician;

  @Column({ type: 'text' })
  problemDescription: string;

  @Column({ type: 'text', array: true, nullable: true })
  imageUrls?: string[];

  @Column({ type: 'text', nullable: true })
  diagnosis?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'date', nullable: true })
  warrantyStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  warrantyEndDate?: Date;

  @Column({
    type: 'enum',
    enum: OrderRepairStatus,
    default: OrderRepairStatus.IN_REVIEW,
  })
  status: OrderRepairStatus;

  @OneToMany(() => RepairOrderDetail, (ts) => ts.repairOrder)
  repairOrderDetails?: RepairOrderDetail[];

  @OneToMany(() => RepairOrderPart, (rp) => rp.repairOrder)
  repairOrderParts?: RepairOrderPart[];

  @OneToMany(
    () => RepairOrderNotification,
    (notification) => notification.repairOrder,
  )
  notifications!: RepairOrderNotification[];

  @OneToMany(() => RepairOrderReview, (review) => review.repairOrder)
  reviews?: RepairOrderReview[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeUpdate()
  setWarrantyDates() {
    if (
      this.status === OrderRepairStatus.DELIVERED &&
      !this.warrantyStartDate
    ) {
      this.warrantyStartDate = new Date();

      // 90 días de garantía 
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 90);
      this.warrantyEndDate = endDate;
    }
  }
}
