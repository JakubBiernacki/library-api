import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Public } from '../auth/decorator/public.decorator';
import { UserRole } from '../users/enums/user-role';
import { AllowRoles } from '../auth/decorator/roles.decorator';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @AllowRoles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.authorsService.findOne(id);
  }

  @Public()
  @Get(':id/books')
  findOneAndGetBooks(@Param('id') id: number) {
    return this.authorsService.findOneAndGetBooks(id);
  }

  @AllowRoles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @AllowRoles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.authorsService.remove(id);
  }
}
