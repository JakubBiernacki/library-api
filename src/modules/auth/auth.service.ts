import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  generateJWT({ id }: User) {
    return this.jwtService.signAsync({ user: { id } });
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }

  async validateUser(username, password) {
    const user = await this.usersService.findByUsernameWithPassword(username);
    if (user && (await this.comparePasswords(password, user.password))) {
      delete user.password;
      return user;
    }

    return false;
  }
}
