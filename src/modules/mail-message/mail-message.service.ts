import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailMessage } from './entities/mail-message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MailMessageService {
    constructor(
        @InjectRepository(MailMessage) private mailMessageRepos : Repository<MailMessage>
    ){}

    async findOne(id : number) : Promise<MailMessage | null>{
        return await this.mailMessageRepos.findOne({where : {id}})
    }
}
