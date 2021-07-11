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
import { IsOwnerGuard } from './guards/is-owner.guard';
import { ClosedGuard } from './guards/closed.guard';

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
  findOne(@Param('id') id) {
    return this.borrowService.findOne(id);
  }

  @UseGuards(ClosedGuard, IsOwnerGuard)
  @AllowRoles(UserRole.EMPLOYEE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowService.update(id, updateBorrowDto);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Patch(':id/close')
  close(@Req() { user }, @Param('id') id: string) {
    return this.borrowService.close(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowService.remove(+id);
  }
}
