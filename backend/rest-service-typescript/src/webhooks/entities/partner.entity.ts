import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('partner')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id_partner: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500 })
  webhook_url: string;

  @Column({ length: 255 })
  secret: string;

  @Column({ type: 'text', nullable: true })
  subscribed_events: string; // JSON string

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
