import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('create-device-code')
  async createDeviceCode() {
    const device = await this.deviceService.createDeviceCode();
    return { code: device.code };
  }
  @Get()
  async getDevice(@Query('code') code: string) {
    const device: Device = await this.deviceService.findByCode(code);
    return {
      code: device.code,
      isConnected: device.isConnected,
      userPhone: device.user?.phone || null,
    };
  }
  @Post('connect-device')
  async connectDevice(@Body() body: { code: string; phone: string }) {
    const { code, phone } = body;
    await this.deviceService.connectDeviceToUser(code, phone);
    return { message: 'Device connected successfully', code, phone };
  }
  @Get('/connection-status/:code')
  async getConnectionStatus(@Param('code') code: string) {
    return this.deviceService.getConnectionStatus(code);
  }
  @Get('generate-tv-code')
  async getUnpairedDevice() {
    const device = await this.deviceService.findUnpairedDevice();
    if (device) {
      return { code: device.code };
    } else {
      return this.createDeviceCode();
    }
  }
  @Get('user-bundle/:code')
  async getUserBundle(@Param('code') code: string) {
    return this.deviceService.getUserBundle(code);
  }
}
