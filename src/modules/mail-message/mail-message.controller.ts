import { Controller, Get, Param } from '@nestjs/common';
import { MailMessageService } from './mail-message.service';
import { ApiTags } from '@nestjs/swagger';
import { MailMessage } from './entities/mail-message.entity';


@ApiTags('Mail-Messages')
@Controller('mail-message')
export class MailMessageController {
    constructor( private readonly mailMessageService : MailMessageService ){}

    @Get(':id')
    async getById(@Param('id') id : number) : Promise<MailMessage | null>{
        return await this.mailMessageService.findOne(id)
    }
}
