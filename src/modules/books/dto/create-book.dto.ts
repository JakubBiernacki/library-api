import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Author } from 'src/modules/authors/entities/author.entity';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsString({ each: true })
  category: string[];

  @IsOptional()
  author?: Author;

  @IsOptional()
  cover?: string;

  @IsDateString()
  @IsOptional()
  pub_date?: string;
}
