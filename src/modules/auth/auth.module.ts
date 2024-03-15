import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers:[AuthController],
  exports: [AuthService],
  imports:[UsersModule, PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory:  (configService: ConfigService) => ({
      secret: 'secret',
      signOptions: {
        expiresIn: '15m',
      },
    }),
    inject: [ConfigService],
  }),]
})
export class AuthModule {}
