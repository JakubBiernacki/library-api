import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowDto } from './create-borrow.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBorrowDto extends PartialType(CreateBorrowDto) {
  @IsOptional()
  @IsString()
  employee_borrow?: string;
}
