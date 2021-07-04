import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async login(loginUser: LoginUserDto) {
    const user = await this.findByUsernameWithPassword(
      loginUser.username,
    ).catch(() => {
      throw new UnauthorizedException();
    });

    const compare = await this.authService.comparePasswords(
      loginUser.password,
      user.password,
    );
    delete user.password;
    if (compare) {
      return this.authService.generateJWT(user);
    }

    throw new UnauthorizedException();
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

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.userRepository.update(user, { ...updateUser });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }
    return this.userRepository.delete(id);
  }

  private async findByUsernameWithPassword(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  private async userExist(user: CreateUserDto) {
    const { username, email } = user;
    const existUsername = await this.userRepository.findOne({ username });
    const existEmail = await this.userRepository.findOne({ email });

    if (existUsername || existEmail) {
      const errorObject: Record<string, any> = {
        statusCode: HttpStatus.CONFLICT,
        fields: {},
        error: 'Conflict',
      };

      existUsername
        ? (errorObject.fields.username = `User with username: ${username} already exist`)
        : false;

      existEmail
        ? (errorObject.fields.email = `User with email: ${email} already exist`)
        : false;

      throw new ConflictException(errorObject);
    }
  }
}
