import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlideChannelPartner } from './entities/slide_channel_partner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SlideChannelPartnerService {
  constructor(
    @InjectRepository(SlideChannelPartner)
    private repos: Repository<SlideChannelPartner>,
  ) {}
  async isIn(partnerId: number, channelId: number) {
    // ensure partnerId and channelId is exist in database:

    // check

    const result = await this.repos.findOne({
      where: {
        partner: {
          id: partnerId,
        },
        channel: {
          id: channelId,
        },
      },
    });

    return result == null ? false : true;
  }
}
