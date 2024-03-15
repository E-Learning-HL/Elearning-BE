import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyQuestionAnswer } from './entities/survey_question_answer.entity';
import { SurveyQuestionAnswerService } from './survey_question_answer.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyQuestionAnswer])],
  providers: [SurveyQuestionAnswerService],
  exports: [SurveyQuestionAnswerService],
})
export class SurveyQuestionAnswerModule {}
