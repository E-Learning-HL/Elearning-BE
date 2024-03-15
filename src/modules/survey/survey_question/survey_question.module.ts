import { Module } from '@nestjs/common';
import { SurveyQuestionService } from './survey_question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyQuestion } from './entities/survey_question.entity';
import { SurveyInputQuestionRel } from '../survey_user_input/entities/survey_user_input_question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyQuestion, SurveyInputQuestionRel])],
  providers: [SurveyQuestionService],
  exports: [SurveyQuestionService],
})
export class SurveyQuestionModule {}
