import { Module } from '@nestjs/common';
import { SurveyUserInputLineModule } from 'src/modules/survey/survey_user_input_line/survey_user_input_line.module';
import { AbstractSavingFactory } from './abstract_saving_factory';
import { SavingSurveyInputFactory } from './saving_factory';
import { SurveyUserInputModule } from 'src/modules/survey/survey_user_input/survey_user_input.module';

@Module({
  imports: [SurveyUserInputModule],
  exports: [AbstractSavingFactory],
  providers: [
    {
      provide: AbstractSavingFactory,
      useClass: SavingSurveyInputFactory,
    },
  ],
})
export class SavingSurveyFactoryModule {}
