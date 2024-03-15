import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Survey } from '../../survey_survey/entities/survey_survey.entity';
import { SurveyQuestionType } from '../enums/question_type.enum';
import { SurveyMatrixSubtype } from '../enums/matrix_subtype.enum';
import { BaseEntity } from '../../../../database/base/base.entity';
import { SurveyQuestionAnswer } from '../../survey_question_answer/entities/survey_question_answer.entity';
import { SurveyUserInputLine } from '../../survey_user_input_line/entities/survey_user_input_line.entity';
import { Exclude, Transform } from 'class-transformer';
import { IrAttachmentService } from 'src/modules/ir/ir_attachment/ir_attachment.service';
import { SurveyTag } from '../../survey_tag/entities/survey_tag.entity';
import { SurveySkill } from '../../survey_skill/entities/survey_skill.entity';
import { SurveyUserInput } from '../../survey_user_input/entities/survey_user_input.entity';
import { QuestionState } from '../enums/state.enum';

@Entity('survey_question')
export class SurveyQuestion extends BaseEntity {
  @OneToMany(() => SurveyUserInputLine, (line) => line.question)
  userAnswers: SurveyUserInputLine[];

  @OneToMany(() => SurveyQuestionAnswer, (answ) => answ.question, {
    eager: true,
    persistence: false,
  })
  suggestedAnswers: SurveyQuestionAnswer[];

  @OneToMany(() => SurveyQuestionAnswer, (answ) => answ.maxtrixQuestion, {
    eager: true,
    persistence: false,
  })
  maxtrixSuggestedAnswers: SurveyQuestionAnswer[];

  @ManyToOne(() => Survey)
  @JoinColumn({
    name: 'survey_id',
  })
  survey: Survey;

  @Column()
  sequence: number;

  @Column({
    name: 'page_id',
  })
  pageId: number;

  @Column({
    name: 'time_limit',
  })
  timeLimit: number;

  // @Column({
  //   name: 'triggering_question_id',
  // })
  // triggeringQuestion: number;

  // @Column({
  //   name: 'triggering_answer_id',
  // })
  // triggeringAnswer: number;
  // answer

  @Column({
    name: 'question_type',
    enum: SurveyQuestionType,
  })
  questionType: SurveyQuestionType;

  @Column({
    name: 'matrix_subtype',
    enum: SurveyMatrixSubtype,
  })
  matrixSubtype: SurveyMatrixSubtype;

  @Column({
    name: 'answer_date',
  })
  @Exclude()
  answerDate: Date;

  @Column({
    name: 'validation_min_date',
  })
  @Exclude()
  validationMinDate: Date;

  @Column({
    name: 'validation_max_date',
  })
  @Exclude()
  validationMaxDate: Date;

  @Column({
    type: 'jsonb',
  })
  title: any;

  @Column({
    name: 'description',
    type: 'jsonb',
  })
  description: any;

  @Column({
    name: 'question_placeholder',
    type: 'jsonb',
  })
  questionPlaceholder: any;

  @Column({
    type: 'jsonb',
    name: 'comments_message',
  })
  commentsMessage: any;

  @Column({
    name: 'validation_error_msg',
    type: 'jsonb',
  })
  validationErrorMsg: any;

  @Column({
    name: 'constr_error_msg',
    type: 'jsonb',
  })
  constrErrorMsg: any;

  @Column({
    name: 'is_page',
  })
  isPage: boolean;

  @Column({
    name: 'is_scored_question',
  })
  isScoredQuesiton: boolean;

  @Column({
    name: 'save_as_email',
  })
  saveAsEmail: boolean;

  @Column({
    name: 'validation_length_max',
  })
  validationLengthMax: number;

  @Column({
    name: 'validation_length_min',
  })
  validationLengthMin: number;

  @Column({
    name: 'save_as_nickname',
  })
  saveAsNickName: boolean;

  @Column({
    name: 'is_time_limited',
  })
  isTimeLimited: boolean;

  @Column({
    name: 'comments_allowed',
  })
  commentsAllowed: boolean;

  @Column({
    name: 'comment_count_as_answer',
  })
  commentCountAsAnswer: boolean;

  @Column({
    name: 'validation_required',
  })
  validationRequired: boolean;

  @Column({
    name: 'validation_email',
  })
  validatioEmail: boolean;

  @Column({
    name: 'constr_mandatory',
  })
  constrMandatory: boolean;

  @Column({
    name: 'answer_datetime',
  })
  @Exclude()
  answerDatetime: Date;

  @Column({
    name: 'validation_min_datetime',
  })
  @Exclude()
  validationMinDatetime: boolean;

  @Column({
    name: 'validation_max_datetime',
  })
  @Exclude()
  validationMaxDatetime: Date;

  @Column({
    name: 'answer_numerical_box',
  })
  @Exclude()
  answerNumericalBox: number;

  @Column({
    name: 'answer_score',
    type: 'double precision',
  })
  answerScore: number;

  @Column({
    name: 'validation_min_float_value',
  })
  @Exclude()
  validationMinFloatValue: number;

  @Column({
    name: 'validation_max_float_value',
  })
  @Exclude()
  validationMaxFloatValue: number;

  // @Column({
  //   name: 'answer_only_text',
  // })
  // @Exclude()
  // answerOnlyText: string;

  @Column({
    name: 'audio_filename',
  })
  audioFilename: string;

  @Column({
    name: 'answer_recording_file_name',
  })
  answerRecordingFileName: string;

  @Column({
    name: 'answer_in_box',
  })
  isAnswerInBox: boolean;

  @Column({
    name: 'is_sub_topic',
  })
  isSubHeading: boolean;

  @Column({
    name: 'limit_listening_times',
  })
  limitListeningTimes: number;

  @ManyToOne(() => SurveyTag, {
    eager: true,
  })
  @JoinColumn({
    name: 'section_tag',
  })
  tag: SurveyTag;

  @Column({
    name: 'label',
  })
  label: string;

  @ManyToMany(() => SurveySkill)
  @JoinTable({
    name: 'survey_skill_rel',
    joinColumn: {
      name: 'question_ids',
    },
    inverseJoinColumn: {
      name: 'skill_ids',
    },
  })
  skills: SurveySkill[];

  @ManyToOne(() => SurveyTag, {
    eager: true,
  })
  @JoinColumn({
    name: 'type_of_question',
  })
  typeOfQuestion: SurveyTag;

  @Column({
    name: 'start_question_index',
  })
  startQuestionIndex: number;

  @Column({
    name: 'is_in_question_bank',
  })
  isInQuestionBank: number;

  @Column({
    name: 'state',
    enum: QuestionState,
  })
  state: QuestionState;

  @Column({
    name: 'end_question_index',
  })
  endQuestionIndex: number;

  // @ManyToOne(() => SurveyUserInput)
  // @JoinColumn({
  //   name: 'input_id',
  // })
  // input: SurveyUserInput;

  @Column({
    name: 'pick_full_test',
  })
  shouldPickAll: boolean;

  @Column({
    name: 'select_and_edit',
  })
  isCorrectingQuestion: boolean;

  deadline: Date;
  limitSectionTime: number | undefined;
  randomTagId: number;
  randomTagName: string;
}
