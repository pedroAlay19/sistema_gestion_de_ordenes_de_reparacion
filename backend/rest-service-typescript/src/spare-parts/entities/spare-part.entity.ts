import { RepairOrderPart } from "src/repair-orders/entities/repair-order-part.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('spare_part')
export class SparePart {
    @PrimaryGeneratedColumn('uuid')
      id!: string;
    
      @Column()
      name!: string;
    
      @Column({type: 'text'})
      description!: string;
    
      @Column({ type: 'int', default: 0 })
      stock!: number;
    
      @Column({ type: 'numeric', precision: 12, scale: 2, default: 0})
      unitPrice!: number;
    
      @CreateDateColumn()
      createdAt!: Date;
    
      @UpdateDateColumn()
      updatedAt!: Date;
    
      @OneToMany(() => RepairOrderPart, rp => rp.part)
      repairOrderParts?: RepairOrderPart[];
}
