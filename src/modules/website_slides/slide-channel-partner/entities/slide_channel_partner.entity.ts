import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SlideChannel } from '../../slide-channel/entities/slide_channel.entity';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';

@Entity('slide_channel_partner')
export class SlideChannelPartner extends BaseEntity {
  @ManyToOne(() => SlideChannel, (c) => c.id)
  @JoinColumn({
    name: 'channel_id',
  })
  channel: SlideChannel;

  @Column()
  completion: number;

  @Column({
    name: 'completed_slides_count',
  })
  completedSlideCount: number;

  @ManyToOne(() => Partner)
  @JoinColumn({
    name: 'partner_id',
  })
  partner: Partner;

  @Column({
    name: 'completed',
  })
  isCompleted: boolean;
}
