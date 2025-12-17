import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserTypes } from '../../generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email', example: 'abc@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password, min 8 chars', minLength: 8 })
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'User type', enum: ['buyer', 'seller'] })
  @IsEnum(UserTypes)
  userType: UserTypes;
}
