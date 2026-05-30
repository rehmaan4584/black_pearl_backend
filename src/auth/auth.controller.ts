import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterUserDto} from './dto/register.dto';
import { ResponseUserDto } from './dto/responseUser.dto';
import { AuthService } from './auth.service';
// import { LoginUserDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = {
  user: {
    userId: number;
    email: string;
    role: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<ResponseUserDto> {
    const user = await this.authService.register(dto);
    return {
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      role: user.userType
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUserInfo(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
