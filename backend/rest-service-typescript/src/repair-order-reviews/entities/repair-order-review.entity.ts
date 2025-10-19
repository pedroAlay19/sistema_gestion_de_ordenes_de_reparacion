import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { RepairOrder } from '../../repair-orders/entities/repair-order.entity';

@Entity('repair_order_review')
export class RepairOrderReview {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RepairOrder, (rp) => rp.reviews, { onDelete: 'CASCADE' })
  repairOrder!: RepairOrder;

  @Column({ type: 'smallint' })
  rating!: number; // 1–5

  @Column({ type: 'text' })
  comment!: string;

  @Column({ type: 'boolean', default: true })
  visible!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
