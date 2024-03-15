import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { SurveyQuestionModule } from '../survey_question/survey_question.module';
import { SurveyQuestionAnswerModule } from '../survey_question_answer/survey_question_answer.module';
import { SurveyUserInputLineModule } from '../survey_user_input_line/survey_user_input_line.module';
import { SurveyUserInputModule } from '../survey_user_input/survey_user_input.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey_survey.entity';
import { IrModelAccessModule } from 'src/modules/ir/ir.model.access/ir_model_access.module';
import { IrAttachmentModule } from 'src/modules/ir/ir_attachment/ir_attachment.module';
import { SurveyListeningService } from './survey_listening.service';
import { SavingSurveyFactoryModule } from './factories/saving_factory/save_factory.module';
import { SurveyTagModule } from '../survey_tag/survey_tag.module';
import { RedisModule } from 'src/modules/redis/redis.module';
import { SurveyUserInputTagResultModule } from '../survey_tag_result/survey_tag_result.module';
import { SurveySkillModule } from '../survey_skill/survey_skill.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Survey]),
    RedisModule,
    SurveyQuestionModule,
    SurveyQuestionAnswerModule,
    SurveyUserInputLineModule,
    SurveyUserInputModule,
    IrModelAccessModule,
    IrAttachmentModule,
    SavingSurveyFactoryModule,
    SurveyTagModule,
    SurveyUserInputTagResultModule,
    SurveySkillModule,
  ],
  controllers: [SurveyController],
  providers: [
    SurveyService,
    SurveyListeningService,
    {
      provide: 'SurveyService',
      useFactory: (surveyService, surveyLsService) => {
        const env = process.env['IS_LS_TEST'] == 'true';
        if (env) {
          return surveyLsService;
        }
        return surveyService;
      },
      inject: [SurveyService, SurveyListeningService],
    },
  ],
  exports: [SurveyService],
})
export class SurveyModule {}
