import { Gender } from '@/models/users.model';
import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class CreateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsEnum(Gender)
  public gender: Gender;

  @IsString()
  public birthday: string;

  @IsString()
  public address: string;

  @IsString()
  public contactNumber: string;
}

export class UpdateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsEnum(Gender)
  public gender: Gender;

  @IsString()
  public birthday: string;

  @IsString()
  public address: string;

  @IsString()
  public contactNumber: string;

  @IsString()
  public password: string;
}
