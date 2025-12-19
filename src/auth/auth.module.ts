import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategy/auth-local.strategy';
import { JwtModule} from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt-auth.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'my_secret',
      signOptions:{
        expiresIn: '1h'
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalAuthGuard,LocalStrategy,JwtAuthGuard,JwtStrategy,RolesGuard],
})
export class AuthModule {}
