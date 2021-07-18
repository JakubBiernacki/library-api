import { Controller, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { GetUser } from './decorator/user.decorator';
import { Cookie } from '../../common/enum/cookie.enum';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) response: Response, @GetUser() user) {
    const jwtToken = await this.authService.generateJWT(user);

    response.cookie(Cookie.JWT, jwtToken, {
      httpOnly: true,
    });

    return user;
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(Cookie.JWT);
  }
}
