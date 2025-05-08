import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Device } from './device.entity';
import { User } from '../user/user.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  generateCode(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  async createDeviceCode(): Promise<Device> {
    let code: string;
    let existing: Device | null;

    try {
      do {
        code = this.generateCode();
        console.log('Generated code:', code);
        existing = await this.deviceRepository.findOne({ where: { code } });
      } while (existing);

      const device = this.deviceRepository.create({
        code,
        bundleExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      console.log('Saving device:', device);
      return await this.deviceRepository.save(device);
    } catch (error) {
      console.error('Error in createDeviceCode():', error);
      throw error;
    }
  }

  async findByCode(code: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { code },
      relations: ['user'],
    });
    if (!device) throw new NotFoundException('Device not found');

    console.log(
      `Device code: ${device.code}, User phone: ${device.user?.phone}`,
    );
    return device;
  }

  async connectDeviceToUser(code: string, phone: string) {
    const device = await this.deviceRepository.findOne({ where: { code } });
    if (!device) throw new NotFoundException('Device not found');

    const existingDevice = await this.deviceRepository.findOne({
      where: { user: { phone } },
    });
    if (existingDevice) {
      console.log('User already connected to another device');
    }

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) throw new NotFoundException('User not found');

    device.user = user;
    device.isConnected = true;
    await this.deviceRepository.save(device);
  }

  async getConnectionStatus(code: string): Promise<{ isConnected: boolean }> {
    const device = await this.deviceRepository.findOne({ where: { code } });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return { isConnected: device.isConnected };
  }
  async findUnpairedDevice(): Promise<Device | null> {
    return this.deviceRepository.findOne({
      where: {
        isConnected: false,
        user: IsNull(),
      },
    });
  }
  async getUserBundle(code: string) {
    const device = await this.deviceRepository.findOne({ where: { code } });

    if (!device) throw new NotFoundException('Device not found');

    const now = new Date();
    const expiry = new Date(device.bundleExpiry);

    const diff = expiry.getTime() - now.getTime();
    const seconds = Math.max(Math.floor(diff / 1000), 0);
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));

    return { days, hours };
  }
}
