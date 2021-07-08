import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Author } from 'src/modules/authors/entities/author.entity';
import { Category } from '../enums/category.enum';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsEnum(Category, { each: true })
  categories: Category[];

  @IsOptional()
  author?: Author;

  @IsOptional()
  @IsPositive()
  page?: number;

  @IsOptional()
  cover?: string;

  @IsOptional()
  @Min(0)
  quantity?: number;

  @IsDateString()
  @IsOptional()
  pub_date?: string;
}
