import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBorrowDto {
  @IsNotEmpty()
  @IsString()
  client: string;

  @IsNotEmpty()
  @IsString({ each: true })
  books: string[];

  @IsOptional()
  @IsDateString()
  borrow_date: string;
}
