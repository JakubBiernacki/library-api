import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { AllowRoles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../users/enums/user-role';
import { RolesGuard } from '../auth/guards/roles.guard';

@AllowRoles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @AllowRoles(UserRole.EMPLOYEE)
  @Post()
  create(@Req() { user }, @Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.create(createBorrowDto, user);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Get()
  findAll() {
    return this.borrowService.findAll();
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowService.findOne(+id);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowService.update(+id, updateBorrowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowService.remove(+id);
  }
}
