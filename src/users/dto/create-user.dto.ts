import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsAlphanumeric,
  IsString,
  IsStrongPassword,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @Optional()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 0,
      minUppercase: 0,
    },
    { message: 'Password is too weak, min 8 characters, 1 number, 1 symbol' },
  )
  password: string;

  @IsEmail()
  email: string;

  @IsAlphanumeric()
  @IsString()
  user_id: string;

  create_time?: Date;
}
