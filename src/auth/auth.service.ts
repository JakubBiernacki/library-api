import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  generateJWT(user: UserDto) {
    return this.jwtService.signAsync({ user });
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  compatePasswords(newPassword: string, passwordHash: string) {
    return bcrypt.compare(newPassword, passwordHash);
  }

  async login(user: LoginUserDto) {
    const validateUser = await this.validateUser(user.username, user.password);

    return this.generateJWT(validateUser);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsernameWithPassword(username);

    if (await this.compatePasswords(password, user.password)) {
      delete user.password;
      return user;
    }

    throw Error;
  }

  async register(user: UserDto): Promise<User> {
    const hashpass = await this.hashPassword(user.password);
    const newUser = await this.usersService.create({
      ...user,
      password: hashpass,
    });

    delete newUser.password;

    return newUser;
  }
}
