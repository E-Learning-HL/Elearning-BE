import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTag } from './entities/survey_tag.entity';
import { Repository } from 'typeorm';
import { Survey } from '../survey_survey/entities/survey_survey.entity';
import { SurveyTagGroup } from './entities/survey_tag_group.entity';
import { paginate } from 'src/utils/pagination';

@Injectable()
export class SurveyTagService {
  constructor(
    @InjectRepository(SurveyTag) private tagRepos: Repository<SurveyTag>,
    @InjectRepository(SurveyTagGroup)
    private groupRepos: Repository<SurveyTagGroup>,
  ) {}
  async getTagsByName(name: string) {
    if (!name) {
      return [];
    }
    return this.tagRepos.query(
      `select * from survey_channel_tag 
        where Lower(name->>'en_US') like $1`,
      [`%${name.toLowerCase()}%`],
    );
  }
  async getAllTags(page?: number) {
    return paginate(
      this.tagRepos,
      {
        page: page || 1,
        limit: Number(process.env['RECORD_PER_PAGE']) || 15,
      },
      {
        where: {
          tagGroup: {
            isPublished: true,
          },
        },
        relations: {
          tagGroup: true,
        },
      },
    );
  }

  async getGroups(page?: number) {
    return paginate(
      this.groupRepos,
      {
        page: page || 1,
        limit: Number(process.env['RECORD_PER_PAGE']) || 15,
      },
      {
        where: {
          isPublished: true,
        },
        relations: {
          tags: true,
        },
      },
    );
  }
}
