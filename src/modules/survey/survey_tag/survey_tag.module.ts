import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyTag } from './entities/survey_tag.entity';
import { SurveyTagGroup } from './entities/survey_tag_group.entity';
import { SurveyTagService } from './survey_tag.service';
import { SurveyTagController } from './survey_tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyTag, SurveyTagGroup])],
  providers: [SurveyTagService],
  exports: [SurveyTagService],
  controllers: [SurveyTagController],
})
export class SurveyTagModule {}
