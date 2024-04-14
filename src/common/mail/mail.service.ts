import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import { AllConfigType } from 'src/common/config/config.type';

import path from 'path';
import { MailerService } from '../mailer/mailer.service';
import { MaybeType } from 'src/utils/types/maybe.type';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle] = await Promise.all([
        i18n.t('common.confirmEmail'),
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'common',
        'mail',
        'mail-templates',
        'verify-mail.hbs',
      ),
      context: {
        code_email: mailData.code,
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle] = await Promise.all([
        i18n.t('common.resetPassword')
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'common',
        'mail',
        'mail-templates',
        'verify-mail.hbs',
      ),
      context: {
        code_email: mailData.code,
      },
    });
  }
  
  async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực email',
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'common',
        'mail',
        'mail-templates',
        'verify-mail.hbs',
      ),
      context: {
        code_email: code,
      },
    });
  }
}
