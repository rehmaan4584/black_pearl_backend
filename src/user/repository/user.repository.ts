import { User } from 'src/generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  createUser(data: RegisterUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
