import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type MatrixAnswerDto = {
  col: number;
  row: number;
};

export class SurveyPostUserAnswerDto {
  @ApiPropertyOptional({
    description:
      'An array of answer id (multiple choice) or answer id (simple choice) for the question',
  })
  value?: number | number[] | string | Date | MatrixAnswerDto[];
}

export class SurveyPostParamsDto {
  // @ApiProperty({
  //   description: 'access_token to access the survey.',
  // })
  // accessToken: string;
  // @ApiProperty()
  // surveyId: number;

  @ApiProperty({
    type: 'object',
  })
  answers: Map<number | string, SurveyPostUserAnswerDto>;
}

export const bodyExample = {
  accessToken: '7c105e48-e6be-493a-bf77-5143ccc474c3',
  surveyId: 10,
  answers: {
    10: {
      answerIdValue: 10,
    },
    11: {
      inputValue: 'User input example',
    },
    12: {
      pathValue:
        'https://docs.google.com/document/d/1vZJ0kI-fEz8W1En6G_zNLRwkffFu0MEqpTGID38P9j8/edit',
    },
    13: {
      answerIdValue: [14, 24],
    },
    14: {
      answerIdValue: [{ id: 13, value: 'does' }],
    },
  },
};
