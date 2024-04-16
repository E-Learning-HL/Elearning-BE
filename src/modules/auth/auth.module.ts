import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthConfig } from 'src/common/config/config.type';
import { MailService } from 'src/common/mail/mail.service';
import { MailModule } from 'src/common/mail/mail.module';
import { RoleGuard } from '../role/guards/role.guard';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, RoleGuard],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UsersModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // useFactory:  (configService: ConfigService) => ({
      //   secret: 'secret',
      //   signOptions: {
      //     expiresIn: '15m',
      //   },
      // }),
      useFactory: async (configService: ConfigService) => {
        const authConfig = configService.get<AuthConfig>('auth', {
          infer: true,
        });
        if (!authConfig) {
          throw new Error('Auth configuration is missing!');
        }
        console.log('authConfig.expires', authConfig.expires);
        return await {
          secret: authConfig.secret || 'secret',
          signOptions: {
            expiresIn: authConfig.expires || '30d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
