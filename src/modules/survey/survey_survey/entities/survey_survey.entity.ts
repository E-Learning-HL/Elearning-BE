import { BaseEntity } from 'src/database/base/base.entity';
import { IrAttachment } from 'src/modules/ir/ir_attachment/entities/ir_attachment.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import {
  AfterLoad,
  Column,
  Entity,
  FindManyOptions,
  FindOptionsWhere,
  In,
  IsNull,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Not,
  OneToMany,
  Raw,
} from 'typeorm';
import { SurveyAccessMode } from '../enums/access_mode.enum';
import { SurveyProgressionMode } from '../enums/progression_mode.enum';
import { SurveyScoringType } from '../enums/scoring_type.enum';
import { Exclude } from 'class-transformer';
import { SurveyQuestion } from '../../survey_question/entities/survey_question.entity';
import { SurveyUserInput } from '../../survey_user_input/entities/survey_user_input.entity';
import { SurveyQuestionType } from '../../survey_question/enums/question_type.enum';
import { SerializeOptions } from '@nestjs/common';
import { SurveyTag } from '../../survey_tag/entities/survey_tag.entity';
import { SurveyQuestionLayout } from '../enums/questions_layout';
import {
  SurveySkill,
  SurveySkillRel,
} from '../../survey_skill/entities/survey_skill.entity';

@Entity('survey_survey')
export class Survey extends BaseEntity {
  @Column()
  color: number;

  @Column({
    name: 'questions_layout',
  })
  questionsLayout: SurveyQuestionLayout;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Exclude()
  @Column({
    name: 'access_mode',
    enum: SurveyAccessMode,
  })
  accessMode: SurveyAccessMode;

  @Exclude()
  @Column({
    name: 'progression_mode',
    enum: SurveyProgressionMode,
  })
  progressionMode: SurveyProgressionMode;

  @Column({
    name: 'access_token',
  })
  accessToken: string;

  @Column({
    name: 'scoring_type',
    enum: SurveyScoringType,
  })
  @Exclude()
  scoringType: SurveyScoringType;

  @Column({
    name: 'session_code',
  })
  sessionCode: number;

  @Column({
    type: 'jsonb',
  })
  title: any;

  @Column({
    type: 'jsonb',
  })
  description: any;

  @Column({
    name: 'description_done',
    type: 'jsonb',
  })
  descriptionDone: any;

  @Column()
  @Exclude()
  active: boolean;

  @Column({
    name: 'users_login_required',
  })
  @Exclude()
  requireLogin: boolean;

  @Column({
    name: 'time_limit_ls',
  })
  timeLimitLs: number;
  @Column({
    name: 'users_can_go_back',
  })
  userCanGoback: boolean;

  @Column({
    name: 'is_attempts_limited',
  })
  isAttemptsLimited: boolean;

  @Column({
    name: 'attempts_limit',
  })
  attemptsLimit: number;

  @Column({
    name: 'is_time_limited',
  })
  isTimeLimited: boolean;

  @Column({
    name: 'certification',
  })
  isCertitfication: boolean;

  @Column({
    name: 'certification_give_badge',
  })
  @Exclude()
  isCertificationGiveBadge: boolean;

  @Column({
    name: 'session_speed_rating',
  })
  @Exclude()
  isSpeedRating: boolean;

  @Column({
    name: 'session_start_time',
  })
  @Exclude()
  sessionStartTime: Date;

  @Column({
    name: 'session_question_start_time',
  })
  @Exclude()
  sessionQuestionStartTime: Date;

  @Column({
    name: 'scoring_success_min',
  })
  @Exclude()
  requiredScoreMin: number;

  @Column({
    name: 'time_limit',
  })
  timeLimit: number;

  @Column({
    name: 'is_test',
  })
  isATest: boolean;

  @Column({
    name: 'min_score',
  })
  @Exclude()
  minScore: number;

  @Column({
    name: 'max_score',
  })
  @Exclude()
  maxScore: number;

  @OneToMany(() => SurveyQuestion, (q) => q.survey, {})
  @Exclude()
  questions: SurveyQuestion[];

  @OneToMany(() => SurveyUserInput, (ip) => ip.survey)
  @Exclude()
  surveyInputs: SurveyUserInput[];

  numberOfQuestions: number;
  numberOfPages: number;
  userAttempts: number;

  @ManyToMany(() => SurveyTag, (t) => t.surveys)
  @JoinTable({
    name: 'survey_channel_tag_rel',
    joinColumn: {
      name: 'survey_id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
    },
  })
  tags: SurveyTag[];

  @Column({
    name: 'visible_survey',
  })
  isInvisible: boolean;

  @ManyToMany(() => SurveyTag)
  @JoinTable({
    name: 'survey_exam_code_rel',
    joinColumn: {
      name: 'survey_id',
    },
    inverseJoinColumn: {
      name: 'code_id',
    },
  })
  possibleExamCode: Promise<SurveyTag[]>;

  @Column({
    name: 'is_random_survey',
  })
  isRandomSurvey: boolean;

  @OneToMany(() => SurveySkillRel, (skill) => skill.survey)
  skillConfigs: Promise<SurveySkillRel[]>;

  @AfterLoad()
  public afterLoad() {
    if (this.questions && this.surveyInputs) {
      this.numberOfPages = this.questions.filter((e) => e.isPage).length;
      const nonQuestion = this.questions.filter((e) =>
        [SurveyQuestionType.AUDIO, SurveyQuestionType.ONLY_TITLE].includes(
          e.questionType,
        ),
      ).length;
      this.userAttempts = this.surveyInputs.length;
      this.numberOfQuestions =
        this.questions.length - this.numberOfPages - nonQuestion;
    }
  }
}

export function selectBaseSurveyOptions(
  where?: FindOptionsWhere<Survey>,
): FindManyOptions<Survey> {
  return {
    where: {
      active: true,
      isInvisible: Raw(
        (alias) => `(${alias} IS NULL OR ${alias} = false)
      `,
      ),
      ...where,
    },
    select: {
      id: true,
      title: true,
      description: true,
      accessToken: true,
      attemptsLimit: true,
      accessMode: true,
      requireLogin: true,
      isTimeLimited: true,
      timeLimit: true,
      requiredScoreMin: true,
      updatedAt: true,
      userCanGoback: true,
      questions: {
        id: true,
        isPage: true,
        questionType: true,
        suggestedAnswers: false,
        maxtrixSuggestedAnswers: false,
      },
      surveyInputs: {
        id: true,
      },
      tags: {
        id: true,
        name: true,
        color: true,
        tagGroup: true,
      },
    },
    relations: {
      surveyInputs: true,
      tags: true,
      questions: true,
    },
  };
}
