import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { GetUser } from '../auth/decorator/user.decorator';

@AllowRoles(UserRole.ADMIN)
@UseGuards(UserIsUserOrHasRoleGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @UseFilters(UserRegisterFilter)
  @Post('register')
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @AllowRoles(true)
  @Get('me')
  me(@Req() req, @GetUser() user) {
    return user;
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
