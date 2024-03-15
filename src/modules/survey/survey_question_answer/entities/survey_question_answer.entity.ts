import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SurveyQuestion } from '../../survey_question/entities/survey_question.entity';
import { Exclude } from 'class-transformer';

@Entity('survey_question_answer')
export class SurveyQuestionAnswer extends BaseEntity {
  @ManyToOne(() => SurveyQuestion)
  @JoinColumn({
    name: 'question_id',
  })
  question: SurveyQuestion;

  @ManyToOne(() => SurveyQuestion)
  @JoinColumn({
    name: 'matrix_question_id',
  })
  maxtrixQuestion: SurveyQuestion;

  @Column({
    name: 'value_image_filename',
  })
  valueImageFileName?: string;

  @Column({
    type: 'jsonb',
  })
  value: any;

  @Column({
    name: 'is_correct',
  })
  @Exclude()
  isCorrect: boolean;

  @Column({
    name: 'answer_score',
    type: 'double precision',
  })
  answerScore: number;

  @Column()
  sequence: number;

  @Column({
    name: 'correct_answer_edit',
  })
  correctedAnswer: string;
}
