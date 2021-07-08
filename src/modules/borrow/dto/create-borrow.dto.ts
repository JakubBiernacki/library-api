import { IsDateString, IsOptional, ValidateNested } from 'class-validator';

export class CreateBorrowDto {
  client: string;

  books: string[];

  @IsOptional()
  @IsDateString()
  borrow_date: string;

  @ValidateNested()
  employee_borrow: string;
}
