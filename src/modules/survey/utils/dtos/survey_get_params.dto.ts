import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SurveyQuestionType } from '../../survey_question/enums/question_type.enum';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { SurveyAccessMode } from '../../survey_survey/enums/access_mode.enum';
import { SurveyState } from '../../survey_survey/enums/survey_state.enum';
import {
  AnswerState,
  RedisUserAnswer,
} from '../../survey_survey/types/redist_input.type';
import { SurveyScoringType } from '../../survey_survey/enums/scoring_type.enum';
import { SurveyTag } from '../../survey_tag/entities/survey_tag.entity';

export class SurveyGetAnswertDto {
  @ApiPropertyOptional()
  valueImageFileName?: string;
  @ApiProperty()
  value: any;

  @ApiProperty()
  sequence: number;
}

export class SurveyGetMatrixSuggestionDto {
  cols: SurveyGetAnswertDto[];
  rols: SurveyGetAnswertDto[];
}

export class SurveyGetQuestionDto {
  @ApiProperty()
  deadline: Date | undefined;
  @ApiProperty()
  limitSectionTime: number | undefined;
  @ApiProperty()
  questionId: number;
  @ApiProperty()
  pageId: number;
  @ApiProperty()
  sequence: number;
  @ApiProperty()
  questionType: SurveyQuestionType;

  @ApiProperty()
  title: any;

  @ApiProperty()
  description: any;

  @ApiProperty()
  @IsEmail()
  saveAsEmail: boolean;

  @ApiProperty()
  saveAsNickName: boolean;

  @ApiProperty()
  isTimeLimited: boolean;

  @ApiPropertyOptional()
  audioFilename?: string;

  @ApiPropertyOptional()
  questionPlaceholder?: any;

  @ApiPropertyOptional()
  constrErrorMsg?: any;

  @ApiPropertyOptional()
  validationErrorMsg?: any;

  @ApiProperty()
  constrMandatory: boolean;

  @ApiProperty({
    description: 'in second(s)',
  })
  timeLimit: number;

  @ApiProperty()
  validationLengthMin: number;

  @ApiProperty()
  validationLengthMax: number;

  @ApiProperty()
  isSubHeading: boolean;

  @ApiProperty()
  limitListeningTimes: number;

  @ApiProperty({
    type: SurveyGetAnswertDto,
    isArray: true,
  })
  suggestedAnswers?: SurveyGetAnswertDto[] | SurveyGetMatrixSuggestionDto;
  isAnswerInBox: boolean;

  @ApiProperty()
  isCorrectingQuestion: boolean;

  @ApiPropertyOptional({
    description:
      'Used to determine how much answer that user can select in multiple choice question.',
  })
  maxSelectionNumber?: number;
  @ApiPropertyOptional()
  tagId?: number | undefined;

  @ApiPropertyOptional()
  tagName?: string | undefined;
}

export class SurveyGetPageDto {
  @ApiProperty()
  page: Pick<
    SurveyGetQuestionDto,
    | 'questionId'
    | 'title'
    | 'description'
    | 'audioFilename'
    | 'deadline'
    | 'limitSectionTime'
    | 'tagId'
    | 'tagName'
  >;
  @ApiProperty({
    type: SurveyGetQuestionDto,
    isArray: true,
  })
  questions: SurveyGetQuestionDto[];
}
export class SurveyGetReturnDto {
  @ApiProperty()
  scoringType: SurveyScoringType;

  @ApiPropertyOptional({
    enum: SurveyAccessMode,
  })
  accessMode?: SurveyAccessMode;

  @ApiProperty()
  isRandomSurvey: boolean;

  @ApiProperty()
  surveyId: number;

  @ApiProperty({
    description: 'use this token to access survey.',
  })
  accessToken: string;

  @ApiProperty({
    description: 'in minute(s)',
  })
  timeLimit: number;

  @ApiPropertyOptional({
    description: 'in minute(s)',
  })
  timeLSLimit?: number;

  @ApiPropertyOptional()
  answerToken?: string;

  @ApiProperty()
  title: any;

  @ApiProperty()
  description: any;

  @ApiProperty()
  descriptionDone: any;

  @ApiProperty()
  userCanGoback: boolean;

  @ApiProperty()
  isAttemptsLimited: boolean;

  @ApiProperty()
  isTimeLimited: boolean;

  @ApiProperty()
  isCertitfication: boolean;

  @ApiProperty()
  isATest: boolean;

  @ApiProperty({
    type: SurveyGetPageDto,
    isArray: true,
  })
  pages: SurveyGetPageDto[];

  @ApiProperty()
  startDateTime: Date;
  @ApiProperty()
  attemptsLeft: number;

  @ApiProperty()
  state: SurveyState;

  @ApiProperty()
  partnerId: number;

  @ApiProperty()
  userAnswerData: RedisUserAnswer;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  initialData: any;
}
