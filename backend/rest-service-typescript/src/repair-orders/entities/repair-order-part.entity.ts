import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { RepairOrder } from './repair-order.entity';
import { SparePart } from 'src/spare-parts/entities/spare-part.entity';

@Entity('repair_order_parts')
export class RepairOrderPart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RepairOrder, (rp) => rp.repairOrderParts, {
    onDelete: 'CASCADE',
  })
  repairOrder: RepairOrder;

  @ManyToOne(() => SparePart, (part) => part.repairOrderParts)
  part: SparePart;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  unitPrice: number; // Precio historico

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  subTotal: number; // Se calcula automaticamente (quantity * unitPrice)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateSubTotal() {
    if (this.unitPrice && this.quantity) {
      this.subTotal = Number((this.unitPrice * this.quantity).toFixed(2));
    }
  }
}
