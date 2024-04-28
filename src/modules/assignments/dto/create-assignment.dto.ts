import { ApiProperty } from '@nestjs/swagger';
import { TASK_TYPE } from 'src/modules/tasks/constants/task-type.enum';
import { ASSIGNINMENT_TYPE } from '../constants/assignment-type.enum';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { QUESTION_TYPE } from 'src/modules/questions/constants/question-type.enum';

class File {
  @ApiProperty()
  @IsOptional()
  response: string;

  @ApiProperty()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsOptional()
  name: string;
}

class Answer {
  @ApiProperty()
  title: string;

  @ApiProperty()
  isCorrect: boolean;
}

class Question {
  @ApiProperty()
  title: string;

  @ApiProperty()
  questionType: QUESTION_TYPE;

  @ApiProperty({
    type: [Answer],
  })
  answer: Answer[];
}

class Task {
  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  time: number;

  @ApiProperty({
    type: [File],
  })
  @IsOptional()
  audio: File[];

  @ApiProperty()
  taskType: TASK_TYPE;

  @ApiProperty({
    type: [Question],
  })
  question: Question[];
}

export class CreateAssignmentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  courseId: number;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  sectionId: number;

  @ApiProperty()
  @IsOptional()
  examType: ASSIGNINMENT_TYPE;

  @ApiProperty({
    type: [Task],
  })
  @IsArray()
  task: Task[];
}
