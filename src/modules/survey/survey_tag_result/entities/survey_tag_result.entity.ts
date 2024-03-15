import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SurveyUserInput } from '../../survey_user_input/entities/survey_user_input.entity';
import { SurveyTag } from '../../survey_tag/entities/survey_tag.entity';

@Entity('survey_user_input_tag_result')
export class SurveyUserInputTagResult extends BaseEntity {
  @ManyToOne(() => SurveyUserInput)
  @JoinColumn({
    name: 'input_id',
  })
  input: SurveyUserInput;

  @ManyToOne(() => SurveyTag)
  @JoinColumn({
    name: 'tag_id',
  })
  tag: SurveyTag;

  @Column({
    name: 'tag_name',
  })
  tagName: string;
  @Column({
    name: 'total_correct_answer',
  })
  total: number;
}
