import { Module } from '@nestjs/common';

import databaseConfig from './common/config/database.config';
import authConfig from './common/config/auth.config';
import appConfig from './common/config/app.config';
import mailConfig from './common/config/mail.config';
import fileConfig from './common/config/file.config';
import facebookConfig from './common/config/facebook.config';
import googleConfig from './common/config/google.config';
import twitterConfig from './common/config/twitter.config';
import appleConfig from './common/config/apple.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './common/config/config.type';
import { FilesModule } from './common/files/files.module';
import { AuthModule } from './modules/auth/auth/auth.module';
import { AuthFacebookModule } from './modules/auth/auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './modules/auth/auth-google/auth-google.module';
import { AuthTwitterModule } from './modules/auth/auth-twitter/auth-twitter.module';
import { AuthAppleModule } from './modules/auth/auth-apple/auth-apple.module';
import { MailModule } from './common/mail/mail.module';
import { MailerModule } from './common/mailer/mailer.module';
import { ForgotModule } from './modules/forgot/forgot.module';
import { ChannelModule } from './modules/website_slides/slide-channel/slide-channel.module';
import { SessionModule } from './modules/session/session.module';
import { ApiModule } from './modules/api/api.module';
import { IrModuleCategoryModule } from './modules/ir/ir-module-category/ir_module_category.module';
import { RatingModule } from './modules/rating/rating-rating/rating.module';
import { MailMessageModule } from './modules/mail-message/mail-message.module';
import { SurveyModule } from './modules/survey/survey_survey/survey.module';
import { SurveySkillModule } from './modules/survey/survey_skill/survey_skill.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthTwitterModule,
    AuthAppleModule,
    ForgotModule,
    MailModule,
    MailerModule,
    HomeModule,
    ChannelModule,
    SessionModule,
    IrModuleCategoryModule,
    RatingModule,
    MailMessageModule,
    SurveyModule,
    SurveySkillModule,
  ],
})
export class AppModule {}
