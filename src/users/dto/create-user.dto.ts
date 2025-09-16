import { IsString, IsEmail, IsOptional, MinLength, IsInt, IsObject } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string; // Admin, Teacher, Student, Guest

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  age?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsInt()
  account_type?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
