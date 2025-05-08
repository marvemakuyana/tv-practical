import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOtp(phone: string, otp: string): Promise<User> {
    const user = await this.userService.findByPhone(phone);
    if (!user || user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    return user;
  }

  async login(phone: string, otp: string) {
    const user = await this.validateOtp(phone, otp);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { sub: user.id, phone: user.phone };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user,
    };
  }
}
