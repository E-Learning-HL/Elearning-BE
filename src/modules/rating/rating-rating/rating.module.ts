import { Module } from '@nestjs/common';
import { SlideCommentService } from './slide_comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating_rating.entity';
import { IrModel } from '../../ir/ir-model/entities/ir_model.entity';
import { SlideCommentController } from './slide_comment.controller';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { MailMessage } from '../../mail-message/entities/mail-message.entity';
import { SlideChannel } from 'src/modules/website_slides/slide-channel/entities/slide_channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, IrModel, Partner,  MailMessage,User, SlideChannel])],
  providers: [SlideCommentService],
  controllers : [SlideCommentController]
})
export class RatingModule {}