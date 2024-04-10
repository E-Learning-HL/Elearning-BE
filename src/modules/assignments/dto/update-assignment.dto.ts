import { ApiProperty } from '@nestjs/swagger';
import { TASK_TYPE } from 'src/modules/tasks/constants/task-type.enum';
import { ASSIGNINMENT_TYPE } from '../constants/assignment-type.enum';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QUESTION_TYPE } from 'src/modules/questions/constants/question-type.enum';

class File {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fileId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  response: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}

class Answer {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  answerId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  is_correct: boolean;
}

class Question {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  question_type: QUESTION_TYPE;

  @ApiProperty({
    type: [Answer],
  })
  @IsOptional()
  answer: Answer[];
}

class Task {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  taskId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    type: [File],
  })
  @IsOptional()
  audio: File[];

  @ApiProperty()
  @IsOptional()
  task_type: TASK_TYPE;

  @ApiProperty({
    type: [Question],
  })
  @IsOptional()
  question: Question[];
}

export class UpdateAssignmentDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  course_id: number;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  section_id: number;

  @ApiProperty()
  @IsOptional()
  exam_type: ASSIGNINMENT_TYPE;

  @ApiProperty({
    type: [Task],
  })
  @IsArray()
  @IsOptional()
  task: Task[];
}
