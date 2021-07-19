import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { UserRole } from './enums/user-role';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    public readonly authService: AuthService,
  ) {}

  async create(newUser: CreateUserDto): Promise<Record<string, string>> {
    await this.userExist(newUser);
    const hashedPassword = await this.authService.hashPassword(
      newUser.password,
    );
    const user = this.userRepository.create({
      ...newUser,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    const token = await this.authService.createAuthToken(user);

    this.authService.sendConfirmEmail(user, token.code);

    return { message: `User ${user.username} has been created` };
  }

  findOne(id: number) {
    return this.userRepository.findOne({ id });
  }

  async paginateAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }

  async update(id: number, updateUser: UpdateUserDto) {
    return this.userRepository.update(id, updateUser);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  updateRoleOfUser(id: number, role: UserRole) {
    return this.userRepository.update(id, { role });
  }

  findByUsernameOrFail(username: string): Promise<User> {
    return this.userRepository.findOneOrFail({ username }).catch(() => {
      throw new NotFoundException(`User ${username} not found`);
    });
  }

  async findByUsernameWithPassword(username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  private async userExist(user: CreateUserDto) {
    const { username, email } = user;
    const existUsername = await this.userRepository.findOne({ username });
    const existEmail = await this.userRepository.findOne({ email });
    if (existUsername || existEmail) {
      throw new ConflictException({
        username: existUsername?.username,
        email: existEmail?.email,
      });
    }
  }

  async verify(user: User) {
    user.emailVerified = true;
    return this.userRepository.save(user);
  }
}
