import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../enums/user-role.enum";
import { EquipmentEntity } from "./equipment.entity";
import { TicketEntity } from "./ticket.entity";
import { TechnicianEntity } from "./technician.entity";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({type: 'enum', enum: UserRole})
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EquipmentEntity, equipment => equipment.user)
  equipments?: EquipmentEntity[];

  @OneToOne(() => TechnicianEntity, technician => technician.user)
  technicianProfile?: TechnicianEntity;

  
  assignedTickets?: TicketEntity[];
}
