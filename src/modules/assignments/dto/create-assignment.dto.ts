import { ApiProperty } from '@nestjs/swagger';
import { TASK_TYPE } from 'src/modules/tasks/constants/task-type.enum';
import { ASSIGNINMENT_TYPE } from '../constants/assignment-type.enum';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { QUESTION_TYPE } from 'src/modules/questions/constants/question-type.enum';

class File {
  @ApiProperty()
  response: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;
}

class Answer {
  @ApiProperty()
  title: string;

  @ApiProperty()
  is_correct: boolean;
}

class Question {
  @ApiProperty()
  title: string;

  //   @ApiProperty()
  //   question_type: QUESTION_TYPE;

  @ApiProperty({
    type: [Answer],
  })
  answer: Answer[];
}

// class ListeningQuestion {
//   @ApiProperty({
//     type: [File],
//   })
//   audio: File[];

//   @ApiProperty()
//   content: string;

//   @ApiProperty({
//     type: [Question],
//   })
//   question: Question[];
// }

// class ReadingQuestion {
//   @ApiProperty()
//   content: string;

//   @ApiProperty({
//     type: [Question],
//   })
//   question: Question[];
// }

class Task {
  @ApiProperty()
  content: string;

  @ApiProperty({
    type: [File],
  })
  audio: File[];

  // @ApiProperty({
  //   type: [ListeningQuestion],
  // })
  // listening: ListeningQuestion[];

  // @ApiProperty({
  //   type: [ReadingQuestion],
  // })
  // reading: ReadingQuestion[];

  @ApiProperty()
  task_type: TASK_TYPE;

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
  task: Task[];
}
