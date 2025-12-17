import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    const{ name, email, password, userType } = dto;
    return this.authService.register({ name, email, password, userType });
  }

    @Post('login')
    login(@Body() dto: LoginUserDto) {
        const { email, password } = dto;
        return this.authService.login({ email, password });
    }
}
