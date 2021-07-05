import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AllowRoles } from '../auth/decorator/roles.decorator';
import { UserRole } from './enums/user-role';
import { Public } from '../auth/decorator/public.decorator';
import { UserRegisterFilter } from '../../common/filters/user-register.filter';
import { UserIsUserOrHasRoleGuard } from '../auth/guards/user-is-userOrRole.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@AllowRoles(UserRole.ADMIN)
@UseGuards(UserIsUserOrHasRoleGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    return {
      access_token: await this.usersService.login(loginUser),
    };
  }

  @Public()
  @UseFilters(UserRegisterFilter)
  @Post('register')
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @Get()
  findAll({ offset, limit }: PaginationDto) {
    return this.usersService.findAll(offset, limit);
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
