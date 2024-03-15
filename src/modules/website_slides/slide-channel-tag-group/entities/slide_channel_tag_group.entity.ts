import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { SlideChannelTag } from '../../slide-channel-tag/entities/slide_channel_tag.entity';

@Entity('slide_channel_tag_group')
export class SlideChannelTagGroup extends BaseEntity {
  @Column()
  sequence: number;
  @Column({
    type: 'jsonb',
  })
  name: any;
  @Column({
    name: 'is_published',
  })
  isPublished: boolean;

  @OneToMany(() => SlideChannelTag, (x) => x.group)
  slideChannelTags: SlideChannelTag[];
}
