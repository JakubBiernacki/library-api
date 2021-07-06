import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
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
    private readonly authService: AuthService,
  ) {}

  async login(loginUser: LoginUserDto) {
    const user = await this.findByUsernameWithPassword(loginUser.username);

    if (user instanceof User) {
      const compare = await this.authService.comparePasswords(
        loginUser.password,
        user.password,
      );
      delete user.password;

      if (compare) return this.authService.generateJWT(user);
    }

    throw new UnauthorizedException('Login failed');
  }

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

  private async findByUsernameWithPassword(username: string) {
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
}
