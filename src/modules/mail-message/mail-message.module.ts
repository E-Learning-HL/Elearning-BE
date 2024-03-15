import { Module } from '@nestjs/common';
import { MailMessageService } from './mail-message.service';
import { MailMessageController } from './mail-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailMessage } from './entities/mail-message.entity';

@Module({
  imports : [TypeOrmModule.forFeature([MailMessage])],
  providers: [MailMessageService],
  controllers: [MailMessageController]
})
export class MailMessageModule {}
