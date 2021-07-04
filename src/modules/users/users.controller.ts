import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AllowRoles } from '../auth/decorator/roles.decorator';
import { UserRole } from './enums/user-role';
import { Public } from '../auth/decorator/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUser: LoginUserDto) {
    return {
      access_token: await this.usersService.login(loginUser),
    };
  }

  @Public()
  @Post('register')
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @AllowRoles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @AllowRoles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @AllowRoles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUser: UpdateUserDto) {
    return this.usersService.update(id, updateUser);
  }

  @AllowRoles(UserRole.ADMIN)
  @Patch(':id/role')
  async updateRoleOfUser(
    @Param('id') id: number,
    @Body('role') newRole: UserRole,
  ) {
    return this.usersService.updateRoleOfUser(id, newRole);
  }

  @AllowRoles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
