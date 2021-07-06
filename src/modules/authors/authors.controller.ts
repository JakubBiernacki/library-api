import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Public } from '../auth/decorator/public.decorator';
import { UserRole } from '../users/enums/user-role';
import { AllowRoles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@AllowRoles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @AllowRoles(UserRole.EMPLOYEE)
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }
  @Public()
  @Get()
  findAll(@Query() { page = 1, limit = 10 }: PaginationDto) {
    limit = limit > 100 ? 100 : limit;
    return this.authorsService.paginateAll({
      page,
      limit,
      route: '/authors',
    });
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

  @AllowRoles(UserRole.EMPLOYEE)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.authorsService.remove(id);
  }
}
