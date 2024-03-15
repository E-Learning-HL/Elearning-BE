import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export enum SurveyExceptionCode {
  TOKEN_EXPIRED = 'token_expired',
  NOT_STARTED = 'not_started',
  CLOSED = 'exam_closed',
  INVALID_EXAMCODE = 'invalid_examcode',
  INVALID_ANSWERTOKEN = 'invalid_answer_token',
}
export type SurveyException = {
  message?: any;
  cause?: any;
  code?: number | HttpStatus;
  scode?: SurveyExceptionCode;
};
