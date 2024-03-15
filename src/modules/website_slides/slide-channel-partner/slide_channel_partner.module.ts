import { Module } from '@nestjs/common';
import { SlideChannelPartnerService } from './slide_channel_partner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideChannelPartner } from './entities/slide_channel_partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SlideChannelPartner])],
  providers: [SlideChannelPartnerService],
  exports: [SlideChannelPartnerService],
})
export class SlideChannelPartnerModule {}
