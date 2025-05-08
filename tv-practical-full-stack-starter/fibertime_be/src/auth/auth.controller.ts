import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('request-otp')
  async requestOtp(@Body('phone') phone: string) {
    let user = await this.userService.createOrFindByPhone(phone);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user = await this.userService.save(user);
    console.log(`Sending OTP ${otp} to ${phone}`);
    return { message: 'OTP sent', phone, otp };
  }

  @Post('login')
  login(@Body() body: { phone: string; otp: string }) {
    return this.authService.login(body.phone, body.otp);
  }
}
