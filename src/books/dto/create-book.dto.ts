import { IsNotEmpty, IsString, MinLength, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsString({ each: true })
  category: string[];

  @IsNotEmpty()
  author: string;

  @IsString()
  cover?: string;

  @IsDateString()
  pub_date?: string;
}
