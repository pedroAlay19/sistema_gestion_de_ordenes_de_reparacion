import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RepairOrderDetail } from '../../repair-orders/entities/repair-order-detail.entity';
import { EquipmentType } from '../../equipments/entities/enums/equipment.enum';

@Entity('maintenance_services')
export class MaintenanceService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  serviceName: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  basePrice: number;

  @Column({
    type: 'enum',
    enum: EquipmentType,
    array: true,
  })
  applicableEquipmentTypes: EquipmentType[];

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => RepairOrderDetail, (ts) => ts.service)
  repairOrderDetails: RepairOrderDetail[];

  @CreateDateColumn()
  createdAt: Date;
}
