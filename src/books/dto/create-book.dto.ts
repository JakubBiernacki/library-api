import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsString({ each: true })
  category: string[];

  author?: number;

  cover?: string;

  @IsDateString()
  @IsOptional()
  pub_date?: string;
}
