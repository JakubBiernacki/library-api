import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AllowRoles } from '../auth/decorator/roles.decorator';
import { UserRole } from './enums/user-role';
import { Public } from '../auth/decorator/public.decorator';
import { UserRegisterFilter } from '../../common/filters/user-register.filter';
import { UserIsUserOrHasRoleGuard } from '../auth/guards/user-is-userOrRole.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { GetUser } from '../auth/decorator/user.decorator';
import { Response } from 'express';
import { Cookie } from '../../common/constants';

@AllowRoles(UserRole.ADMIN)
@UseGuards(UserIsUserOrHasRoleGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) response: Response, @GetUser() user) {
    const jwtToken = await this.usersService.authService.generateJWT(user);

    response.cookie(Cookie.JWT, jwtToken, {
      httpOnly: true,
    });

    return user;
  }

  @AllowRoles(UserRole.USER, UserRole.EMPLOYEE)
  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie(Cookie.JWT, { maxAge: 0 });
  }

  @Public()
  @UseFilters(UserRegisterFilter)
  @Post('register')
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @Get()
  findAll({ page, limit }: PaginationDto) {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.paginateAll({
      page,
      limit,
      route: '/users',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUser: UpdateUserDto) {
    return this.usersService.update(id, updateUser);
  }

  @Patch(':id/role')
  async updateRoleOfUser(
    @Param('id') id: number,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRoleOfUser(id, role);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
