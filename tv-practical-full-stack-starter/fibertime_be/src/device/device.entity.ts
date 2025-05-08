import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isConnected: boolean;

  @ManyToOne(() => User, (user) => user.devices, { nullable: true })
  @JoinColumn()
  user?: User;
  @Column({ type: 'timestamp' })
  bundleExpiry: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
