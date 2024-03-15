import { Module } from '@nestjs/common';
import { ChannelController } from './slide-channel.controller';
import { ChannelService } from './slide-channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideChannel } from './entities/slide_channel.entity';
import { Forum } from 'src/modules/forum/forum/entities/forum.entity';
import { SlideSlide } from '../slide-slide/entities/slide_slide.entity';
import { SlideSlideService } from '../slide-slide/slide_slide.service';
import { RatingModule } from 'src/modules/rating/rating-rating/rating.module';
import { SlideCommentService } from 'src/modules/rating/rating-rating/slide_comment.service';
import { IrModel } from 'src/modules/ir/ir-model/entities/ir_model.entity';
import { Rating } from 'src/modules/rating/rating-rating/entities/rating_rating.entity';

import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { MailMessage } from 'src/modules/mail-message/entities/mail-message.entity';
import { IrModelAccessService } from 'src/modules/ir/ir.model.access/ir_model_access.service';
import { SlideChannelPartnerModule } from '../slide-channel-partner/slide_channel_partner.module';
import { PartnerService } from 'src/modules/res/res.partner/partner.service';
import { CompanyService } from 'src/modules/res/res.company/company.service';
import { CompanyModule } from 'src/modules/res/res.company/company.module';
import { UserModule } from 'src/modules/res/res.user/user.module';

@Module({
  controllers: [ChannelController],
  providers: [
    ChannelService,
    SlideSlideService,
    SlideCommentService,
    IrModelAccessService,
    PartnerService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      SlideChannel,
      Forum,
      SlideSlide,
      IrModel,
      Rating,
      Partner,
      User,
      MailMessage,
    ]),
    CompanyModule,
    UserModule,
    RatingModule,
    SlideChannelPartnerModule,
  ],
  exports: [ChannelService],
})
export class ChannelModule {}
