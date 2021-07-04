import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}
