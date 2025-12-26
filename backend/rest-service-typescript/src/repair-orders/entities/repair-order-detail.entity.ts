import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeUpdate,
} from 'typeorm';
import { RepairOrder } from './repair-order.entity';
import { MaintenanceService } from '../../maintenance-services/entities/maintenance-service.entity';
import { Technician } from '../../users/entities/technician.entity';
import { TicketServiceStatus } from './enum/order-repair.enum';

@Entity('repair_order_detail')
export class RepairOrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RepairOrder, (ro) => ro.repairOrderDetails, {
    onDelete: 'CASCADE',
  })
  repairOrder: RepairOrder;

  @ManyToOne(() => MaintenanceService, (service) => service.repairOrderDetails)
  service: MaintenanceService;

  @ManyToOne(() => Technician, (tech) => tech.ticketServices)
  technician: Technician;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  repairPrice: number;

  @Column({
    type: 'enum',
    enum: TicketServiceStatus,
    default: TicketServiceStatus.PENDING,
  })
  status: TicketServiceStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeUpdate()
  setCompletedDate() {
    if (this.status === TicketServiceStatus.COMPLETED && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
}
