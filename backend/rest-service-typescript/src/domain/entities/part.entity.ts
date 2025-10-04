import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TicketPartEntity } from "./ticket-part.entity";

@Entity()
export class PartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({type: 'text'})
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0})
  unitPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TicketPartEntity, tp => tp.part)
  ticketParts?: TicketPartEntity[];
}
