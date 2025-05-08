import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { User } from '../user/user.entity';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Device, User])],
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
