import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register.dto';
import { User } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
// import { LoginUserInput, RegisterUserInput } from 'src/shared/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userServive: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userInfo: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    return this.userServive.createUser({
      ...userInfo,
      password: hashedPassword,
    });
  }

  async validate(email: string, password: string): Promise<User | null> {
    const user = await this.userServive.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }

  async login(user: { id: number; email: string, userType:string }) {
    return {
      token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.userType }),
    };
  }
}
