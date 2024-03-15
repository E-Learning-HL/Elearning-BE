import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SurveyStartParamsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  surveyId: number;
  @Type(() => String)
  @ApiProperty()
  token: string;
  @ApiPropertyOptional()
  @Type(() => String)
  answerToken: any;
}
