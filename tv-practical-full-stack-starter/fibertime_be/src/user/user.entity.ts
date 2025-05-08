import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Device } from '../device/device.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  otp?: string;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];
}
