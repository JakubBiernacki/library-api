import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(user: UserDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  findAll() {
    return this.userRepository.find();
  }

  findByUsernameWithPassword(username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  update(id: number, updateUser: UpdateUserDto) {
    return this.userRepository.update(id, { ...updateUser });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
