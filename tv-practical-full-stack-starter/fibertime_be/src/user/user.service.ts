import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async createOrFindByPhone(phone: string): Promise<User> {
    let user = await this.findByPhone(phone);
    if (!user) {
      user = this.userRepository.create({ phone });
    }
    return user;
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
