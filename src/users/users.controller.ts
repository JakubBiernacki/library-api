import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AllowRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @AllowRoles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request) {
    console.log(request.user.id);

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUser: UpdateUserDto) {
    return this.usersService.update(id, updateUser);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
