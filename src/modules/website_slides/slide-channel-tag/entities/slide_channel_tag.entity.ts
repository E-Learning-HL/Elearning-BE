import { BaseEntity } from 'src/database/base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { SlideChannelTagGroup } from '../../slide-channel-tag-group/entities/slide_channel_tag_group.entity';
import { SlideChannel } from '../../slide-channel/entities/slide_channel.entity';

@Entity('slide_channel_tag')
export class SlideChannelTag extends BaseEntity {
  @Column()
  sequence: number;
  @ManyToOne(() => SlideChannelTagGroup)
  @JoinColumn({
    name: 'group_id',
  })
  group: SlideChannelTagGroup;

  @ManyToMany(() => SlideChannel)
  @JoinTable({
    name: 'slide_channel_tag_rel',
    joinColumn: {
      name: 'tag_id',
    },
    inverseJoinColumn: {
      name: 'channel_id',
    },
  })
  channels: SlideChannel[];

  @Column({
    name: 'group_sequence',
  })
  groupSequence: number;

  @Column({
    type: 'jsonb',
  })
  name: any;

  @Column()
  color: number;
}
