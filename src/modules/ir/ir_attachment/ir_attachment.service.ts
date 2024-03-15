import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityTarget, Repository } from 'typeorm';
import { IrAttachment } from './entities/ir_attachment.entity';

@Injectable()
export class IrAttachmentService {
  constructor(
    @InjectRepository(IrAttachment) private repos: Repository<IrAttachment>,
  ) {}
  async getAttachments(
    model: string,
    resId?: number,
    name?: string,
    resField?: string,
  ) {
    const attachment = await this.repos.find({
      where: {
        resId: resId,
        resModel: model,
        name: name,
        resField: resField,
      },
    });

    const returnedData: any[] = [];
    for (let i of attachment) {
      returnedData.push({
        id: i.id,
        attachmentServer: i.attachmentServer,
        resId: i.resId,
        resModel: i.resModel,
        resField: i.resField,
      } as IrAttachment);
    }
  }
}
