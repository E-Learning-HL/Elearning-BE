import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyUserInput } from './entities/survey_user_input.entity';
import { SurveyUserInputService } from './survey_user_input.service';
import { SurveyUserInputLineModule } from '../survey_user_input_line/survey_user_input_line.module';
import { SurveySkillModule } from '../survey_skill/survey_skill.module';
import { SurveyModule } from '../survey_survey/survey.module';
import { SurveyQuestionModule } from '../survey_question/survey_question.module';
import { SurveyInputQuestionRel } from './entities/survey_user_input_question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyUserInput, SurveyInputQuestionRel]),
    SurveyUserInputLineModule,
    SurveySkillModule,
    SurveyQuestionModule,
  ],
  providers: [SurveyUserInputService],
  exports: [SurveyUserInputService],
})
export class SurveyUserInputModule {}
