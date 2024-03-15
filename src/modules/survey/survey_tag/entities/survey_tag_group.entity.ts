import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { SurveyTag } from './survey_tag.entity';
import { Exclude } from 'class-transformer';

@Entity('survey_channel_tag_group')
export class SurveyTagGroup extends BaseEntity {
  @Column()
  sequence: number;

  @Column()
  name: string;

  @Column({
    name: 'is_published',
  })
  @Exclude()
  isPublished: boolean;

  @OneToMany(() => SurveyTag, (tag) => tag.tagGroup)
  tags: SurveyTag;
}
