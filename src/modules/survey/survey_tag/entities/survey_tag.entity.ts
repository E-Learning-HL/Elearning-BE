import { BaseEntity } from 'src/database/base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { SurveyTagGroup } from './survey_tag_group.entity';
import { Survey } from '../../survey_survey/entities/survey_survey.entity';

@Entity('survey_channel_tag')
export class SurveyTag extends BaseEntity {
  @Column()
  sequence: number;

  @Column({
    name: 'group_sequence',
  })
  groupSequence: number;

  @Column()
  color: number;

  @Column({
    type: 'jsonb',
  })
  name: any;

  @ManyToOne(() => SurveyTagGroup, (group) => group.id)
  @JoinColumn({
    name: 'group_id',
  })
  tagGroup: SurveyTagGroup[];

  @ManyToMany(() => Survey, (s) => s.tags)
  @JoinTable({
    name: 'survey_channel_tag_rel',
    inverseJoinColumn: {
      name: 'survey_id',
    },
    joinColumn: {
      name: 'tag_id',
    },
  })
  surveys: Survey[];

  @Column({
    name: 'exam_code_start_datetime',
  })
  startValidDatetime: Date;
  @Column({
    name: 'exam_code_end_datetime',
  })
  endValidDatetime: Date;
}
