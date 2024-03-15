import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SurveyMeGetOptionsDto {
  @ApiPropertyOptional({
    isArray: true,
    type: () => Array<Number>,
  })
  tags?: number[];

  @ApiPropertyOptional({
    type: Number,
  })
  page?: number;
}
export class SurveyGetDtoOptions extends SurveyMeGetOptionsDto {
  @ApiPropertyOptional({
    type: Number,
  })
  random?: number;
}
