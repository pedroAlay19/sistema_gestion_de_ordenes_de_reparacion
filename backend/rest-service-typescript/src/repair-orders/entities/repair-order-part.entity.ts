import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { RepairOrder } from './repair-order.entity';
import { SparePart } from 'src/spare-parts/entities/spare-part.entity';

@Entity('repair_order_part')
export class RepairOrderPart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RepairOrder, rp => rp.repairOrderParts, {onDelete: 'CASCADE'})
  repairOrder!: RepairOrder;

  @ManyToOne(() => SparePart, part => part.repairOrderParts)
  part!: SparePart;

  @Column({type: 'int'})
  quantity!: number

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0})
  subTotal!: number;

  @Column({ type: 'text', nullable: true})
  imgUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}