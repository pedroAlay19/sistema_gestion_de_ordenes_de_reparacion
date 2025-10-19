import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RepairOrderDetail } from '../../repair-orders/entities/repair-order-detail.entity'
import { ServiceType } from './enums/service.enum';

@Entity('maintenance_service')
export class MaintenanceService {
    @PrimaryGeneratedColumn('uuid')
      id!: string;
    
      @Column()
      serviceName!: string;
    
      @Column()
      description!: string;
    
      @Column({ type: 'numeric', precision: 10, scale: 2 })
      basePrice!: number;
    
      @Column({ type: 'int', nullable: true })
      estimatedTimeMinutes?: number;
    
      @Column({ type: 'boolean', default: false, nullable: true })
      requiresParts?: boolean;
    
      @Column({type: 'enum', enum: ServiceType})
      type!: ServiceType;
    
      @Column("text", { array: true, nullable: true })
      imageUrls?: string[];
    
      @Column({ type: 'boolean', default: true })
      active?: boolean;
    
      @Column({ type: 'text', nullable: true })
      notes?: string;
    
      @OneToMany(() => RepairOrderDetail, ts => ts.service)
      repairOrderDetails!: RepairOrderDetail[];
}