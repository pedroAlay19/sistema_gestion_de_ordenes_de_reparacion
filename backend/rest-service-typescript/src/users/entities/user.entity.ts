import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { UserRole } from "./enums/user-role.enum";
import {Equipment} from "../../equipments/entities/equipment.entity";

@Entity('User')
@TableInheritance({ column: { type: 'enum', enum: UserRole, name: "role", default: UserRole.USER } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column({unique: true})
  email!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;

  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
  role?: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Equipment, equipment => equipment.user, {nullable: true})
  equipments?: Equipment[];
}
