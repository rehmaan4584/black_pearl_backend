import { Injectable } from '@nestjs/common';
import { LoginUserInput, RegisterUserInput } from 'src/shared/interfaces/user.interface';


@Injectable()
export class AuthService {
    register(registerData: RegisterUserInput) {
        return "User registered successfully";
    }

    login(loginData: LoginUserInput) {
        return "User logged in successfully";
    }
}
