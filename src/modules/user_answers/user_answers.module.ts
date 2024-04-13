import { Module } from '@nestjs/common';
import { UserAnswersService } from './user_answers.service';
import { UserAnswersController } from './user_answers.controller';
import { UserAnswer } from './entities/user_answer.entity';
import { Score } from '../scores/entities/score.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../answers/entities/answer.entity';
import { Question } from '../questions/entities/question.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [UserAnswersController],
  providers: [UserAnswersService],
  imports : [TypeOrmModule.forFeature([UserAnswer, Score, Answer,User, Question, Task])]
})
export class UserAnswersModule {}
