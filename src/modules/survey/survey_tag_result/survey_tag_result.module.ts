import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyUserInputTagResult } from './entities/survey_tag_result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyUserInputTagResult])],
})
export class SurveyUserInputTagResultModule {}
