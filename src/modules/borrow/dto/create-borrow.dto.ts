import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';

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

  employee?: User;
}
