import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SlideSlide } from './slide_slide.entity';
import { SlideChannel } from '../../slide-channel/entities/slide_channel.entity';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';

@Entity('slide_slide_partner')
export class SlideSlidePartner extends BaseEntity {
  @ManyToOne(() => SlideSlide)
  @JoinColumn({
    name: 'slide_id',
  })
  slide: SlideSlide;

  @ManyToOne(() => SlideChannel)
  @JoinColumn({
    name: 'channel_id',
  })
  channel: SlideChannel;

  @ManyToOne(() => SlideSlide)
  @JoinColumn({
    name: 'partner_id',
  })
  partner: Partner;

  @Column({
    name: 'survey_scoring_success',
  })
  surveyScoringSuccess: boolean;

  @Column({
    name: 'vote',
    transformer: {
      to(value) {
        if (value == true) {
          return 1;
        }
        return 0;
      },
      from(value) {
        if (value == 1) {
          return true;
        }
        return false;
      },
    },
  })
  liked: boolean;

  @Column({
    name: 'quiz_attempts_count',
  })
  quizAttemptsCount: number;

  @Column({
    name: 'completed',
  })
  isCompleted: boolean;
}
