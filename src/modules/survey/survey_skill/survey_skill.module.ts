import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveySkill, SurveySkillRel } from './entities/survey_skill.entity';
import { SurveySkillService } from './survey_skill.service';
import { SurveyQuestionModule } from '../survey_question/survey_question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveySkill, SurveySkillRel]),
    SurveyQuestionModule,
  ],
  exports: [SurveySkillService],
  providers: [SurveySkillService],
})
export class SurveySkillModule {}
