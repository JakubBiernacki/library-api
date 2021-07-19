import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from './entities/auth-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
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

  async createAuthToken(user: User) {
    const token = await this.authTokenRepository.create();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    token.code = '' + Date.now() + Math.round(Math.random() * 1e9);
    token.expires = expires;
    token.user = user;

    return this.authTokenRepository.save(token);
  }

  public sendConfirmEmail(user: User, token): void {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Confirm Email ✔',
        template: process.cwd() + '/templates/confirm-email', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: {
          username: user.username,
          token,
          id: user.id,
        },
      })
      .then(() => console.log(`send email to ${user.username}`));
  }
  async verifyUser(userId: number, code: string) {
    const user = await this.usersService.findOne(userId);
    const token = await this.authTokenRepository.findOne({ user, code });

    if (token && token?.expires >= new Date()) {
      await this.usersService.verify(user);
      return true;
    }
    throw new ForbiddenException();
  }
}
