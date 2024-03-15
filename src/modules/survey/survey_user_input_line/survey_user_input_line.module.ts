import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyUserInputLine } from './entities/survey_user_input_line.entity';
import { SurveyUserInputLineService } from './survey_user_input_line.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyUserInputLine])],
  providers: [SurveyUserInputLineService],
  exports: [SurveyUserInputLineService],
})
export class SurveyUserInputLineModule {}
