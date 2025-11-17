import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RefreshAuthStrategy } from './strategies/refresh-strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, RefreshAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
