import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { FileEntity } from '../file/entities/file.entity';
import { FileService } from '../file/file.service';
import { Task } from '../tasks/entities/task.entity';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { UserAnswer } from '../user_answers/entities/user_answer.entity';
import { Score } from '../scores/entities/score.entity';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService, FileService],
  imports: [
    TypeOrmModule.forFeature([
      Assignment,
      Task,
      Question,
      Answer,
      FileEntity,
      Lesson,
      UserAnswer,
      Score
    ]),
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
