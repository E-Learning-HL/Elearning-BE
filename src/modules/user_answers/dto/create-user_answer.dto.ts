import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { QUESTION_TYPE } from 'src/modules/questions/constants/question-type.enum';

class Answer {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  answerId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  answerText: string;
}

class Question {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsOptional()
  questionType: QUESTION_TYPE;

  @ApiProperty({
    type: [Answer],
  })
  answer: Answer[];
}
export class CreateUserAnswerDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  taskId: number;

  @ApiProperty({
    type: [Question],
  })
  @IsOptional()
  question: Question[];
}
