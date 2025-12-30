import { Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { UserRole } from "./enums/user-role.enum";
import {Equipment} from "../../equipments/entities/equipment.entity";

@Entity('user_profiles')
@TableInheritance({ column: { type: 'enum', enum: UserRole, name: "role", default: UserRole.USER } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string // Referencia al ID del usuario en el servicio de autenticación

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({nullable: true})
  lastName?: string;

  @Column({nullable: true})
  phone?: string;

  @Column({nullable: true})
  address?: string;

  @OneToMany(() => Equipment, equipment => equipment.user, {nullable: true})
  equipments?: Equipment[];
}
