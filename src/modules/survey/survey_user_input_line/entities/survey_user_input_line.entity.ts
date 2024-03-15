import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { SurveyUserInput } from '../../survey_user_input/entities/survey_user_input.entity';
import { Survey } from '../../survey_survey/entities/survey_survey.entity';
import { SurveyQuestion } from '../../survey_question/entities/survey_question.entity';
import { SurveyQuestionAnswer } from '../../survey_question_answer/entities/survey_question_answer.entity';
import { SurveyAnswerType } from '../enums/survey_user_input_line.enum';
import { IrAttachment } from 'src/modules/ir/ir_attachment/entities/ir_attachment.entity';

@Entity('survey_user_input_line')
export class SurveyUserInputLine extends BaseEntity {
  @ManyToOne(() => SurveyUserInput)
  @JoinColumn({
    name: 'user_input_id',
  })
  userInput: SurveyUserInput;

  @ManyToOne(() => Survey, {
    persistence: false,
  })
  @JoinColumn({
    name: 'survey_id',
  })
  survey: Survey;

  @ManyToOne(() => SurveyQuestion, {
    persistence: false,
  })
  @JoinColumn({
    name: 'question_id',
  })
  question: SurveyQuestion;

  @ManyToOne(() => SurveyQuestionAnswer)
  @JoinColumn({
    name: 'suggested_answer_id',
  })
  userAnswer: SurveyQuestionAnswer;

  @ManyToOne(() => SurveyQuestionAnswer)
  @JoinColumn({
    name: 'matrix_row_id',
  })
  userAnswerMatrixRow: SurveyQuestionAnswer;

  @Column({
    name: 'answer_type',
    enum: SurveyAnswerType,
  })
  answerType: SurveyAnswerType;

  @Column({
    name: 'value_char_box',
  })
  valueCharBox: string;

  @Column({
    name: 'value_date',
  })
  valueDate: Date;

  @Column({
    name: 'value_text_box',
  })
  valueTextBox: string;

  @Column({
    name: 'skipped',
  })
  isSkipped: boolean = false;

  @Column({
    name: 'answer_is_correct',
  })
  answerIsCorrect: boolean = false;

  @Column({
    name: 'value_datetime',
  })
  valueDatetime: Date;

  @Column({
    name: 'value_numerical_box',
  })
  valueNumericalBox: number;

  @Column({
    name: 'answer_score',
  })
  answerScore: number;

  @Column({
    name: 'value_only_text',
  })
  valueOnlyText: string;

  @Column({
    name: 'value_recording_url',
  })
  valueAudio: string;

  @Column({
    name: 'question_sequence',
  })
  questionSequence: number;
}
