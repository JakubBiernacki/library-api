import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from 'src/modules/users/dto/login-user.dto';
import { UserDto } from 'src/modules/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: UserDto) {
    return this.authService.register(user);
  }

  @Post('login')
  async login(@Body() user: LoginUserDto) {
    const token = await this.authService.login(user);
    return { access_token: token };
  }
}
