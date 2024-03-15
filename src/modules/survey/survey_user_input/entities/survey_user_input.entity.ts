import { BaseEntity } from 'src/database/base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Survey } from '../../survey_survey/entities/survey_survey.entity';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { SlideSlide } from 'src/modules/website_slides/slide-slide/entities/slide_slide.entity';
import { SlideSlidePartner } from 'src/modules/website_slides/slide-slide/entities/slide_slide_partner.entity';
import { SurveyQuestion } from '../../survey_question/entities/survey_question.entity';
import { SurveyState } from '../../survey_survey/enums/survey_state.enum';
import { SurveyUserInputLine } from '../../survey_user_input_line/entities/survey_user_input_line.entity';
import { SurveyUserInputTagResult } from '../../survey_tag_result/entities/survey_tag_result.entity';
import { SurveyInputQuestionRel } from './survey_user_input_question.entity';

@Entity('survey_user_input')
export class SurveyUserInput extends BaseEntity {
  @ManyToOne(() => Survey)
  @JoinColumn({
    name: 'survey_id',
  })
  survey: Survey;

  @Column({
    name: 'last_displayed_page_id',
  })
  lastDisplayPageId: number;

  @ManyToOne(() => Partner)
  @JoinColumn({
    name: 'partner_id',
  })
  partner: Partner;

  @Column({
    enum: SurveyState,
  })
  state: SurveyState;

  @Column({
    name: 'access_token',
  })
  accessToken: string;

  @Column({
    name: 'invite_token',
  })
  inviteToken: string;

  @Column({
    name: 'email',
  })
  email: string;

  @Column({
    name: 'nickname',
  })
  nickname: string;

  @Column({
    name: 'test_entry',
  })
  isTestEntry: boolean;

  @Column({
    name: 'scoring_success',
  })
  scoringSuccess: boolean;

  @Column({
    name: 'is_session_answer',
  })
  isSessionAnswer: boolean;

  @Column({
    name: 'start_datetime',
  })
  startDatetime: Date;

  @Column({
    name: 'end_datetime',
  })
  endDatetime: Date;

  @Column({
    name: 'deadline',
  })
  deadline: Date;

  @Column({
    name: 'scoring_percentage',
  })
  scoringPercentage: number = 0;

  @Column({
    name: 'scoring_total',
    type: 'double precision',
  })
  scoringTotal: number = 0;

  @ManyToOne(() => SlideSlide)
  @JoinColumn({
    name: 'slide_id',
  })
  slide: SlideSlide;

  @ManyToOne(() => SlideSlidePartner)
  @JoinColumn({
    name: 'slide_partner_id',
  })
  slidePartner: SlideSlidePartner;

  @ManyToMany(() => SurveyQuestion)
  @JoinTable({
    name: 'survey_question_survey_user_input_rel',
    joinColumn: {
      name: 'survey_user_input_id',
    },
    inverseJoinColumn: {
      name: 'survey_question_id',
    },
  })
  questions: SurveyQuestion[];

  @Column({
    name: 'is_done_full',
  })
  isFullTest: boolean;

  @Column({
    name: 'start_extra_exam',
  })
  startExtraExam: Date;

  @Column({
    name: 'end_extra_exam',
  })
  endExtraExam: Date;

  @Column({
    name: 'exam_code',
  })
  examCode: string;

  @OneToMany(() => SurveyUserInputLine, (line) => line.userInput)
  lines: SurveyUserInputLine[];

  @OneToMany(() => SurveyUserInputTagResult, (e) => e.input)
  tagResults: SurveyUserInputTagResult[];

  // @OneToMany(() => SurveyQuestion, (e) => e.input)
  // randomQuestions: Promise<SurveyQuestion[]>;

  @OneToMany(() => SurveyInputQuestionRel, (e) => e.input)
  questionsRel: SurveyInputQuestionRel[];
}
