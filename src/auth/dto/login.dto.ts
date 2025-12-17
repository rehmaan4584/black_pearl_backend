import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password, min 8 chars', minLength: 8 })
  @IsNotEmpty()
  password: string;
}
