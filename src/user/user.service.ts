import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { Prisma, User } from 'src/generated/prisma/client';
import { RegisterUserDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository){}

    createUser(data: RegisterUserDto):Promise<User>{
        return this.userRepo.createUser(data);
    }

    findByEmail(email:string):Promise<User | null>{
        return this.userRepo.findUserByEmail(email);
    }
}
